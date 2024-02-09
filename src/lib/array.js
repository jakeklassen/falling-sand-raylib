/**
 * @template T
 * @param {Array<T>} list
 * @returns {T}
 */
export const rndFromList = (list) =>
	list[Math.floor(Math.random() * list.length)];
