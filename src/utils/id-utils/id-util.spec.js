// @flow

import {
  getInputBarcode,
  getSampleLabel,
  getSamplePrefix,
  sanitizeId,
} from "./id-util";

describe("sanitizeId", () => {
  it("should sanitize all normal sample ids", () => {
    expect(sanitizeId("S00010-1")).toBe("S000101");
    expect(sanitizeId("S00010-1")).toBe("S000101");
    expect(sanitizeId("S00010-1")).toBe("S000101");
    expect(sanitizeId("S00010-1")).toBe("S000101");
    expect(sanitizeId("S00010-1")).toBe("S000101");
    expect(sanitizeId("S00010-1")).toBe("S000101");
  });
  const dashTypes = "-‑\u002D\u058A\u05BE\u1806\u2010\u2011\u2012\u2013\u2014\u2015\u2E3A\u2E3B\uFE58\uFE63\uFF0D".split(
    "",
  );
  dashTypes.forEach((dash, index) => {
    it(`should sanitize dash type ${dash} (${index})`, () => {
      expect(sanitizeId(`S00010${dash}1`)).toBe("S000101");
    });
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

describe("getSampleLabel", () => {
  it("returns hyphenated sample label", () => {
    expect(getSampleLabel("P000101")).toBe("P00010-1");
  });
});

describe("getSamplePrefix", () => {
  it("returns sample prefix", () => {
    expect(getSamplePrefix("P000101")).toBe("P00010");
  });
});
