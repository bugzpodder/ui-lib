/// <reference types="lodash" />
import { ApiDispatchers, ApiObjectProcessors, ApiOptions, JsonResult, UnprocessedJsonResult } from "../types/api";
export declare const extractIssueCodes: (object: UnprocessedJsonResult, issueType?: string) => any;
export declare const extractErrorMessages: import("lodash").Function1<UnprocessedJsonResult, any>;
export declare const extractWarningMessages: import("lodash").Function1<UnprocessedJsonResult, any>;
export declare const extractErrorCodes: import("lodash").Function1<UnprocessedJsonResult, any>;
declare type ApiConnection = {
    apiUrl: string;
    version: string;
};
export declare class Api {
    apiName: string;
    apiUrl: string;
    apiVersion: string;
    authPromise: Promise<any> | undefined;
    apiDispatchers: ApiDispatchers | undefined | null;
    apiObjectProcessors: ApiObjectProcessors | undefined | null;
    constructor(apiName: string, { apiUrl, version }: ApiConnection);
    getAcceptVersionHeader: () => string;
    getCommonHeaders: () => {
        headers: {
            accept: string;
            "x-request-id": string;
        };
    };
    getBlob: (urlSuffix: string) => any;
    sendBlobRequest: (method: string, urlSuffix: string, body?: {
        [x: string]: any;
    } | undefined, options?: ApiOptions) => any;
    postBlob: (urlSuffix: string, blob: Blob, options?: ApiOptions) => Promise<JsonResult>;
    getJson: (urlSuffix: string, options?: ApiOptions) => Promise<JsonResult>;
    sendJsonUpdateRequest: (method: string, urlSuffix: string, object: {
        [x: string]: any;
    }, options?: ApiOptions) => Promise<JsonResult>;
    postJson: (urlSuffix: string, object: {
        [x: string]: any;
    }, options?: ApiOptions) => Promise<JsonResult>;
    putJson: (urlSuffix: string, object: {
        [x: string]: any;
    }, options?: ApiOptions) => Promise<JsonResult>;
    patchJson: (urlSuffix: string, object: {
        [x: string]: any;
    }, options?: ApiOptions) => Promise<JsonResult>;
    deleteJson: (urlSuffix: string, object: {
        [x: string]: any;
    }, options?: ApiOptions) => Promise<JsonResult>;
    processJsonResponse: (response: {
        [x: string]: any;
    }, options?: ApiOptions) => JsonResult;
    processCatch: (urlSuffix: string, options: ApiOptions, error: Error) => JsonResult;
    setDispatchers: (apiDispatchers: ApiDispatchers) => void;
    setObjectProcessors: (objectProcessors: ApiObjectProcessors) => void;
}
export {};
