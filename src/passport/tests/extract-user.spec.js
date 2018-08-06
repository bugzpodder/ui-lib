// @flow

import curry from "lodash/curry";
import merge from "lodash/merge";

import { extractGoogleInfo, extractUser } from "../passport-utils";

const baseUser = {
  accessToken: "some long access token",
  refreshToken: "some long refresh token",
};
const extractUserWithTokens = curry(extractUser)(baseUser.accessToken, baseUser.refreshToken);

describe("extractUser", () => {
  it("should extract user", () => {
    const exp = Date.now() + 1000;
    const expectedUser = merge(
      {
        email: "test@test.com",
        givenName: "Test",
        familyName: "User",
        pictureUrl: "https://www.google.com",
        idToken: "some long id token",
        expirationInSeconds: exp,
        endOfIdToken: "id token",
        endOfRefreshToken: "sh token",
      },
      baseUser,
    );
    expect(
      extractUserWithTokens({
        email: "test@test.com",
        given_name: "Test",
        family_name: "User",
        picture: "https://www.google.com",
        idToken: "some long id token",
        exp,
      }),
    ).toEqual(expectedUser);
  });
});

describe("extractGoogleInfo", () => {
  it("should extract Google Info", () => {
    const exp = Date.now() + 1000;
    const user = merge(
      {
        email: "test@test.com",
        givenName: "Test",
        familyName: "User",
        pictureUrl: "https://www.google.com",
        idToken: "some long id token",
        expirationInSeconds: exp,
        endOfIdToken: "id token",
        endOfRefreshToken: "sh token",
      },
      baseUser,
    );
    const expectedInfo = merge({
      email: "test@test.com",
      given_name: "Test",
      family_name: "User",
      picture: "https://www.google.com",
      idToken: "some long id token",
      exp,
    });
    expect(extractGoogleInfo(user)).toEqual(expectedInfo);
  });
});
