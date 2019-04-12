// @flow
import { upperAlphaChars } from "../string-utils";

export const getRowHeader = (rowIndex: number) => {
  if (rowIndex < 0 || rowIndex >= upperAlphaChars.length) {
    throw new Error(`Invalid row index: ${rowIndex}`);
  }
  return upperAlphaChars[rowIndex];
};

// colIndex is 0-based.
export const getColHeader = (colIndex: number) => `${colIndex + 1}`;

export const getGridCellPosition = (rowIndex: number, colIndex: number) => `${getRowHeader(rowIndex)}${getColHeader(colIndex)}`;
