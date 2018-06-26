// @flow

import merge from "lodash/merge";
import Strategy from "passport-strategy";
import { google } from "googleapis";
import fetch from "node-fetch";
import qs from "qs";

import { extractUser, extractGoogleInfo, type User, type GoogleUserInfo } from "./passport-utils";

export const refreshAccessToken = (user: User, googleAuthConfig: GoogleAuthConfig) => {
	const postData = {
		client_id: googleAuthConfig.clientId,
		client_secret: googleAuthConfig.clientSecret,
		refresh_token: user.refreshToken,
		grant_type: "refresh_token",
	};
	return fetch("https://www.googleapis.com/oauth2/v4/token", {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
		},
		body: qs.stringify(postData),
	}).then(res => {
		return res.json().then(({ error, id_token: idToken, expires_in: expiresInSeconds }) => {
			if (error) {
				console.error(error);
				user.email = "";
				user.idToken = "";
				user.expirationInSeconds = 0;
				return false;
			}
			merge(
				user,
				extractUser(user.accessToken, user.refreshToken, {
					...extractGoogleInfo(user),
					idToken,
					exp: expiresInSeconds + Date.now() / 1000,
				}),
			);
			return true;
		});
	});
};

type verifyCallback = (?Error, ?User) => void;

// This authorization strategy uses Google to obtain a JWT token.
// Forked from Grail EDC
export class GoogleJwtStrategy extends Strategy {
	constructor(googleAuthConfig: GoogleAuthConfig, verify: (string, string, GoogleUserInfo, verifyCallback) => void) {
		super();
		this.name = "google-jwt";
		this.googleAuthConfig = googleAuthConfig;
		this._verify = verify;
		this._scopeSeparator = " ";
	}
	authenticate(req: express$Request) {
		if (req.query && req.query.error) {
			return this.fail();
		}
		const { OAuth2 } = google.auth;
		const { clientId, clientSecret, callbackUrl } = this.googleAuthConfig;
		const oauth2Client = new OAuth2(clientId, clientSecret, callbackUrl);
		if (req.query && req.query.code) {
			oauth2Client.getToken(req.query.code, (err, tokens) => {
				if (err) {
					console.error(`token error:${err}`);
					return err;
				}
				oauth2Client.setCredentials(tokens);
				const idToken = tokens.id_token;
				let info;
				if (idToken) {
					info = JSON.parse(new Buffer(idToken.split(".")[1], "base64").toString("utf8"));
					info.idToken = idToken;
				}

				this._verify(tokens.access_token, tokens.refresh_token, info, (error, user, data) => {
					if (error) {
						return this.error(error);
					}
					if (!user) {
						return this.fail(data);
					}
					this.success(user, data);
				});
			});
		} else {
			const authUrl = oauth2Client.generateAuthUrl({
				access_type: "offline",
				scope: ["email", "profile"],
				expiry_date: Date.now() + 30 * 24 * 3600 * 1000,
				prompt: "consent",
			});
			this.redirect(authUrl);
		}
	}
}
