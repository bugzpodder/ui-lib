// @flow

export const getAccessors = (columns: Array<ReportColumn>): Array<string | (Object => string)> => columns.map(({ accessor }) => accessor || "");

// eslint-disable-next-line max-len
export const toTableRow = (accessors: Array<string | (Object => string)>, datum: Object): Array<string> => accessors.map((accessor) => {
  let columnDatum = typeof accessor === "function" ? accessor(datum) : datum[accessor];
  if (columnDatum === null) {
    return "";
  }
  if (typeof columnDatum !== "string") {
    return columnDatum;
  }
  columnDatum = columnDatum.replace(/"/g, '""');
  return columnDatum.includes(",") ? `"${columnDatum}"` : columnDatum;
});

export const toDelimitedReport = (
  columns: Array<ReportColumn>,
  data: Array<Object>,
  options: ReportOptions = {},
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
  formattedRows.push(headers.join(delimiter));

  formattedRows.push(...data.map(datum => toTableRow(accessors, datum).join(delimiter)));
  return `${formattedRows.join("\n")}\n`;
};
