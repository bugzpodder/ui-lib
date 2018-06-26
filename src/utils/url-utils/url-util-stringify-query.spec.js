// @flow
import { stringifyQuery } from "./url-util";

const badValues = ["", null, undefined, []];

describe("stringifyQuery", () => {
	it("handles generic query object", () => {
		const queryObj = {
			testStr: "test",
			testNum: 2,
			testZero: 0,
			testArray: ["first", "second"],
			testTrue: true,
			testFalse: false,
		};
		const queryStr = stringifyQuery(queryObj);
		expect(queryStr).toBe(
			"testStr=test&testNum=2&testZero=0&testArray%5B0%5D=first&testArray%5B1%5D=second&testTrue=true&testFalse=false",
		);
	});
	badValues.forEach(value => {
		it("handles query object with invalid value", () => {
			const queryObj = {
				testStr: "test",
				badValue: value,
			};
			const queryStr = stringifyQuery(queryObj);
			expect(queryStr).toBe("testStr=test");
		});
		it("calls with the default query object", () => {
			const queryStr = stringifyQuery();
			expect(queryStr).toBe("");
		});
	});
});
