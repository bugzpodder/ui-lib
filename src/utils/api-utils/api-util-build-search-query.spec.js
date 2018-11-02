// @flow
import "../mocks";
import moment from "moment-timezone";

import {
  BOOLEAN_SEARCH_TYPE,
  DATETIME_SEARCH_TYPE,
  DATE_SEARCH_TYPE,
  FULL_ID_SEARCH_TYPE,
  FULL_TEXT_SEARCH_TYPE,
  LIKE_ID_SEARCH_TYPE,
  LIKE_TEXT_SEARCH_TYPE,
  MULTI_FIELD_TEXT_SEARCH_TYPE,
  NUMERIC_SEARCH_TYPE,
  STRING_END_CHAR,
  STRING_START_CHAR,
  doubleAmpersand,
  doublePipe,
  percentChar,
} from "./api-constants";
import { buildSearchQuery } from "./api-util";

moment.tz.setDefault("America/Los_Angeles");

describe("buildSearchQuery", () => {
  it("should generate no query for no search", () => {
    expect(buildSearchQuery()).toEqual("");
  });
});

describe("buildSearchQuery for full text search", () => {
  it("should generate no query for empty string search", () => {
    expect(
      buildSearchQuery([
        {
          name: "column1",
          values: [""],
          type: FULL_TEXT_SEARCH_TYPE,
          searchFields: ["column1"],
        },
      ]),
    ).toEqual("");
  });
  it("should generate query for one element", () => {
    expect(
      buildSearchQuery([
        {
          name: "column1",
          values: ["abc"],
          type: FULL_TEXT_SEARCH_TYPE,
          searchFields: ["column1"],
        },
      ]),
    ).toEqual('(column1=="abc")');
  });
});

describe("buildSearchQuery for like text search", () => {
  it("should generate no query for empty string search", () => {
    expect(
      buildSearchQuery([
        {
          name: "column1",
          values: [""],
          type: LIKE_TEXT_SEARCH_TYPE,
          searchFields: ["column1"],
        },
      ]),
    ).toEqual("");
  });
  it("should generate query for one element", () => {
    expect(
      buildSearchQuery([
        {
          name: "column1",
          values: ["abc"],
          type: LIKE_TEXT_SEARCH_TYPE,
          searchFields: ["column1"],
        },
      ]),
    ).toEqual(`(column1=="${percentChar}abc${percentChar}")`);
  });
  it("should generate query for one element with STRING_START_CHAR prefix", () => {
    expect(
      buildSearchQuery([
        {
          name: "column1",
          values: [`${STRING_START_CHAR}abc`],
          type: LIKE_TEXT_SEARCH_TYPE,
          searchFields: ["column1"],
        },
      ]),
    ).toEqual(`(column1=="abc${percentChar}")`);
  });
  it("should generate query for one element with STRING_END_CHAR suffix", () => {
    expect(
      buildSearchQuery([
        {
          name: "column1",
          values: [`abc${STRING_END_CHAR}`],
          type: LIKE_TEXT_SEARCH_TYPE,
          searchFields: ["column1"],
        },
      ]),
    ).toEqual(`(column1=="${percentChar}abc")`);
  });
  it("should generate query for one element with STRING_START_CHAR prefix and STRING_END_CHAR suffix", () => {
    expect(
      buildSearchQuery([
        {
          name: "column1",
          values: [`${STRING_START_CHAR}abc${STRING_END_CHAR}`],
          type: LIKE_TEXT_SEARCH_TYPE,
          searchFields: ["column1"],
        },
      ]),
    ).toEqual('(column1=="abc")');
  });
});

describe("buildSearchQuery for full id search", () => {
  it("should generate no query for empty string search", () => {
    expect(
      buildSearchQuery([
        {
          name: "column1",
          values: [""],
          type: FULL_ID_SEARCH_TYPE,
          searchFields: ["column1"],
        },
      ]),
    ).toEqual("");
  });
  it("should generate query for one element", () => {
    expect(
      buildSearchQuery([
        {
          name: "column1",
          values: ["P00100-1"],
          type: FULL_ID_SEARCH_TYPE,
          searchFields: ["column1"],
        },
      ]),
    ).toEqual('(column1=="P00100-1"||column1=="P001001")');
  });
  it("should generate query for one accession label element", () => {
    expect(
      buildSearchQuery([
        {
          name: "column1",
          values: ["A00100-1"],
          type: FULL_ID_SEARCH_TYPE,
          searchFields: ["column1"],
        },
      ]),
    ).toEqual('(column1=="A00100-1")');
  });
});

