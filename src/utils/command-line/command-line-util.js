// @flow
import isArray from "lodash/isArray";
import isEmpty from "lodash/isEmpty";
import { sentenceCase } from "../string-utils";

/*
Process command line arguments in the form of `key: optionalValue` into public and secret config values.
*/
export const processCommandLineArgs = (
  commandLineArguments: minimistOutput,
  argumentProps: Array<CommandLineArgumentProp>,
): CommandLineConfigs => {
  const errors = [];
  const unprocessedArgumentNames = new Set(Object.keys(commandLineArguments));

  const configs = argumentProps
    .map((argumentProp) => {
      const {
        name, isRequired, defaultValue = true, valuePlaceholderText, configType = "public",
      } = argumentProp;
      // Remove expected arguments if they exist. Unexpected arguments may be optional, handled below.
      unprocessedArgumentNames.delete(name);

      let value = commandLineArguments[name];
      if (value == null && isRequired) {
        errors.push(
          `Must provide command line argument: --${name} <${
            valuePlaceholderText || defaultValue != null ? sentenceCase(name) : ""
          }>`.trim(),
        );
        return { isError: true };
      }
      if (value == null) {
        value = defaultValue;
      }
      return { name, value, configType };
    })
    .reduce((acc, configProps) => {
      if (!configProps.isError) {
        const { name, value, configType } = configProps;
        acc[configType] = acc[configType] ? acc[configType] : {};
        acc[configType][name] = value;
      }
      return acc;
    }, {});

  unprocessedArgumentNames.forEach((name) => {
    const value = commandLineArguments[name];
    if (value != null) {
      if (!isArray(value) || !isEmpty(value)) {
        errors.push(`Unexpected command line argument provided: --${name} ${value}`);
      }
    }
  });

  if (errors.length) {
    const errorMessage = `${errors.length} error(s) detected.\n${errors.join("\n")}`;
    const error = new Error(errorMessage);
    throw error;
  }
  return configs;
};
