import { sentenceCase } from "../utils/string-utils";

import * as apis from "./api";

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
  });
});
