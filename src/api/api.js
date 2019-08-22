// @flow
import HttpStatus from "http-status-codes";
import merge from "lodash/merge";
import moment from "moment";
import partialRight from "lodash/partialRight";
import uuid from "uuid";

const SEMICOLON_SEPARATOR = "; ";

const GENERIC_ERROR_MESSAGE = "Bad API response.";

const extractIssueMessages = (
  object: UnprocessedJsonResult,
  issueType: string = "errors"
) => {
  if (object.errors) {
    return object.errors[issueType].map((error) => error.message);
  }
  return [];
};
export const extractIssueCodes = (
  object: UnprocessedJsonResult,
  issueType: string = "errors"
) => {
  if (object.errors) {
    return object.errors[issueType]
      .map((error) => error.errorCode)
      .filter((errorCode) => errorCode);
  }
  return [];
};

export const extractErrorMessages = partialRight(
  extractIssueMessages,
  "errors"
);
export const extractWarningMessages = partialRight(
  extractIssueMessages,
  "warnings"
);
export const extractErrorCodes = partialRight(extractIssueCodes, "errors");

type ApiConnection = {
  apiUrl: string,
  version: string
};

const defaultOptions = {};

// This specifically checks for 500 server errors. Use this prior to parsing response.
// Some 500 errors don't have JSON body content, and have to be pre-processed here.
// If the server sends 500 with JSON, which will be extracted in `processJsonResponse`
// See T4365 and T5850
const checkForServerError = (response: Object) => new Promise((resolve, reject) => {
  const { status } = response;
  if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
    const contentType = response.headers.get("Content-Type");
    if (!contentType || !contentType.includes("application/json")) {
      const errorMessage = "500 Server Error";
      return reject(new Error(errorMessage));
    }
  } else if (status === HttpStatus.NOT_FOUND) {
    const errorMessage = "404 Not Found";
    return reject(new Error(errorMessage));
  }
  // Otherwise, fall through to allow `processJsonResponse` to handle json error and warning messages.
  return resolve(response);
});

// Check for API server version mismatch. If mismatched, throw an error and reload the UI.
const checkForServerVersionMismatch = (response: Object) => new Promise((resolve) => {
  const { status } = response;
  if (status === HttpStatus.PRECONDITION_FAILED) {
    // If the server rejects the request with PRECONDITION_FAILED, most likely it is due
    // to a version error.
    // Alternatively, it may be some other incompatibility. In any case, the client should
    // reload the UI to correct the issue.
    setTimeout(() => {
      window.location.reload();
    }, 5000);
    throw new Error(`${moment().toISOString()}
        Server disconnected due to data incompatibility, most likely mismatch in version. Restarting client.`);
  }
  return resolve(response);
});

export class Api {
  apiName: string;
  apiUrl: string;
  apiVersion: string;
  authPromise: Promise<*>;
  apiDispatchers: ?ApiDispatchers;
  apiObjectProcessors: ?ApiObjectProcessors;

  constructor(apiName: string, { apiUrl, version }: ApiConnection) {
    this.apiName = apiName;
    this.apiUrl = apiUrl;
    this.apiVersion = version;
  }

  getAcceptVersionHeader = () => `${this.apiName}-version=${this.apiVersion}`;

  getCommonHeaders = () => {
    const commonHeaders = {
      accept: `application/json, ${this.getAcceptVersionHeader()}`,
      "x-request-id": uuid.v4(),
    };
    return { headers: { ...commonHeaders } };
  };

  getBlob = (urlSuffix: string) => this.sendBlobRequest("GET", urlSuffix);

