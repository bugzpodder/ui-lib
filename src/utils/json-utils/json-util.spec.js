// @flow
import {
  camelizeObjectKeys,
  convertObjectKeys,
  jsonToMap,
  mapToJson,
  titleizeObjectKeys,
  trimObjectValues,
} from "./json-util";

const testObject: { [string]: mixed } = {
  Case1: "test",
  cAsE2: "test",
  case3: "test",
  Case3: "may overwrite case3",
  "case 42": "test with space",
  ENUM_CASE_5: "test with underscored numeric ENUM type",
  ENUMCASE6: "test with uppercase numeric ENUM type",
  ENUM_CASE_ABC_7: "test with underscore uppercase numeric ENUM type",
  ENUMCASETEXT: "test with uppercase ENUM type",
  lower_case_8: "test with lower case and under score",
  NoN_Enum_Case: "test with mixed case and underscores",
  caseNested: {
    testArray: [1, 2, 3],
    "test with spaces": 123,
    ENUM_CASE_5: "test with underscored numeric ENUM type",
    ENUMCASE6: "test with uppercase numeric ENUM type",
    ENUM_CASE_ABC_7: "test with underscore uppercase numeric ENUM type",
    ENUMCASETEXT: "test with uppercase ENUM type",
    lower_case_8: "test with lower case and under score",
  },
  OutputState: {
    TestObject: { SubKey: 1 },
    TestArray: [{ SubKey: 1 }],
    TestValue: 1,
    testValue2: 2,
  },
  MaybeIgnored: {
    TestValue: 1,
  },
};

describe("convertObjectKeys", () => {
  it("should mutate json keys", () => {
    const appendMutator = key => `${key}Mutated`;
    expect(convertObjectKeys(appendMutator, ["MaybeIgnored"], testObject)).toEqual({
      Case1Mutated: "test",
      cAsE2Mutated: "test",
      case3Mutated: "test",
      Case3Mutated: "may overwrite case3",
      "case 42Mutated": "test with space",
      ENUM_CASE_5: "test with underscored numeric ENUM type",
      ENUMCASE6: "test with uppercase numeric ENUM type",
      ENUM_CASE_ABC_7: "test with underscore uppercase numeric ENUM type",
      ENUMCASETEXT: "test with uppercase ENUM type",
      lower_case_8: "test with lower case and under score",
      NoN_Enum_CaseMutated: "test with mixed case and underscores",
      caseNestedMutated: {
        testArrayMutated: [1, 2, 3],
        "test with spacesMutated": 123,
        ENUM_CASE_5: "test with underscored numeric ENUM type",
        ENUMCASE6: "test with uppercase numeric ENUM type",
        ENUM_CASE_ABC_7: "test with underscore uppercase numeric ENUM type",
        ENUMCASETEXT: "test with uppercase ENUM type",
        lower_case_8: "test with lower case and under score",
      },
      OutputStateMutated: {
        TestObjectMutated: { SubKeyMutated: 1 },
        TestArrayMutated: [{ SubKeyMutated: 1 }],
        TestValueMutated: 1,
        testValue2Mutated: 2,
      },
      MaybeIgnoredMutated: {
        TestValue: 1,
      },
    });
  });
  it("should not mutate object keys if mutator is identity", () => {
    const identityMutator = key => key;
    expect(convertObjectKeys(identityMutator, ["MaybeIgnored"], testObject)).toEqual(testObject);
  });
  it("should return the item if not an array or object", () => {
    const identityMutator = key => key;
    expect(convertObjectKeys(identityMutator, ["MaybeIgnored"], "invalid")).toEqual("invalid");
  });
});

