import { upperAlphaChars } from "../string-utils";

const gridChars = [
  ...upperAlphaChars,
  ...upperAlphaChars.map((char) => `A${char}`),
];

export const getRowHeader = (rowIndex: number): string => {
  if (rowIndex < 0 || rowIndex >= gridChars.length) {
    throw new Error(`Invalid row index: ${rowIndex}`);
  }
  return gridChars[rowIndex];
};

// colIndex is 0-based.
export const getColHeader = (colIndex: number): string => `${colIndex + 1}`;

export const getGridCellPosition = (
  rowIndex: number,
  colIndex: number,
): string => `${getRowHeader(rowIndex)}${getColHeader(colIndex)}`;
