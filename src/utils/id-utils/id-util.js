// @flow

const SANITIZATION_EXCEPTIONS = [
  /^NPC/, // Mock NPC qPCR/NGS samples (ex: NPC-QPCR-1A, NPC-NGS-1)
  /^A/, // Accession labels (ex: A00014L-1)
];
export const sanitizeId = (id: string = "") => {
  id = id.trim();

  // Do not sanitize if id matches any exceptions (mock NGS, qPCR, accession samples)
  if (SANITIZATION_EXCEPTIONS.some(regex => regex.test(id))) {
    return id;
  }
  return id.replace(/-/g, "");
};

export const getInputBarcode = (id: string = "", previousId: string = "") => {
  id = id.trim();
  if (!previousId) {
    return id;
  }

  const prefix = id.substr(0, id.length - 1);
  const suffix = id[id.length - 1];
  const previousLabelPrefix = previousId.substr(0, previousId.length - 1);
  if (prefix === previousLabelPrefix) {
    return `${prefix}-${suffix}`;
  }
  return id;
};