describe("buildSearchQuery for like id search", () => {
  it("should generate no query for empty string search", () => {
    expect(
      buildSearchQuery([
        {
          name: "column1",
          values: [""],
          type: LIKE_ID_SEARCH_TYPE,
          searchFields: ["column1"],
        },
      ]),
    ).toEqual("");
  });
  it("should generate query for one element", () => {
    expect(
      buildSearchQuery([
        {
          name: "column1",
          values: ["P00100-1"],
          type: LIKE_ID_SEARCH_TYPE,
          searchFields: ["column1"],
        },
      ]),
    ).toEqual(`(column1=="${percentChar}P00100-1${percentChar}"||column1=="${percentChar}P001001${percentChar}")`);
  });
  it("should generate query for one accession label element", () => {
    expect(
      buildSearchQuery([
        {
          name: "column1",
          values: ["A00100-1"],
          type: LIKE_ID_SEARCH_TYPE,
          searchFields: ["column1"],
        },
      ]),
    ).toEqual(`(column1=="${percentChar}A00100-1${percentChar}")`);
  });
});

describe("buildSearchQuery for numeric search", () => {
  it("should generate no query for empty search", () => {
    expect(
      buildSearchQuery(
        new Map().set("column1", {
          value: undefined,
          type: NUMERIC_SEARCH_TYPE,
        }),
      ),
    ).toEqual("");
  });
  it("should generate query for 0 search", () => {
    expect(
      buildSearchQuery(
        new Map().set("column1", {
          value: 0,
          type: NUMERIC_SEARCH_TYPE,
        }),
      ),
    ).toEqual("(column1==0)");
  });
  it("should generate query for one element", () => {
    expect(
      buildSearchQuery(
        new Map().set("column1", {
          value: 123,
          type: NUMERIC_SEARCH_TYPE,
        }),
      ),
    ).toEqual("(column1==123)");
  });
});

describe("buildSearchQuery for boolean search", () => {
  it("should generate no query for empty search", () => {
    expect(
      buildSearchQuery(
        new Map().set("column1", {
          value: undefined,
          type: BOOLEAN_SEARCH_TYPE,
        }),
      ),
    ).toEqual("");
  });
  it("should generate query for false search", () => {
    expect(
      buildSearchQuery(
        new Map().set("column1", {
          value: false,
          type: BOOLEAN_SEARCH_TYPE,
        }),
      ),
    ).toEqual("(column1==false)");
  });
  it("should generate query for one element", () => {
    expect(
      buildSearchQuery(
        new Map().set("column1", {
          value: true,
          type: BOOLEAN_SEARCH_TYPE,
        }),
      ),
    ).toEqual("(column1==true)");
  });
});

describe("buildSearchQuery for multi field search", () => {
  it("should generate no query for empty string search", () => {
    expect(
      buildSearchQuery(
        new Map().set("column1", {
          value: "",
          type: MULTI_FIELD_TEXT_SEARCH_TYPE,
          searchFields: ["column1", "column2"],
        }),
      ),
    ).toEqual("");
  });
  it("should generate query for elements", () => {
    expect(
      buildSearchQuery(
        new Map().set("column1", {
          value: "123",
          type: MULTI_FIELD_TEXT_SEARCH_TYPE,
          searchFields: ["column1", "column2"],
        }),
      ),
    ).toEqual(
      `((column1=="${percentChar}123${percentChar}")${doublePipe}(column2=="${percentChar}123${percentChar}"))`,
    );
  });
});

