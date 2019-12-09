export type ExportableColumn<T> = {
  // Defines the name of the header in the exported file. In paged tables, if
  // this is not specified, its value will come from the Header field if it is a
  // string, else the exportAccessor field if it is a string, else the accessor
  // field if it is a string, else the index of the column.
  exportHeaderName: string;
  // Defines the accessor for the value in each row of the exported file. If it
  // is a function, the function should take the object and return the string to
  // be printed. If it is a string, the object's value at the attribute with
  // that name will be printed unmodified. In paged tables, if this is not
  // specified, the `accessor` field will be used instead.
  exportAccessor: string | ((x0: T) => string);
};

export type ReportOptions = {
  delimiter?: string;
  fileMimeType?: string;
};
