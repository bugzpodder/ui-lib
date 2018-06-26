// @flow
import { updateQuery, updateQueryInternal } from "./url-util";

jest.mock("lodash/debounce", () => jest.fn(fn => fn));
describe("updateQuery", () => {
	const updateQueryTest = (props, ...args) => updateQuery({ location: global.location, ...props }, ...args);
	const history = {
		push: jest.fn(),
		replace: jest.fn(),
	};
	it("handles props with history but no new queries", () => {
		const props = { history };
		updateQueryTest(props);
		expect(props.history.replace).toBeCalledWith({ search: "?" });
	});
	it("handles props with history and existing search but no new queries", () => {
		const location = {
			pathname: "/some/route",
			search: "?someQuery=5",
		};
		const props = { location, history };
		updateQueryTest(props);
		expect(props.history.replace).toBeCalledWith({ search: "?someQuery=5" });
	});
	it("handles props with history and one new query", () => {
		const props = { history };
		updateQueryTest(props, { test: 1 });
		expect(props.history.replace).toBeCalledWith({ search: "?test=1" });
	});
	it("handles props with history and several new queries", () => {
		const props = { history };
		updateQueryTest(props, { test: 1, val: "abc", string: "a b c" });
		expect(props.history.replace).toBeCalledWith({ search: "?test=1&val=abc&string=a%20b%20c" });
	});
	it("handles history push", () => {
		const history = {
			push: jest.fn(),
			replace: jest.fn(),
		};
		const props = { history };
		updateQueryTest(props, { test: 1 }, { shouldUpdateBrowserHistory: true });
		expect(props.history.replace).not.toBeCalled();
		expect(props.history.push).toBeCalledWith({ search: "?test=1" });
	});
	it("can replace URL search parameters (removing old ones)", () => {
		const props = { history };
		updateQueryTest(props, { a: 100, b: 50 });
		expect(props.history.replace).toBeCalledWith({ search: "?a=100&b=50" });
		updateQueryTest(props, { a: 50 });
		expect(props.history.replace).toBeCalledWith({ search: "?a=50" });
	});

	it("returns undefined if no history", () => {
		const noHistoryTest = updateQueryTest({}, { test: 1, val: "abc", string: "a b c" });
		expect(noHistoryTest).toBe(undefined);
	});
	it("calls default values with updateQueryInternal", () => {
		const updateQueryInt = updateQueryInternal();
		expect(updateQueryInt).toBe(undefined);
	});
	it("calls updateQueryInternal when shouldReplaceQuery is true", () => {
		const options = { shouldReplaceQuery: true };
		const noHistoryTest = updateQueryInternal({}, {}, options);
		expect(noHistoryTest).toBe(undefined);
	});
});