describe("buildSearchQuery for multi value search", () => {
  it("should generate no query for empty array", () => {
    expect(
      buildSearchQuery(
        new Map().set("column1", {
          values: [],
          type: FULL_TEXT_SEARCH_TYPE,
        }),
      ),
    ).toEqual("");
  });
  it("should generate query for Like text search elements", () => {
    expect(
      buildSearchQuery(
        new Map().set("column1", {
          type: LIKE_TEXT_SEARCH_TYPE,
          values: ["123", "345"],
        }),
      ),
    ).toEqual(`(column1=="${percentChar}123${percentChar}"${doublePipe}column1=="${percentChar}345${percentChar}")`);
  });
  it("should generate query for Numeric text search elements", () => {
    expect(
      buildSearchQuery(
        new Map().set("column1", {
          type: NUMERIC_SEARCH_TYPE,
          values: [123, 345.6],
        }),
      ),
    ).toEqual(`(column1==123${doublePipe}column1==345.6)`);
  });
  it("should generate query for Boolean text search elements", () => {
    expect(
      buildSearchQuery(
        new Map().set("column1", {
          type: BOOLEAN_SEARCH_TYPE,
          values: [true, false], // Technically, this is silly...
        }),
      ),
    ).toEqual(`(column1==true${doublePipe}column1==false)`);
  });
  it("should generate query for Full text search elements", () => {
    expect(
      buildSearchQuery(
        new Map().set("column1", {
          type: FULL_TEXT_SEARCH_TYPE,
          values: ["123", "345"],
        }),
      ),
    ).toEqual(`(column1=="123"${doublePipe}column1=="345")`);
  });
});

describe("buildSearchQuery for datetime search", () => {
  const date = "2017-04-20T16:20:00.000Z";
  const startOfDay = moment(date)
    .startOf("day")
    .toISOString();
  const endOfDay = moment(date)
    .endOf("day")
    .toISOString();
  it("should generate query for start date", () => {
    expect(
      buildSearchQuery(
        new Map().set("date", {
          values: [date, undefined],
          type: DATETIME_SEARCH_TYPE,
        }),
      ),
    ).toEqual(`(date>="${startOfDay}")`);
  });
  it("should generate query for end date with null startDate", () => {
    expect(
      buildSearchQuery(
        new Map().set("date", {
          values: [null, date],
          type: DATETIME_SEARCH_TYPE,
        }),
      ),
    ).toEqual(`(date<="${endOfDay}")`);
  });
  it("should generate query for end date with empty string startDate", () => {
    expect(
      buildSearchQuery(
        new Map().set("date", {
          values: ["", date],
          type: DATETIME_SEARCH_TYPE,
        }),
      ),
    ).toEqual(`(date<="${endOfDay}")`);
  });
  const newStartDate = "2016-04-20T16:20:00.000Z";
  const newStartOfDay = moment(newStartDate)
    .startOf("day")
    .toISOString();
  it("should generate query for start and end date", () => {
    expect(
      buildSearchQuery(
        new Map().set("date", {
          values: [newStartDate, date],
          type: DATETIME_SEARCH_TYPE,
        }),
      ),
    ).toEqual(`(date>="${newStartOfDay}"${doubleAmpersand}date<="${endOfDay}")`);
  });
  it("should generate query for reversed start and end date", () => {
    expect(
      buildSearchQuery(
        new Map().set("date", {
          values: [date, newStartDate],
          type: DATETIME_SEARCH_TYPE,
        }),
      ),
    ).toEqual(`(date>="${newStartOfDay}"${doubleAmpersand}date<="${endOfDay}")`);
  });
  it("should generate query for no dates", () => {
    expect(
      buildSearchQuery(
        new Map().set("date", {
          values: [],
          type: DATETIME_SEARCH_TYPE,
        }),
      ),
    ).toEqual("");
  });
});

describe("buildSearchQuery for date search", () => {
  const date = "2017-04-20";
  it("should generate query for start date", () => {
    expect(
      buildSearchQuery(
        new Map().set("date", {
          values: [date, undefined],
          type: DATE_SEARCH_TYPE,
        }),
      ),
    ).toEqual(`(date>="${date}")`);
  });
  it("should generate query for end date with null startDate", () => {
    expect(
      buildSearchQuery(
        new Map().set("date", {
          values: [null, date],
          type: DATE_SEARCH_TYPE,
        }),
      ),
    ).toEqual(`(date<="${date}")`);
  });
  it("should generate query for end date with empty string startDate", () => {
    expect(
      buildSearchQuery(
        new Map().set("date", {
          values: ["", date],
          type: DATE_SEARCH_TYPE,
        }),
      ),
    ).toEqual(`(date<="${date}")`);
  });
  const newStartDate = "2016-04-20";
  it("should generate query for start and end date", () => {
    expect(
      buildSearchQuery(
        new Map().set("date", {
          values: [newStartDate, date],
          type: DATE_SEARCH_TYPE,
        }),
      ),
    ).toEqual(`(date>="${newStartDate}"${doubleAmpersand}date<="${date}")`);
  });
  it("should generate query for reversed start and end date", () => {
    expect(
      buildSearchQuery(
        new Map().set("date", {
          values: [date, newStartDate],
          type: DATE_SEARCH_TYPE,
        }),
      ),
    ).toEqual(`(date>="${newStartDate}"${doubleAmpersand}date<="${date}")`);
  });
  it("should generate query for no dates", () => {
    expect(
      buildSearchQuery(
        new Map().set("date", {
          values: [],
          type: DATE_SEARCH_TYPE,
        }),
      ),
    ).toEqual("");
  });
});

