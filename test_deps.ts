export * from "https://deno.land/std@0.123.0/testing/asserts.ts";

/** Largest 32 bit unsigned integer */
const MAX_32_BIT_INT = 2 ** 32;

/** The current random number generator state */
let t = 0;

/** Provides an initial seed for `Math.random` */
export const seed = (n: number) => {
  t = n + 0x6D2B79F5;
};

/** Mulberry32 random number generator */
Math.random = () => {
  t = Math.imul(t ^ t >>> 15, t | 1);
  t ^= t + Math.imul(t ^ t >>> 7, t | 61);
  return ((t ^ t >>> 14) >>> 0) / MAX_32_BIT_INT;
};
