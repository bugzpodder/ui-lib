// @flow
import moment from "moment-timezone";
import { EPOCH_DATE, EPOCH_DATE_TIME } from "../../constants/date-constants";

import { formatDate, formatDateTime } from "./date-util";

moment.tz.setDefault("America/Los_Angeles");

const formattedEpochDate = "1970-01-01";
const formattedDate = "2018-04-20";
const formattedDateAtStartOfDay = "2018-04-20T07:00:00.000Z";
const formattedDateTime = "2018-04-20T18:05:01.000Z";
const longDate = "2018-04-20T18:05:01Z";
const shortDate = "2018-04-20";

// dateToString is the format used by new Date().toString();
const date = new Date("Thu Apr 20 2018 11:05:01 GMT-0700 (PDT)");

describe("date formatting", () => {
  it(`converts a Date object to "${formattedDate}"`, () => {
    expect(formatDate(date)).toEqual(formattedDate);
  });

  it(`converts empty string to "${EPOCH_DATE}"`, () => {
    expect(formatDate("")).toEqual(formattedEpochDate);
  });

  it("converts null to null", () => {
    expect(formatDate(null)).toEqual(null);
  });
});

describe("datetime formatting", () => {
  it(`converts "${longDate}" to "${formattedDateTime}"`, () => {
    expect(formatDateTime(longDate)).toEqual(formattedDateTime);
  });

  it(`converts "${shortDate}" to "${formattedDateAtStartOfDay}"`, () => {
    expect(formatDateTime(shortDate)).toEqual(formattedDateAtStartOfDay);
  });

  it(`converts a Date object to "${formattedDateTime}"`, () => {
    expect(formatDateTime(date)).toEqual(formattedDateTime);
  });

  it(`converts empty string to "${EPOCH_DATE_TIME}"`, () => {
    expect(formatDateTime("")).toEqual(EPOCH_DATE_TIME);
  });

  it("converts null to null", () => {
    expect(formatDateTime(null)).toEqual(null);
  });
});