  sendBlobRequest = (
    method: string,
    urlSuffix: string,
    body?: Object,
    options: ApiOptions = defaultOptions
  ) => {
    const headers = merge(
      { headers: { "content-type": "application/json" } },
      this.getCommonHeaders()
    );
    if (this.apiObjectProcessors) {
      body = this.apiObjectProcessors.processOutbound(body, options);
    }
    const { apiDispatchers } = this;
    const fetchOptions = merge({ method }, apiDispatchers, headers, {
      body: JSON.stringify(body),
    });
    // TODO(lkong): convert the promise chain to awaits.
    apiDispatchers && apiDispatchers.dispatchIsLoading(true);
    return fetch(`${this.apiUrl}${urlSuffix}`, fetchOptions)
      .then(checkForServerError)
      .then(checkForServerVersionMismatch)
      .then((response) => {
        const { status, ok } = response;
        if (ok) {
          let filename = "";
          if (response.headers.has("content-disposition")) {
            filename = response.headers
              .get("content-disposition")
              .split("filename=")[1]
              .replace(/"/g, "");
          }
          if (!filename) {
            filename = moment().toISOString();
          }
          return response.blob().then((blob) => ({
            blob,
            filename,
            status,
            statusIsOk: ok,
          }));
        }
        return this.processJsonResponse(
          response,
          merge({}, apiDispatchers, options)
        );
      })
      .catch(this.processCatch.bind(null, urlSuffix))
      .then((response) => {
        apiDispatchers && apiDispatchers.dispatchIsLoading(false);
        return response;
      });
  };

  postBlob = (
    urlSuffix: string,
    blob: Blob,
    options?: ApiOptions = defaultOptions
  ) => {
    const headers = this.getCommonHeaders();
    const formData = new FormData();
    formData.append("file", blob);
    const { apiDispatchers } = this;
    const fetchOptions = merge({ method: "POST" }, apiDispatchers, headers, {
      body: formData,
    });
    // TODO(lkong): convert the promise chain to awaits.
    apiDispatchers && apiDispatchers.dispatchIsSaving(true);
    return fetch(`${this.apiUrl}${urlSuffix}`, fetchOptions)
      .then(checkForServerError)
      .then(checkForServerVersionMismatch)
      .then((resp) => this.processJsonResponse(resp, merge({}, apiDispatchers, options)))
      .catch(this.processCatch.bind(null, urlSuffix))
      .then((response) => {
        apiDispatchers && apiDispatchers.dispatchIsSaving(false);
        return response;
      });
  };

  getJson = (urlSuffix: string, options: ApiOptions = defaultOptions) => {
    const { apiDispatchers } = this;
    // TODO(lkong): convert the promise chain to awaits.
    apiDispatchers && apiDispatchers.dispatchIsLoading(true);
    return fetch(`${this.apiUrl}${urlSuffix}`, this.getCommonHeaders())
      .then(checkForServerError)
      .then(checkForServerVersionMismatch)
      .then((resp) => this.processJsonResponse(resp, merge({}, apiDispatchers, options)))
      .catch(this.processCatch.bind(null, urlSuffix))
      .then((response) => {
        apiDispatchers && apiDispatchers.dispatchIsLoading(false);
        return response;
      });
  };

  sendJsonUpdateRequest = (
    method: string,
    urlSuffix: string,
    object: Object,
    options: ApiOptions = defaultOptions
  ) => {
    const headers = merge(
      { headers: { "content-type": "application/json" } },
      this.getCommonHeaders()
    );
    if (this.apiObjectProcessors) {
      object = this.apiObjectProcessors.processOutbound(object, options);
    }
    const { apiDispatchers } = this;
    const fetchOptions = merge({ method }, headers, {
      body: JSON.stringify(object),
    });
    // TODO(lkong): convert the promise chain to awaits.
    apiDispatchers && apiDispatchers.dispatchIsSaving(true);
    return fetch(`${this.apiUrl}${urlSuffix}`, fetchOptions)
      .then(checkForServerError)
      .then(checkForServerVersionMismatch)
      .then((response) => this.processJsonResponse(response, merge({}, apiDispatchers, options)))
      .catch(this.processCatch.bind(null, urlSuffix))
      .then((response) => {
        apiDispatchers && apiDispatchers.dispatchIsSaving(false);
        return response;
      });
  };

  postJson = (
    urlSuffix: string,
    object: Object,
    options: ApiOptions = defaultOptions
  ) => this.sendJsonUpdateRequest("POST", urlSuffix, object, options);

  putJson = (
    urlSuffix: string,
    object: Object,
    options: ApiOptions = defaultOptions
  ) => this.sendJsonUpdateRequest("PUT", urlSuffix, object, options);

  patchJson = (
    urlSuffix: string,
    object: Object,
    options: ApiOptions = defaultOptions
  ) => this.sendJsonUpdateRequest("PATCH", urlSuffix, object, options);

  deleteJson = (
    urlSuffix: string,
    object: Object,
    options: ApiOptions = defaultOptions
  ) => this.sendJsonUpdateRequest("DELETE", urlSuffix, object, options);

  processJsonResponse = (
    response: Object,
    options: ApiOptions = defaultOptions
  ): JsonResult => {
    const { status, ok } = response;
    return response.json().then((object) => {
      const hasResultInResponse = options.hasResultInResponse !== false;

      if (this.apiObjectProcessors) {
        object = this.apiObjectProcessors.processInbound(object, options);
      }
      const errorMessages = extractErrorMessages(object);
      const warningMessages = extractWarningMessages(object);
      const errorCodes = extractErrorCodes(object);
      let errorMessage = errorMessages.reverse().join(SEMICOLON_SEPARATOR);
      const warningMessage = warningMessages
        .reverse()
        .join(SEMICOLON_SEPARATOR);
      if (!ok && !errorMessage && !warningMessage) {
        errorMessage = GENERIC_ERROR_MESSAGE;
      }
      if (errorMessage) {
        if (status === HttpStatus.UNAUTHORIZED) {
          // This is expected since user is not signed in.
          console.error(errorMessage);
        } else {
          options.handleError && options.handleError(errorMessage, object);
        }
      }
      if (warningMessage) {
        options.handleWarning && options.handleWarning(warningMessage, object);
      }

      let result = null;

      if (!hasResultInResponse) {
        result = object;
      } else if (object) {
        result = object.result || object.Result;
      }

      return {
        status,
        statusIsOk: ok,
        result,
        errorMessages,
        errorMessage,
        errorCodes,
        warningMessages,
        warningMessage,
      };
    });
  };

  processCatch = (urlSuffix: string, error: Error): JsonResult => {
    const { apiDispatchers } = this;
    const { handleError } = apiDispatchers || {};
    let errorMessage = error.message || error.toString();
    errorMessage = `${urlSuffix} error: ${errorMessage}`;
    handleError && handleError(errorMessage, error);
    return {
      status: 0,
      statusIsOk: false,
      // The result should be undefined (or at-least falsey). See T4487
      result: null,
      errorMessages: [],
      errorMessage,
      errorCodes: [],
      warningMessages: [],
      warningMessage: "",
    };
  };

  setDispatchers = (apiDispatchers: ApiDispatchers) => {
    this.apiDispatchers = apiDispatchers;
  };

  setObjectProcessors = (objectProcessors: ApiObjectProcessors) => {
    this.apiObjectProcessors = objectProcessors;
  };
}
