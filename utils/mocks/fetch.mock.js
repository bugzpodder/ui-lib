// @flow
import { WebSocket } from "mock-socket";

export const fetch = (): Promise<Response> => {
	return new Promise(resolve => {
		const blob = new global.Blob(["{Result: []}"]);
		resolve(new Response(blob, { status: 200, statusText: "OK" }));
	});
};

global.fetch = fetch;

global.self = global;

global.WebSocket = WebSocket;