describe("buildSearchQuery for raw query", () => {
  it("should generate query for given query", () => {
    expect(
      buildSearchQuery(
        new Map().set("someQueryName", {
          deprecatedRawQuery: "(x==6||y==7) && (z==4)",
        }),
      ),
    ).toEqual("((x==6||y==7) && (z==4))");
  });
});

describe("buildSearchQuery for several search items", () => {
  it("should generate query for several search elements", () => {
    expect(
      buildSearchQuery(
        new Map()
          .set("column1", {
            value: 123,
            type: NUMERIC_SEARCH_TYPE,
          })
          .set("column2", {
            value: "def xyz",
            type: FULL_TEXT_SEARCH_TYPE,
          })
          .set("column3", {
            value: "some string",
            type: LIKE_TEXT_SEARCH_TYPE,
          }),
      ),
    ).toEqual(
      `(column1==123)${doubleAmpersand}(column2=="def%20xyz")${doubleAmpersand}(column3=="${percentChar}some%20string${percentChar}")`,
    );
  });
  it("should generate query for several search elements when one is empty string", () => {
    expect(
      buildSearchQuery(
        new Map()
          .set("column1", {
            value: 123,
            type: NUMERIC_SEARCH_TYPE,
          })
          .set("column2", {
            value: "",
            type: FULL_TEXT_SEARCH_TYPE,
          })
          .set("column3", {
            value: "some string",
            type: LIKE_TEXT_SEARCH_TYPE,
          }),
      ),
    ).toEqual(`(column1==123)${doubleAmpersand}(column3=="${percentChar}some%20string${percentChar}")`);
  });
  it("should generate query for several search elements when the last string is empty string (See T1661)", () => {
    expect(
      buildSearchQuery(
        new Map()
          .set("column1", {
            value: 123,
            type: NUMERIC_SEARCH_TYPE,
          })
          .set("column2", {
            value: "",
            type: FULL_TEXT_SEARCH_TYPE,
          }),
      ),
    ).toEqual("(column1==123)");
  });
});

describe("buildSearchQuery is invalid", () => {
  it("should throw an error for an invalid search type", () => {
    const INVALID = Symbol("UNIT_TEST INVALID_SYMBOL");
    const searchOptions = [
      {
        name: "column1",
        values: ["abc"],
        type: INVALID,
        searchFields: ["column1"],
      },
    ];
    expect(buildSearchQuery.bind(null, searchOptions)).toThrow(
      new Error("Unknown search type: Symbol(UNIT_TEST INVALID_SYMBOL)"),
    );
  });
  it("should return if date search field value is invalid", () => {
    expect(
      buildSearchQuery([
        {
          name: "column1",
          values: [],
          type: DATETIME_SEARCH_TYPE,
          searchFields: ["column1"],
        },
      ]),
    ).toEqual("");
  });
  it("should return if no search options are present", () => {
    expect(buildSearchQuery([])).toEqual("");
  });
});

describe("buildSearchQuery for uri encoding", () => {
  it("should encode URI query values", () => {
    expect(
      buildSearchQuery([
        {
          name: "column1",
          values: ["abc & 123", "xyz"],
          type: FULL_TEXT_SEARCH_TYPE,
          searchFields: ["column1"],
        },
      ]),
    ).toEqual(`(column1=="abc%20%26%20123"${doublePipe}column1=="xyz")`);
  });
});
