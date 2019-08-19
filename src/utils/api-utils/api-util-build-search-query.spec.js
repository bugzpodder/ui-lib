// @flow
import "../mocks";
import moment from "moment-timezone";

import {
  BOOLEAN_SEARCH_TYPE,
  DATETIME_SEARCH_TYPE,
  DATE_SEARCH_TYPE,
  ENCODED_EQUAL_CHAR,
  ENCODED_QUOTE_CHAR,
  FULL_ID_SEARCH_TYPE,
  FULL_TEXT_SEARCH_TYPE,
  LIKE_ID_SEARCH_TYPE,
  LIKE_TEXT_SEARCH_TYPE,
  NUMERIC_SEARCH_TYPE,
  STRING_END_CHAR,
  STRING_START_CHAR,
  URI_QUERY_TYPE,
} from "./api-constants";
import {
  buildCustomURIQueryParams,
  buildQuery,
  buildSearchQuery,
  deprecatedBuildSearchQuery,
} from "./api-util";

moment.tz.setDefault("America/Los_Angeles");

describe("buildSearchQuery", () => {
  it("should generate no query for no search", () => {
    expect(buildSearchQuery()).resolves.toEqual("");
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
        },
      ])
    ).resolves.toEqual("");
  });
  it("should generate query for one element", () => {
    expect(
      buildSearchQuery([
        {
          name: "column1",
          values: ["abc"],
          type: FULL_TEXT_SEARCH_TYPE,
        },
      ])
    ).resolves.toEqual('column1=="abc"');
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
        },
      ])
    ).resolves.toEqual("");
  });
  it("should generate query for one element", () => {
    expect(
      buildSearchQuery([
        {
          name: "column1",
          values: ["abc"],
          type: LIKE_TEXT_SEARCH_TYPE,
        },
      ])
    ).resolves.toEqual('column1=="%abc%"');
  });
  it("should generate query for one element with STRING_START_CHAR prefix", () => {
    expect(
      buildSearchQuery([
        {
          name: "column1",
          values: [`${STRING_START_CHAR}abc`],
          type: LIKE_TEXT_SEARCH_TYPE,
        },
      ])
    ).resolves.toEqual('column1=="abc%"');
  });
  it("should generate query for one element with STRING_END_CHAR suffix", () => {
    expect(
      buildSearchQuery([
        {
          name: "column1",
          values: [`abc${STRING_END_CHAR}`],
          type: LIKE_TEXT_SEARCH_TYPE,
        },
      ])
    ).resolves.toEqual('column1=="%abc"');
  });
  it("should generate query for one element with STRING_START_CHAR prefix and STRING_END_CHAR suffix", () => {
    expect(
      buildSearchQuery([
        {
          name: "column1",
          values: [`${STRING_START_CHAR}abc${STRING_END_CHAR}`],
          type: LIKE_TEXT_SEARCH_TYPE,
        },
      ])
    ).resolves.toEqual('column1=="abc"');
  });
  it("should generate query for one element with quotes", () => {
    expect(
      buildSearchQuery([
        {
          name: "column1",
          values: ['"abc"'],
          type: LIKE_TEXT_SEARCH_TYPE,
        },
      ])
    ).resolves.toEqual('column1=="abc"');
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
        },
      ])
    ).resolves.toEqual("");
  });
  it("should generate query for one element", () => {
    expect(
      buildSearchQuery([
        {
          name: "column1",
          values: ["P00100-1"],
          type: FULL_ID_SEARCH_TYPE,
        },
      ])
    ).resolves.toEqual('column1=="P00100-1"||column1=="P001001"');
  });
  it("should generate query for one accession label element", () => {
    expect(
      buildSearchQuery([
        {
          name: "column1",
          values: ["A00100-1"],
          type: FULL_ID_SEARCH_TYPE,
        },
      ])
    ).resolves.toEqual('column1=="A00100-1"');
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
        },
      ])
    ).resolves.toEqual("");
  });
  it("should generate query for one element", () => {
    expect(
      buildSearchQuery([
        {
          name: "column1",
          values: ["P00100-1"],
          type: LIKE_ID_SEARCH_TYPE,
        },
      ])
    ).resolves.toEqual('column1=="%P00100-1%"||column1=="%P001001%"');
  });
  it("should generate query for one element, two fields", () => {
    expect(
      buildSearchQuery([
        {
          name: "column1",
          values: ["P00100-1"],
          type: LIKE_ID_SEARCH_TYPE,
          searchFields: ["column1", "column2"],
        },
      ])
    ).resolves.toEqual(
      '(column1=="%P00100-1%")||(column2=="%P00100-1%")||(column1=="%P001001%")||(column2=="%P001001%")'
    );
  });
  it("should generate query for one accession label element", () => {
    expect(
      buildSearchQuery([
        {
          name: "column1",
          values: ["A00100-1"],
          type: LIKE_ID_SEARCH_TYPE,
        },
      ])
    ).resolves.toEqual('column1=="%A00100-1%"');
  });
});

