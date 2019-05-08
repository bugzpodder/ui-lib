// @flow

import { processCommandLineArgs } from "./command-line-util";

describe("processCommandLineArgs", () => {
  it("processes an empty object", () => {
    expect(processCommandLineArgs({}, [])).toEqual({});
  });

  it("extracts public and secret values when given expected arguments", () => {
    const commandLineArguments = {
      abc: "Some value",
      def: "Other value",
      "secret-token": "Super Secret",
    };
    expect(
      processCommandLineArgs(commandLineArguments, [
        {
          name: "abc",
        },
        {
          name: "def",
        },
        {
          name: "secret-token",
          configType: "secret",
        },
      ]),
    ).toEqual({ public: { abc: "Some value", def: "Other value" }, secret: { "secret-token": "Super Secret" } });
  });

  it("extracts public values when given expected array arguments", () => {
    const commandLineArguments = {
      _: ["Some value", "Other value"],
    };
    expect(
      processCommandLineArgs(commandLineArguments, [
        {
          name: "_",
        },
      ]),
    ).toEqual({ public: { _: ["Some value", "Other value"] } });
  });

  it("ignores optional props when given arguments", () => {
    expect(
      processCommandLineArgs({}, [
        {
          name: "def",
          isRequired: false,
          configType: "verySecret",
        },
      ]),
    ).toEqual({ verySecret: { def: true } });
  });

  it("uses default optional value when given arguments", () => {
    expect(
      processCommandLineArgs({}, [
        {
          name: "date",
          isRequired: false,
          defaultValue: "2019-04-20",
          configType: "secret",
        },
      ]),
    ).toEqual({ secret: { date: "2019-04-20" } });
  });

  it("ignores default value when given arguments", () => {
    const commandLineArguments = {
      date: "1999-04-20",
    };
    expect(
      processCommandLineArgs(commandLineArguments, [
        {
          name: "date",
          isRequired: false,
          defaultValue: "2019-04-20",
          configType: "secret",
        },
      ]),
    ).toEqual({ secret: { date: "1999-04-20" } });
  });

  it("throws when not given required arguments", () => {
    expect(() => processCommandLineArgs({}, [
      {
        name: "abc",
        isRequired: true,
      },
    ]),).toThrow(
      new Error(`1 error(s) detected.
Must provide command line argument: --abc <Abc>`),
    );
  });

  it("throws when given unexpected arguments", () => {
    const commandLineArguments = {
      abc: 123,
    };
    expect(() => processCommandLineArgs(commandLineArguments, [])).toThrow(
      new Error(`1 error(s) detected.
Unexpected command line argument provided: --abc 123`),
    );
  });

  it("throws when given expected and unexpected arguments", () => {
    const commandLineArguments = {
      abc: 123,
      def: "value",
    };
    expect(() => processCommandLineArgs(commandLineArguments, [
      {
        name: "def",
      },
    ]),).toThrow(
      new Error(`1 error(s) detected.
Unexpected command line argument provided: --abc 123`),
    );
  });

  it("throws with all errors", () => {
    const commandLineArguments = {
      xyz: true,
    };
    expect(() => processCommandLineArgs(commandLineArguments, [
      {
        name: "some-param",
        isRequired: true,
      },
      {
        name: "other",
        isRequired: true,
      },
    ]),).toThrow(
      new Error(`3 error(s) detected.
Must provide command line argument: --some-param <Some Param>
Must provide command line argument: --other <Other>
Unexpected command line argument provided: --xyz true`),
    );
  });
});
