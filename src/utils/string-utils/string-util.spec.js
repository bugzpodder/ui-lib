// @flow

import keys from "lodash/keys";

import { sentenceCase, upperAlphaChars, normalizeStr, makeTitleString } from "./string-util";

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
  "123": "123",
  'test "quotes"': "Test Quotes",
  "test 'quotes'": "Test Quotes",
  snake_case: "Snake Case",
  "spine-case": "Spine Case",
  [multiLine]: "Multiple Lines Of Text",
  "text, []{}| with - various!?.,<> punctuation -=_+ `~ !@#$%^&*() interspersed.":
    "Text With Various Punctuation Interspersed",
};

describe("sentenceCase", () => {
  keys(expectedSentenceCaseTranslations).forEach(key => {
    const value = expectedSentenceCaseTranslations[key];
    it(`convert "${key}" to "${value}"`, () => {
      expect(sentenceCase(key)).toEqual(value);
    });
  });
});

describe("upperAlphaChars", () => {
  it("should be 26 characters", () => {
    expect(upperAlphaChars.length).toEqual(26);
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
  const tests = [["under_scored", "Under Scored"], ["camelCase", "Camel Case"], ["cfDNA_assay", "CfDNA Assay"]];

  tests.forEach(([start, end]) => {
    it(`should convert ${start} -> ${end}`, () => {
      expect(makeTitleString(start)).toEqual(end);
    });
  });

  it("doesnt have to cap first", () => {
    expect(makeTitleString("cfDNA_assay", false)).toEqual("cfDNA Assay");
  });
});
