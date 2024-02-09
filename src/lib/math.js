/**
 *
 * @param {number} max
 * @param {number} min
 * @returns
 */
export const rnd = (max, min = 0) => Math.random() * (max - min) + min;

/**
 *
 * @param {number} max
 * @param {number} min
 * @returns
 */
export const rndInt = (max, min = 0) => Math.floor(rnd(max, min));

/**
 *
 * @param {number} deg
 * @returns
 */
export const deg2rad = (deg) => (deg * Math.PI) / 180;

/**
 *
 * @param {number} rad
 * @returns
 */
export const rad2deg = (rad) => (rad * 180) / Math.PI;
