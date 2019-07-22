// @flow
import { DOMAINS } from "./sidebar-content";

export type MODE_TYPES = "dev" | "sandbox" | "staging" | "prod";

const { EDC, LIMS } = DOMAINS;

export const SERVER_URLS_BY_MODE = {
  dev: {
    [EDC]: "https://edc-client-staging.eng.aws.grail.com",
    [LIMS]: "http://localhost:3000",
  },
  sandbox: {
    [EDC]: "https://edc-client-sandbox.eng.aws.grail.com",
    [LIMS]: "https://sandbox.lims.grail.com",
  },
  staging: {
    [EDC]: "https://edc-client-staging.eng.aws.grail.com",
    [LIMS]: "https://staging.lims.grail.com",
  },
  prod: {
    [EDC]: "https://edc.grail.com",
    [LIMS]: "https://prod.lims.grail.com",
  },
};

export const DEV_SERVER_URLS = SERVER_URLS_BY_MODE.dev;
