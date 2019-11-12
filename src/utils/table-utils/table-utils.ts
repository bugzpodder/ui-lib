import * as CSV from "csv-string";
import { ExportableColumn, ReportOptions } from "types/report-utils";

export const getAccessors = (
  columns: Array<ExportableColumn>,
): (string | Function)[] =>
  columns.map(({ exportAccessor }) => exportAccessor || "");

export const toTableRow = (
  accessors: (string | Function)[],
  datum: {
    [x: string]: any;
  }, // Return an array of converted columns
): string[] => // eslint-disable-next-line implicit-arrow-linebreak
  accessors.map(accessor => {
    const columnDatum =
      typeof accessor === "function" ? accessor(datum) : datum[accessor];
    if (columnDatum === null) {
      return "";
    }
    return columnDatum;
  });
export const toDelimitedReport = (
  columns: Array<ExportableColumn>,
  data: Array<{
    [x: string]: any;
  }>,
  options: ReportOptions = {},
): string | undefined | null => {
  const accessors = getAccessors(columns);
  const { delimiter = "," } = options;

  const formattedRows: any[] = [];
  const headers = columns.map(({ exportHeaderName }, index) => {
    if (exportHeaderName) {
      return exportHeaderName;
    }
    const accessor = accessors[index];
    return typeof accessor === "function" ? index : accessor;
  });
  formattedRows.push(headers);

  formattedRows.push(data.map(datum => toTableRow(accessors, datum)));
  return CSV.stringify(formattedRows, delimiter);
};