describe("deprecatedBuildSearchQuery for numeric search", () => {
  it("should generate no query for empty search", () => {
    expect(
      deprecatedBuildSearchQuery(
        new Map().set("column1", {
          value: undefined,
          type: NUMERIC_SEARCH_TYPE,
        })
      )
    ).resolves.toEqual("");
  });
  it("should generate query for 0 search", () => {
    expect(
      deprecatedBuildSearchQuery(
        new Map().set("column1", {
          value: 0,
          type: NUMERIC_SEARCH_TYPE,
        })
      )
    ).resolves.toEqual("column1==0");
  });
  it("should generate query for one element", () => {
    expect(
      deprecatedBuildSearchQuery(
        new Map().set("column1", {
          value: 123,
          type: NUMERIC_SEARCH_TYPE,
        })
      )
    ).resolves.toEqual("column1==123");
  });
});

describe("deprecatedBuildSearchQuery for boolean search", () => {
  it("should generate no query for empty search", () => {
    expect(
      deprecatedBuildSearchQuery(
        new Map().set("column1", {
          value: undefined,
          type: BOOLEAN_SEARCH_TYPE,
        })
      )
    ).resolves.toEqual("");
  });
  it("should generate query for false search", () => {
    expect(
      deprecatedBuildSearchQuery(
        new Map().set("column1", {
          value: false,
          type: BOOLEAN_SEARCH_TYPE,
        })
      )
    ).resolves.toEqual("column1==false");
  });
  it("should generate query for one element", () => {
    expect(
      deprecatedBuildSearchQuery(
        new Map().set("column1", {
          value: true,
          type: BOOLEAN_SEARCH_TYPE,
        })
      )
    ).resolves.toEqual("column1==true");
  });
});

describe("deprecatedBuildSearchQuery for multi field search", () => {
  it("should generate no query for empty string search", () => {
    expect(
      deprecatedBuildSearchQuery(
        new Map().set("column1", {
          value: "",
          type: LIKE_TEXT_SEARCH_TYPE,
          searchFields: ["column1", "column2"],
        })
      )
    ).resolves.toEqual("");
  });
  it("should generate query for elements", () => {
    expect(
      deprecatedBuildSearchQuery(
        new Map().set("column1", {
          value: "123",
          type: LIKE_TEXT_SEARCH_TYPE,
          searchFields: ["column1", "column2"],
        })
      )
    ).resolves.toEqual('(column1=="%123%")||(column2=="%123%")');
  });
  it("should generate query for elements, and multiple options", () => {
    expect(
      deprecatedBuildSearchQuery(
        new Map()
          .set("column1", {
            value: "123",
            type: LIKE_TEXT_SEARCH_TYPE,
            searchFields: ["column1", "column2"],
          })
          .set("column3", {
            value: "456",
            type: LIKE_TEXT_SEARCH_TYPE,
          })
      )
    ).resolves.toEqual(
      '((column1=="%123%")||(column2=="%123%"))&&(column3=="%456%")'
    );
  });
});

describe("deprecatedBuildSearchQuery for multi value search", () => {
  it("should generate no query for empty array", () => {
    expect(
      deprecatedBuildSearchQuery(
        new Map().set("column1", {
          values: [],
          type: FULL_TEXT_SEARCH_TYPE,
        })
      )
    ).resolves.toEqual("");
  });
  it("should generate query for Like text search elements", () => {
    expect(
      deprecatedBuildSearchQuery(
        new Map().set("column1", {
          type: LIKE_TEXT_SEARCH_TYPE,
          values: ["123", "345"],
        })
      )
    ).resolves.toEqual('column1=="%123%"||column1=="%345%"');
  });
  it("should generate query for Numeric text search elements", () => {
    expect(
      deprecatedBuildSearchQuery(
        new Map().set("column1", {
          type: NUMERIC_SEARCH_TYPE,
          values: [123, 345.6],
        })
      )
    ).resolves.toEqual("column1==123||column1==345.6");
  });
  it("should generate query for Boolean text search elements", () => {
    expect(
      deprecatedBuildSearchQuery(
        new Map().set("column1", {
          type: BOOLEAN_SEARCH_TYPE,
          values: [true, false], // Technically, this is silly...
        })
      )
    ).resolves.toEqual("column1==true||column1==false");
  });
  it("should generate query for Full text search elements", () => {
    expect(
      deprecatedBuildSearchQuery(
        new Map().set("column1", {
          type: FULL_TEXT_SEARCH_TYPE,
          values: ["123", "345"],
        })
      )
    ).resolves.toEqual('column1=="123"||column1=="345"');
  });
});

