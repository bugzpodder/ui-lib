import * as apis from "./api";
import { sentenceCase } from "../utils/string-utils";

["error", "warning"].forEach(issueType => {
  const functionName = `extract${sentenceCase(issueType)}Messages`;
  const parameterName = `${issueType}s`;
  describe(functionName, () => {
    it(`should handle empty ${issueType} messages`, () => {
      expect(
        apis[functionName]({
          someContent: "test",
        }),
      ).toEqual([]);
    });

    [1, 3, 42].forEach(length => {
      it(`should handle ${length} ${issueType} messages`, () => {
        const messages = Array.from({ length }, (_, key) => ({
          message: `Error ${key + 1}`,
        }));
        const expectedErrorMessages = Array.from(
          { length },
          (_, key) => `Error ${key + 1}`,
        );
        expect(
          apis[functionName]({
            someContent: "test",
            errors: {
              [parameterName]: messages,
            },
          }),
        ).toEqual(expectedErrorMessages);
      });
    });

    it(`should handle ${issueType} messages in different formats`, () => {
      expect(
        apis[functionName]({ errors: { [parameterName]: ["string"] } }),
      ).toEqual(["string"]);
      expect(
        apis[functionName]({ errors: { [parameterName]: "string" } }),
      ).toEqual(["string"]);
      expect(apis[functionName]({ errors: { [parameterName]: 0 } })).toEqual(
        [],
      );
      expect(apis[functionName]({ errors: ["string"] })).toEqual(["string"]);
      expect(apis[functionName]({ errors: "string" })).toEqual(["string"]);
      expect(apis[functionName]({ errors: 0 })).toEqual([]);
    });
  });
});
