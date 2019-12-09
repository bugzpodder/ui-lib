import { ExportableColumn, ReportOptions } from "../../types/report-utils";
export declare const getAccessors: (columns: ExportableColumn<any>[]) => (string | Function)[];
export declare const toTableRow: (accessors: (string | Function)[], datum: {
    [x: string]: any;
}) => string[];
export declare const toDelimitedReport: (columns: ExportableColumn<any>[], data: {
    [x: string]: any;
}[], options?: ReportOptions) => string | null | undefined;