describe("deprecatedBuildSearchQuery for datetime search", () => {
  const date = "2017-04-20T16:20:00.000Z";
  const startOfDay = moment(date)
    .startOf("day")
    .toISOString();
  const endOfDay = moment(date)
    .endOf("day")
    .toISOString();
  it("should generate query for start date", () => {
    expect(
      deprecatedBuildSearchQuery(
        new Map().set("date", {
          values: [`${date}`],
          type: DATETIME_SEARCH_TYPE,
        })
      )
    ).resolves.toEqual(`(date>="${startOfDay}")`);
  });
  it("should generate query for start date to", () => {
    expect(
      deprecatedBuildSearchQuery(
        new Map().set("date", {
          values: [`${date} to`],
          type: DATETIME_SEARCH_TYPE,
        })
      )
    ).resolves.toEqual(`(date>="${startOfDay}")`);
  });
  it("should generate query for end date with no string startDate", () => {
    expect(
      deprecatedBuildSearchQuery(
        new Map().set("date", {
          values: [`to ${date}`],
          type: DATETIME_SEARCH_TYPE,
        })
      )
    ).resolves.toEqual(`(date<="${endOfDay}")`);
  });
  const newStartDate = "2016-04-20T16:20:00.000Z";
  const newStartOfDay = moment(newStartDate)
    .startOf("day")
    .toISOString();
  it("should generate query for start and end date", () => {
    expect(
      deprecatedBuildSearchQuery(
        new Map().set("date", {
          values: [`${newStartDate} to ${date}`],
          type: DATETIME_SEARCH_TYPE,
        })
      )
    ).resolves.toEqual(`(date>="${newStartOfDay}"&&date<="${endOfDay}")`);
  });
  it("should generate query for reversed start and end date", () => {
    expect(
      deprecatedBuildSearchQuery(
        new Map().set("date", {
          values: [`${date} to ${newStartDate}`],
          type: DATETIME_SEARCH_TYPE,
        })
      )
    ).resolves.toEqual(`(date>="${newStartOfDay}"&&date<="${endOfDay}")`);
  });
  it("should generate query for no dates", () => {
    expect(
      deprecatedBuildSearchQuery(
        new Map().set("date", {
          values: [],
          type: DATETIME_SEARCH_TYPE,
        })
      )
    ).resolves.toEqual("");
  });
});

describe("deprecatedBuildSearchQuery for date search", () => {
  const date = "2017-04-20";
  it("should generate query for start date", () => {
    expect(
      deprecatedBuildSearchQuery(
        new Map().set("date", {
          values: [`${date}`],
          type: DATE_SEARCH_TYPE,
        })
      )
    ).resolves.toEqual(`(date>="${date}")`);
  });
  it("should generate query for start date to", () => {
    expect(
      deprecatedBuildSearchQuery(
        new Map().set("date", {
          values: [`${date} to`],
          type: DATE_SEARCH_TYPE,
        })
      )
    ).resolves.toEqual(`(date>="${date}")`);
  });
  it("should generate query for end date with no string startDate", () => {
    expect(
      deprecatedBuildSearchQuery(
        new Map().set("date", {
          values: [`to ${date}`],
          type: DATE_SEARCH_TYPE,
        })
      )
    ).resolves.toEqual(`(date<="${date}")`);
  });
  const newStartDate = "2016-04-20";
  it("should generate query for start and end date", () => {
    expect(
      deprecatedBuildSearchQuery(
        new Map().set("date", {
          values: [`${newStartDate} - ${date}`],
          type: DATE_SEARCH_TYPE,
        })
      )
    ).resolves.toEqual(`(date>="${newStartDate}"&&date<="${date}")`);
  });
  it("should generate query for reversed start and end date", () => {
    expect(
      deprecatedBuildSearchQuery(
        new Map().set("date", {
          values: [`${date} - ${newStartDate}`],
          type: DATE_SEARCH_TYPE,
        })
      )
    ).resolves.toEqual(`(date>="${newStartDate}"&&date<="${date}")`);
  });
  it("should generate query for no dates", () => {
    expect(
      deprecatedBuildSearchQuery(
        new Map().set("date", {
          values: [],
          type: DATE_SEARCH_TYPE,
        })
      )
    ).resolves.toEqual("");
  });
});

