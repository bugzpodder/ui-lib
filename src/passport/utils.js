// @flow

// User is the object we maintain in the request session.
export type User = {
	email: string,
	givenName: string,
	familyName: string,
	pictureUrl: string,
	idToken: string,
	accessToken: string,
	refreshToken: string,
	expirationInSeconds: number,
};

// GoogleUserInfo comes from GoogleOauth.
export type GoogleUserInfo = {
	email: string,
	given_name: string,
	family_name: string,
	picture: string,
	idToken: string,
	exp: number,
};

// Extracts session user from google oauth info.
export const extractUser = (accessToken: string, refreshToken: string, info: GoogleUserInfo): User => {
	const {
		email,
		given_name: givenName,
		family_name: familyName,
		picture: pictureUrl,
		idToken,
		exp: expirationInSeconds,
	} = info;
	return {
		email,
		givenName,
		familyName,
		pictureUrl,
		idToken,
		accessToken,
		refreshToken,
		expirationInSeconds,
		endOfIdToken: idToken.slice(-8),
		endOfRefreshToken: refreshToken.slice(-8),
	};
};

// Extracts Google Info from session user.
export const extractGoogleInfo = (user: User): GoogleUserInfo => {
	const { email, givenName, familyName, pictureUrl, idToken, expirationInSeconds } = user;
	return {
		email,
		picture: pictureUrl,
		given_name: givenName,
		family_name: familyName,
		idToken,
		exp: expirationInSeconds,
	};
};
