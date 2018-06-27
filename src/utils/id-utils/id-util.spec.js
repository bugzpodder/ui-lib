// @flow

import { sanitizeId } from "./id-util";

describe("sanitizeId", () => {
	it("should sanitize all normal sample ids", () => {
		expect(sanitizeId("S00010-1")).toBe("S000101");
		expect(sanitizeId("P00010-1")).toBe("P000101");
	});
	it("shouldn't sanitize accession ids or mock sample ids", () => {
		expect(sanitizeId("A00014L-1")).toBe("A00014L-1");
		expect(sanitizeId("NPC-NGS-1")).toBe("NPC-NGS-1");
	});
	it("should be able to handle undefined input", () => {
		expect(sanitizeId(undefined)).toBe("");
	});
});