describe("deprecatedBuildSearchQuery for several search items", () => {
  it("should generate query for several search elements", () => {
    expect(
      deprecatedBuildSearchQuery(
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
          })
      )
    ).resolves.toEqual(
      '(column1==123)&&(column2=="def xyz")&&(column3=="%some string%")'
    );
  });
  it("should generate query for several search elements when one is empty string", () => {
    expect(
      deprecatedBuildSearchQuery(
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
          })
      )
    ).resolves.toEqual('(column1==123)&&(column3=="%some string%")');
  });
  it("should generate query for several search elements when the last string is empty string (See T1661)", () => {
    expect(
      buildSearchQuery([
        {
          searchFields: ["column1"],
          values: ["123"],
          type: NUMERIC_SEARCH_TYPE,
        },
        {
          searchFields: ["column2"],
          values: [""],
          type: FULL_TEXT_SEARCH_TYPE,
        },
      ])
    ).resolves.toEqual("(column1==123)");
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
    expect(buildSearchQuery(searchOptions)).rejects.toEqual(
      new Error("Unknown search type: Symbol(UNIT_TEST INVALID_SYMBOL)")
    );
  });
  it("should return if date search field value is invalid", () => {
    expect(
      buildSearchQuery([
        {
          name: "column1",
          values: [],
          type: DATE_SEARCH_TYPE,
        },
      ])
    ).resolves.toEqual("");
  });
  it("should return if no search options are present", () => {
    expect(buildSearchQuery([])).resolves.toEqual("");
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
        },
      ])
    ).resolves.toEqual('column1=="abc & 123"||column1=="xyz"');
  });
});

describe("buildSearchQuery for searchOperator", () => {
  it("should set searchOperator for one search field", () => {
    expect(
      buildSearchQuery([
        {
          name: "column1",
          values: ["abc & 123", "xyz"],
          type: FULL_TEXT_SEARCH_TYPE,
          searchOperator: "!=",
        },
      ])
    ).resolves.toEqual('column1!="abc & 123"||column1!="xyz"');
  });
  it("should set searchOperator for two search fields", () => {
    expect(
      buildSearchQuery([
        {
          name: "Multiple Columns",
          values: ["abc & 123", "xyz"],
          type: FULL_TEXT_SEARCH_TYPE,
          searchFields: ["column1", "column2"],
          searchOperator: "!=",
        },
      ])
    ).resolves.toEqual(
      '(column1!="abc & 123")||(column2!="abc & 123")||(column1!="xyz")||(column2!="xyz")'
    );
  });
});

describe("buildSearchQuery for includeNulls", () => {
  it("should search for null for one search field and no value", () => {
    expect(
      buildSearchQuery([
        {
          name: "column1",
          values: [],
          type: FULL_TEXT_SEARCH_TYPE,
          includeNulls: true,
        },
      ])
    ).resolves.toEqual('column1=="NULL"');
  });
  it("should search for null for one search field and one value", () => {
    expect(
      buildSearchQuery([
        {
          name: "column1",
          values: ["abc"],
          type: FULL_TEXT_SEARCH_TYPE,
          includeNulls: true,
        },
      ])
    ).resolves.toEqual('column1=="NULL"||column1=="abc"');
  });
  it("should search for null for one search field and two values", () => {
    expect(
      buildSearchQuery([
        {
          name: "column1",
          values: ["abc & 123", "xyz"],
          type: FULL_TEXT_SEARCH_TYPE,
          includeNulls: true,
        },
      ])
    ).resolves.toEqual('column1=="NULL"||column1=="abc & 123"||column1=="xyz"');
  });
  it("should search for NULL for two search fields", () => {
    expect(
      buildSearchQuery([
        {
          name: "Multiple Columns",
          values: ["abc & 123", "xyz"],
          type: FULL_TEXT_SEARCH_TYPE,
          searchFields: ["column1", "column2"],
          includeNulls: true,
        },
      ])
    ).resolves.toEqual(
      '(column1=="NULL")||(column2=="NULL")||(column1=="abc & 123")||(column2=="abc & 123")||(column1=="xyz")||(column2=="xyz")'
    );
  });
  it("should search for NULL for several search options", () => {
    expect(
      buildSearchQuery([
        {
          name: "column1",
          values: ["xyz"],
          type: FULL_TEXT_SEARCH_TYPE,
          includeNulls: true,
        },
        {
          name: "column2",
          values: ["xyz"],
          type: FULL_TEXT_SEARCH_TYPE,
          includeNulls: false,
        },
        {
          name: "column3",
          values: ["abc"],
          type: FULL_TEXT_SEARCH_TYPE,
          includeNulls: true,
        },
      ])
    ).resolves.toEqual(
      '(column1=="NULL"||column1=="xyz")&&(column2=="xyz")&&(column3=="NULL"||column3=="abc")'
    );
  });

  it("should ignore uri query types", () => {
    expect(
      buildSearchQuery([
        {
          name: "column1",
          values: ["abc"],
          searchFields: ["column1"],
          queryType: URI_QUERY_TYPE,
          type: FULL_TEXT_SEARCH_TYPE,
        },
        {
          name: "column2",
          values: ["def"],
          searchFields: ["column2"],
          queryType: URI_QUERY_TYPE,
          type: FULL_TEXT_SEARCH_TYPE,
        },
        {
          name: "column3",
          values: ["ghi"],
          searchFields: ["column3"],
          type: FULL_TEXT_SEARCH_TYPE,
        },
      ])
    ).resolves.toEqual('(column3=="ghi")');
  });
});

