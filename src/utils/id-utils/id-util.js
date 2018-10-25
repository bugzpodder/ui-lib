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

export const getSamplePrefix = (id: string) => id.substr(0, id.length - 1);

const getSampleSuffix = (id: string) => id[id.length - 1];

export const getSampleLabel = (id: string) => `${getSamplePrefix(id)}-${getSampleSuffix(id)}`;

export const getInputBarcode = (id: string = "", previousId: string = "") => {
  id = id.trim();
  if (!previousId) {
    return id;
  }

  const prefix = getSamplePrefix(id);
  const previousLabelPrefix = getSamplePrefix(previousId);
  if (prefix === previousLabelPrefix) {
    return getSampleLabel(id);
  }
  return id;
};
