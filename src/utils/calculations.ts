/**
 * Linearly interpolates between two values based on a ratio t.
 * When t is 0, returns the start value, and when t is 1, returns the end value.
 * For values of t between 0 and 1, returns an interpolated value between start and end.
 *
 * @param {number} start - The start value.
 * @param {number} end - The end value.
 * @param {number} t - The ratio between 0 and 1.
 * @return {number} The interpolated value between start and end based on the ratio t.
 */
export function lerp(start: number, end: number, t: number): number {
  return start * (1 - t) + end * t
}
