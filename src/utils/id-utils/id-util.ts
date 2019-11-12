const SANITIZATION_EXCEPTIONS = [
  /^NPC/, // Mock NPC qPCR/NGS samples (ex: NPC-QPCR-1A, NPC-NGS-1)
  /^A/, // Accession labels (ex: A00014L-1)
];
const ID_REGEXP = /^[A-Za-z0-9]+[\u002D\u058A\u05BE\u1806\u2010\u2011\u2012\u2013\u2014\u2015\u2E3A\u2E3B\uFE58\uFE63\uFF0D][A-Za-z0-9]$/;

const getSampleSuffix = (id: string) => id[id.length - 1];

export const sanitizeId = (idInput = "") => {
  const id = idInput.trim();

  // Do not sanitize if id matches any exceptions (mock NGS, qPCR, accession samples)
  if (SANITIZATION_EXCEPTIONS.some(regex => regex.test(id))) {
    return id;
  }

  // Note there are many types of dashes to sanitize here. Turns out our UI often shows U+2011 Non-breaking Hyphen
  // Including hyphen looking characters from: https://www.fileformat.info/info/unicode/category/Pd/list.htm
  return ID_REGEXP.test(id)
    ? id.substr(0, id.length - 2) + getSampleSuffix(id)
    : id;
};

export const getSamplePrefix = (id: string) => id.substr(0, id.length - 1);

export const getSampleLabel = (id: string) =>
  `${getSamplePrefix(id)}-${getSampleSuffix(id)}`;

export const getInputBarcode = (id = "", previousId = "") => {
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