describe("camelizeObjectKeys", () => {
  it("should mutate object keys", () => {
    expect(camelizeObjectKeys(testObject, ["OutputState"])).toEqual({
      case1: "test",
      cAsE2: "test",
      case3: "may overwrite case3",
      case42: "test with space",
      ENUM_CASE_5: "test with underscored numeric ENUM type",
      ENUMCASE6: "test with uppercase numeric ENUM type",
      ENUM_CASE_ABC_7: "test with underscore uppercase numeric ENUM type",
      ENUMCASETEXT: "test with uppercase ENUM type",
      noNEnumCase: "test with mixed case and underscores",
      lower_case_8: "test with lower case and under score",
      caseNested: {
        testArray: [1, 2, 3],
        testWithSpaces: 123,
        ENUM_CASE_5: "test with underscored numeric ENUM type",
        ENUMCASE6: "test with uppercase numeric ENUM type",
        ENUM_CASE_ABC_7: "test with underscore uppercase numeric ENUM type",
        ENUMCASETEXT: "test with uppercase ENUM type",
        lower_case_8: "test with lower case and under score",
      },
      outputState: {
        TestObject: { SubKey: 1 },
        TestArray: [{ SubKey: 1 }],
        TestValue: 1,
        testValue2: 2,
      },
      maybeIgnored: {
        testValue: 1,
      },
    });
  });
});

describe("titleizeObjectKeys", () => {
  it("should mutate object keys", () => {
    expect(titleizeObjectKeys(testObject, "OutputState")).toEqual({
      Case1: "test",
      CAsE2: "test",
      Case3: "may overwrite case3",
      Case42: "test with space",
      ENUM_CASE_5: "test with underscored numeric ENUM type",
      ENUMCASE6: "test with uppercase numeric ENUM type",
      ENUM_CASE_ABC_7: "test with underscore uppercase numeric ENUM type",
      ENUMCASETEXT: "test with uppercase ENUM type",
      lower_case_8: "test with lower case and under score",
      NoNEnumCase: "test with mixed case and underscores",
      CaseNested: {
        TestArray: [1, 2, 3],
        TestWithSpaces: 123,
        ENUM_CASE_5: "test with underscored numeric ENUM type",
        ENUMCASE6: "test with uppercase numeric ENUM type",
        ENUM_CASE_ABC_7: "test with underscore uppercase numeric ENUM type",
        ENUMCASETEXT: "test with uppercase ENUM type",
        lower_case_8: "test with lower case and under score",
      },
      OutputState: {
        TestObject: { SubKey: 1 },
        TestArray: [{ SubKey: 1 }],
        TestValue: 1,
        testValue2: 2,
      },
      MaybeIgnored: {
        TestValue: 1,
      },
    });
  });
});

const testMap = new Map()
  .set(1, "test1")
  .set(2, { test2a: "testing", test2b: 0 })
  .set(3, "test3");
const testJson = '[[1,"test1"],[2,{"test2a":"testing","test2b":0}],[3,"test3"]]';

describe("mapToJson", () => {
  it("should convert map to JSON string", () => {
    expect(mapToJson(testMap)).toEqual(testJson);
  });
  it("should handle undefined or null map", () => {
    expect(mapToJson(null)).toEqual("");
    expect(mapToJson(undefined)).toEqual("");
  });
});

describe("jsonToMap", () => {
  it("should convert map to JSON string", () => {
    expect(jsonToMap(testJson)).toEqual(testMap);
  });
  it("should handle undefined or null string", () => {
    expect(jsonToMap(null)).toEqual(new Map());
    expect(jsonToMap(undefined)).toEqual(new Map());
  });
});

describe("trimObjectValues", () => {
  const object = {
    one: "  one   ",
    two: "two    ",
    three: "    three",
  };
  const formattedObject = {
    one: "one",
    two: "two",
    three: "three",
  };
  const invalidObject = ["INVALID"];
  it("should trim the values in an object", () => {
    expect(trimObjectValues(object)).toEqual(formattedObject);
  });
  it("should return the item if it's not an object", () => {
    expect(trimObjectValues(invalidObject)).toEqual(invalidObject);
  });
});
