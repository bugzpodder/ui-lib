// @flow

import keys from "lodash/keys";

import {
  extractQuotedString,
  formatPercent,
  isQuotedString,
  makeTitleString,
  normalizeStr,
  sentenceCase,
  unquoteString,
  upperAlphaChars,
} from "./string-util";

const multiLine = `multiple lines
of
text
`;

const expectedSentenceCaseTranslations = {
  "": "",
  camelCase: "Camel Case",
  "camel Case": "Camel Case",
  camel: "Camel",
  "123camel": "123 Camel",
  ABDCamel: "Abd Camel",
  123: "123",
  'test "quotes"': "Test Quotes",
  "test 'quotes'": "Test Quotes",
  snake_case: "Snake Case",
  "spine-case": "Spine Case",
  [multiLine]: "Multiple Lines Of Text",
  "text, []{}| with - various!?.,<> punctuation -=_+ `~ !@#$%^&*() interspersed.":
    "Text With Various Punctuation Interspersed",
};

describe("sentenceCase", () => {
  keys(expectedSentenceCaseTranslations).forEach((key) => {
    const value = expectedSentenceCaseTranslations[key];
    it(`convert "${key}" to "${value}"`, () => {
      expect(sentenceCase(key)).toEqual(value);
    });
  });
});

describe("upperAlphaChars", () => {
  it("should be 26 characters", () => {
    expect(upperAlphaChars).toHaveLength(26);
  });
  it("should be an array of 26 upper case chars from A-Z", () => {
    expect(upperAlphaChars).toEqual("ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""));
  });
});

describe("keywords", () => {
  it("should format acronyms", () => {
    expect(sentenceCase("NPC_QPCR_ASSAY")).toEqual("NPC qPCR Assay");
  });
  it("should format units", () => {
    expect(sentenceCase("OUTPUT_VOLUME_ML")).toEqual("Output Volume mL");
  });
});

describe("normalizeStr", () => {
  it("should normalize a string", () => {
    expect(normalizeStr("NPC_QPCR_ASSAY")).toEqual("npc qpcr assay");
  });

  it("should return an empty string if string is not provided", () => {
    expect(normalizeStr()).toEqual("");
  });
});

describe("makeTitleString", () => {
  const tests = [
    ["under_scored", "Under Scored"],
    ["camelCase", "Camel Case"],
    ["cfDNA_assay", "CfDNA Assay"],
  ];

  tests.forEach(([start, end]) => {
    it(`should convert ${start} -> ${end}`, () => {
      expect(makeTitleString(start)).toEqual(end);
    });
  });

  it("doesnt have to cap first", () => {
    expect(makeTitleString("cfDNA_assay", false)).toEqual("cfDNA Assay");
  });
});

describe("formatPercent", () => {
  const tests = [
    ["0.12", "12.00%"],
    ["0.0123", "1.23%"],
    ["0.1230", "12.30%"],
    [0.12, "12.00%"],
    ["abc", "-"],
  ];

  tests.forEach(([input, expectedPercent]) => {
    it(`should convert ${input} -> ${expectedPercent}`, () => {
      expect(formatPercent(input)).toEqual(expectedPercent);
    });
  });
});
['"', global.encodeURIComponent('"')].forEach((quoteChar) => {
  const nullCases = [
    "0.12",
    `${quoteChar}abc`,
    `1230${quoteChar}`,
    `abc ${quoteChar} 123`,
    `a${quoteChar}${quoteChar}23`,
  ];
  const testValues = ["", "abc 123", "test"];
  describe("extractQuotedString", () => {
    const tests = [
      ...nullCases.map((testCase) => [testCase, null]),
      ...testValues.map((value) => [`${quoteChar}${value}${quoteChar}`, value]),
      ...testValues.map((value) => [
        `   ${quoteChar}${value}${quoteChar}  `,
        value,
      ]),
    ];

    tests.forEach(([quotedValue, extractedValue]) => {
      it(`should extract quoted string from '${quotedValue}' -> '${
        extractedValue != null ? extractedValue : "null"
      }'`, () => {
        expect(extractQuotedString(quotedValue, quoteChar)).toEqual(
          extractedValue
        );
      });
    });
  });
  describe("unquoteString", () => {
    const tests = [
      ...nullCases.map((testCase) => [testCase, testCase]),
      ...testValues.map((value) => [`${quoteChar}${value}${quoteChar}`, value]),
      ...testValues.map((value) => [
        `   ${quoteChar}${value}${quoteChar}  `,
        value,
      ]),
    ];

    tests.forEach(([quotedValue, extractedValue]) => {
      it(`should unquote string from '${quotedValue}' -> '${
        extractedValue != null ? extractedValue : "null"
      }'`, () => {
        expect(unquoteString(quotedValue, quoteChar)).toEqual(extractedValue);
      });
    });
  });
  describe("isQuotedString", () => {
    const tests = [
      ...nullCases.map((testCase) => [testCase, false]),
      ...testValues.map((value) => [`${quoteChar}${value}${quoteChar}`, true]),
      ...testValues.map((value) => [
        `   ${quoteChar}${value}${quoteChar}  `,
        true,
      ]),
    ];

    tests.forEach(([quotedValue, expectedResult]) => {
      it(`should determine isQuotedString from '${quotedValue}' -> '${expectedResult}'`, () => {
        expect(isQuotedString(quotedValue, quoteChar)).toEqual(expectedResult);
      });
    });
  });
});

describe("extractQuotedString default quote char", () => {
  expect(extractQuotedString('"abc"')).toEqual("abc");
});

describe("unquoteString default quote char", () => {
  expect(unquoteString('"abc"')).toEqual("abc");
});

describe("isQuotedString default quote char", () => {
  expect(isQuotedString('"abc"')).toEqual(true);
});
