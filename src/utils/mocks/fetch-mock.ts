// eslint-disable-next-line import/no-extraneous-dependencies
import { WebSocket } from "mock-socket";

export const fetch = (): Promise<Response> =>
  new Promise(resolve => {
    const blob = new (global as any).Blob(["{Result: []}"]);
    resolve(new Response(blob, { status: 200, statusText: "OK" }));
  });

(global as any).fetch = fetch;

(global as any).self = global;

(global as any).WebSocket = WebSocket;
