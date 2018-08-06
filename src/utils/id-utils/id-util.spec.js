// @flow

import { getInputBarcode, sanitizeId } from "./id-util";

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

describe("getInputBarcode", () => {
  it("returns input barcode when given id and previous id", () => {
    expect(getInputBarcode("P000101", "P000100")).toBe("P00010-1");
    expect(getInputBarcode("S000100", "S000100")).toBe("S00010-0");
  });
  it("returns same as id when not given previous id", () => {
    expect(getInputBarcode("NPC-NGS-1", "")).toBe("NPC-NGS-1");
    expect(getInputBarcode("NPC-NGS-1")).toBe("NPC-NGS-1");
  });
  it("should be able to handle undefined input", () => {
    expect(getInputBarcode(undefined)).toBe("");
  });
  it("should return the given id when the previous id doesn't match", () => {
    expect(getInputBarcode("S000100", "P000100")).toBe("S000100");
  });
});
