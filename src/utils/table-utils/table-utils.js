// @flow

import * as CSV from "csv-string";

export const getAccessors = (
  columns: Array<ExportableColumn>
): Array<string | (Object => string
)> => columns.map(({ exportAccessor }) => exportAccessor || "");

export const toTableRow = (
  accessors: Array<string | (Object => string)>,
  datum: Object
): Array<string> =>
  // Return an array of converted columns
  // eslint-disable-next-line implicit-arrow-linebreak
  accessors.map((accessor) => {
    const columnDatum = typeof accessor === "function" ? accessor(datum) : datum[accessor];
    if (columnDatum === null) {
      return "";
    }
    return columnDatum;
  });
export const toDelimitedReport = (
  columns: Array<ExportableColumn>,
  data: Array<Object>,
  options: ReportOptions = {}
): ?string => {
  const accessors = getAccessors(columns);
  const { delimiter = "," } = options;

  const formattedRows = [];
  const headers = columns.map(({ exportHeaderName }, index) => {
    if (exportHeaderName) {
      return exportHeaderName;
    }
    const accessor = accessors[index];
    return typeof accessor === "function" ? index : accessor;
  });
  formattedRows.push(headers);

  formattedRows.push(data.map((datum) => toTableRow(accessors, datum)));
  return CSV.stringify(formattedRows, delimiter);
};
