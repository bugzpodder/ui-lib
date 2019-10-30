// @flow
// eslint-disable-next-line import/no-extraneous-dependencies
import { WebSocket } from "mock-socket";

export const fetch = (): Promise<Response> =>
  new Promise(resolve => {
    const blob = new global.Blob(["{Result: []}"]);
    resolve(new Response(blob, { status: 200, statusText: "OK" }));
  });

global.fetch = fetch;

global.self = global;

global.WebSocket = WebSocket;
