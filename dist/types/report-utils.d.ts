export declare type ExportableColumn<T> = {
    exportHeaderName: string;
    exportAccessor: string | ((x0: T) => string);
};
export declare type ReportOptions = {
    delimiter?: string;
    fileMimeType?: string;
};
