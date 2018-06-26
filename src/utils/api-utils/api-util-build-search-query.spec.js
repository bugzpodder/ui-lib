// @flow
import "../mocks/fetch.mock";
import "@grail/lib/src/utils/mocks";
import moment from "moment-timezone";

import {
	BOOLEAN_SEARCH_TYPE,
	DATE_SEARCH_TYPE,
	DATETIME_SEARCH_TYPE,
	FULL_TEXT_SEARCH_TYPE,
	LIKE_TEXT_SEARCH_TYPE,
	FULL_ID_SEARCH_TYPE,
	LIKE_ID_SEARCH_TYPE,
	MULTI_FIELD_TEXT_SEARCH_TYPE,
	NUMERIC_SEARCH_TYPE,
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
			buildSearchQuery({
				column1: {
					value: "",
					type: FULL_TEXT_SEARCH_TYPE,
				},
			}),
		).toEqual("");
	});
	it("should generate query for one element", () => {
		expect(
			buildSearchQuery({
				column1: {
					value: "abc",
					type: FULL_TEXT_SEARCH_TYPE,
				},
			}),
		).toEqual('(column1=="abc")');
	});
});

describe("buildSearchQuery for like text search", () => {
	it("should generate no query for empty string search", () => {
		expect(
			buildSearchQuery({
				column1: {
					value: "",
					type: LIKE_TEXT_SEARCH_TYPE,
				},
			}),
		).toEqual("");
	});
	it("should generate query for one element", () => {
		expect(
			buildSearchQuery({
				column1: {
					value: "abc",
					type: LIKE_TEXT_SEARCH_TYPE,
				},
			}),
		).toEqual(`(column1=="${percentChar}abc${percentChar}")`);
	});
});

describe("buildSearchQuery for full id search", () => {
	it("should generate no query for empty string search", () => {
		expect(
			buildSearchQuery({
				column1: {
					value: "",
					type: FULL_ID_SEARCH_TYPE,
				},
			}),
		).toEqual("");
	});
	it("should generate query for one element", () => {
		expect(
			buildSearchQuery({
				column1: {
					value: "P00100-1",
					type: FULL_ID_SEARCH_TYPE,
				},
			}),
		).toEqual('(column1=="P001001")');
	});
	it("should generate query for one accession label element", () => {
		expect(
			buildSearchQuery({
				column1: {
					value: "A00100-1",
					type: FULL_ID_SEARCH_TYPE,
				},
			}),
		).toEqual('(column1=="A00100-1")');
	});
});

describe("buildSearchQuery for like id search", () => {
	it("should generate no query for empty string search", () => {
		expect(
			buildSearchQuery({
				column1: {
					value: "",
					type: LIKE_ID_SEARCH_TYPE,
				},
			}),
		).toEqual("");
	});
	it("should generate query for one element", () => {
		expect(
			buildSearchQuery({
				column1: {
					value: "P00100-1",
					type: LIKE_ID_SEARCH_TYPE,
				},
			}),
		).toEqual(`(column1=="${percentChar}P001001${percentChar}")`);
	});
	it("should generate query for one accession label element", () => {
		expect(
			buildSearchQuery({
				column1: {
					value: "A00100-1",
					type: LIKE_ID_SEARCH_TYPE,
				},
			}),
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
					values: [true, false], //Technically, this is silly...
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
					rawQuery: "(x==6||y==7) && (z==4)",
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
			`(column1==123)${doubleAmpersand}(column2=="def xyz")${doubleAmpersand}(column3=="${percentChar}some string${percentChar}")`,
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
		).toEqual(`(column1==123)${doubleAmpersand}(column3=="${percentChar}some string${percentChar}")`);
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

describe("buildSearchQuery for full text search utilizing isEqual", () => {
	it("should generate query for one element equal to value", () => {
		expect(
			buildSearchQuery({
				column1: {
					value: "abc",
					type: FULL_TEXT_SEARCH_TYPE,
					isEqual: true,
				},
			}),
		).toEqual('(column1=="abc")');
	});
	it("should generate query for multiple elements unequal to value", () => {
		expect(
			buildSearchQuery({
				column1: {
					value: "abc",
					type: FULL_TEXT_SEARCH_TYPE,
					isEqual: false,
				},
			}),
		).toEqual('(column1!="abc")');
	});
});

describe("buildSearchQuery is invalid", () => {
	it("should throw an error for an invalid search type", () => {
		expect(() => {
			return buildSearchQuery({
				column1: {
					value: "abc",
					type: "INVALID",
					isEqual: true,
				},
			});
		}).toThrowError();
	});
	it("should throw error if date search field value is invalid", () => {
		expect(
			buildSearchQuery({
				column1: {
					values: null,
					type: DATETIME_SEARCH_TYPE,
					isEqual: true,
				},
			}),
		).toEqual("");
	});
	it("should return if no search options are present", () => {
		expect(buildSearchQuery({ column1: "" })).toEqual("");
	});
});
