import { ExportableColumn, ReportOptions } from "../../types/report-utils";
export declare const getAccessors: (columns: ExportableColumn<any>[]) => (string | Function)[];
export declare const toTableRow: (accessors: (string | Function)[], datum: Record<string, any>) => string[];
export declare const toDelimitedReport: (columns: ExportableColumn<any>[], data: Record<string, any>[], options?: ReportOptions) => string;
