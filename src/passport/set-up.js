// @flow
// load all the things we need
import { type Passport } from "passport";

import { GoogleJwtStrategy } from "./google-strategy";
import { extractUser } from "./passport-utils";

export const setUpPassport = (passport: Passport, googleAuthConfig: GoogleAuthConfig) => {
  console.warn("`setUpPassport` has moved to `@grail/server-lib`");
  // required for persistent login sessions
  // passport needs ability to serialize and deserialize users out of session
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });

  const strategy = new GoogleJwtStrategy(googleAuthConfig, (accessToken, refreshToken, info, done) => {
    const email = String(info.email);
    if (!email.endsWith("grailbio.com")) {
      return done(new Error(`Must sign in with grailbio.com account, not ${email}`));
    }
    return done(null, extractUser(accessToken, refreshToken, info));
  });
  passport.use(strategy);
};
