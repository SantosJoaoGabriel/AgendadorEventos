/**
 * Tipos compartilhados entre features.
 * Tipos que pertencem a uma única feature ficam em src/features/<feature>/types.ts.
 */

export type ID = string;

export type Money = number;

export type WithTimestamps = {
  createdAt: string;
  updatedAt: string;
};
