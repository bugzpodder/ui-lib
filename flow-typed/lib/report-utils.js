declare type ReportColumn = {
  accessor?: string | (Object => string),
  exportHeaderName?: string,
};

declare type ReportOptions = {
  delimiter?: string,
  fileMimeType?: string,
};