describe("buildQuery for full text search", () => {
  it("should generate no query for empty string search", async () => {
    const query = await buildQuery({
      searchOptions: [
        {
          name: "column1",
          values: [],
          searchFields: ["column1"],
          queryType: URI_QUERY_TYPE,
          type: FULL_TEXT_SEARCH_TYPE,
        },
      ],
    });
    expect(query.toString()).toEqual("");
  });
  it("should generate query for one element", async () => {
    const query = await buildQuery({
      searchOptions: [
        {
          name: "column1",
          values: ["abc"],
          searchFields: ["column1"],
          queryType: URI_QUERY_TYPE,
          type: FULL_TEXT_SEARCH_TYPE,
        },
      ],
    });
    expect(query.toString()).toEqual("column1=abc");
  });
  it("should generate query for two elements", async () => {
    const query = await buildQuery({
      searchOptions: [
        {
          name: "column1",
          values: ["abc"],
          searchFields: ["column1"],
          queryType: URI_QUERY_TYPE,
          type: FULL_TEXT_SEARCH_TYPE,
        },
        {
          name: "column2",
          values: ["def"],
          searchFields: ["column2"],
          queryType: URI_QUERY_TYPE,
          type: FULL_TEXT_SEARCH_TYPE,
        },
        {
          name: "column3",
          values: ["ghi"],
          searchFields: ["column3"],
          type: FULL_TEXT_SEARCH_TYPE,
        },
      ],
    });
    expect(query.toString()).toEqual(
      `column1=abc&column2=def&q=%28column3${ENCODED_EQUAL_CHAR}${ENCODED_EQUAL_CHAR}${ENCODED_QUOTE_CHAR}ghi${ENCODED_QUOTE_CHAR}%29`
    );
  });
});

describe("buildCustomURIQueryParams for full text search", () => {
  it("should generate no query for empty string search", async () => {
    const query = new URLSearchParams();
    await buildCustomURIQueryParams(
      [
        {
          name: "column1",
          values: [],
          searchFields: ["column1"],
          queryType: URI_QUERY_TYPE,
          type: FULL_TEXT_SEARCH_TYPE,
        },
      ],
      query
    );
    expect(query.toString()).toEqual("");
  });
  it("should generate query for one element", async () => {
    const query = new URLSearchParams();
    await buildCustomURIQueryParams(
      [
        {
          name: "column1",
          values: ["abc"],
          searchFields: ["column1"],
          queryType: URI_QUERY_TYPE,
          type: FULL_TEXT_SEARCH_TYPE,
        },
      ],
      query
    );
    expect(query.toString()).toEqual("column1=abc");
  });
  it("should generate query for two elements", async () => {
    const query = new URLSearchParams();
    await buildCustomURIQueryParams(
      [
        {
          name: "column1",
          values: ["abc"],
          searchFields: ["column1"],
          queryType: URI_QUERY_TYPE,
          type: FULL_TEXT_SEARCH_TYPE,
        },
        {
          name: "column2",
          values: ["def"],
          searchFields: ["column2"],
          queryType: URI_QUERY_TYPE,
          type: FULL_TEXT_SEARCH_TYPE,
        },
        {
          name: "column3",
          values: ["ghi"],
          searchFields: ["column3"],
          type: FULL_TEXT_SEARCH_TYPE,
        },
      ],
      query
    );
    expect(query.toString()).toEqual("column1=abc&column2=def");
  });
});
