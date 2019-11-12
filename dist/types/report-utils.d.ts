export declare type ExportableColumn = {
  exportHeaderName: string;
  exportAccessor: string | ((x0: Record<string, any>) => string);
};
export declare type ReportOptions = {
  delimiter?: string;
  fileMimeType?: string;
};
