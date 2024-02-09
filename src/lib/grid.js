import r from "raylib";
import { Empty } from "./particles/empty.js";
import { Particle } from "./particles/particle.js";
import { Sand } from "./particles/sand.js";

export class Grid {
	#cleared = false;

	/**
	 * @type {number}
	 */
	#width;

	/**
	 * @type {number}
	 */
	#height;

	/**
	 * @type {Array<Particle>}
	 */
	#grid = [];

	/**
	 * @type {Set<number>}
	 */
	#modifiedIndices = new Set();

	/**
	 * @type {number}
	 */
	#rowCount;

	/**
	 *
	 * @param {number} width
	 * @param {number} height
	 */
	constructor(width, height) {
		this.#width = width;
		this.#height = height;
		this.#grid = new Array(width * height).fill(new Empty());
		this.#rowCount = Math.floor(this.#grid.length / width);
	}

	update() {
		this.#cleared = false;
		this.#modifiedIndices.clear();

		for (let row = this.#rowCount - 1; row >= 0; row--) {
			const rowOffset = row * this.#width;
			const leftToRight = Math.random() > 0.5;

			for (let i = 0; i < this.#width; i++) {
				let index = leftToRight ? rowOffset + i : rowOffset + this.#width - i;

				if (this.isEmpty(index)) {
					continue;
				}

				const particle = this.#grid[index];

				if (!(particle instanceof Sand)) {
					continue;
				}

				particle?.update();

				if (!particle?.modified) {
					continue;
				}

				// Update the number of times the particle instructs us to
				for (let v = 0; v < particle.getUpdateCount(); v++) {
					const below = index + this.#width;
					const belowLeft = below - 1;
					const belowRight = below + 1;
					const column = index % this.#width;
					let newIndex = index;

					if (this.isEmpty(below)) {
						this.swap(index, below);
						newIndex = below;
					} else if (
						this.isEmpty(belowLeft) &&
						belowLeft % this.#width < column
					) {
						this.swap(index, belowLeft);
						newIndex = belowLeft;
					} else if (
						this.isEmpty(belowRight) &&
						belowRight % this.#width > column
					) {
						this.swap(index, belowRight);
						newIndex = belowRight;
					}

					if (newIndex !== index) {
						// We can add the same index multiple times, it's a set.
						this.#modifiedIndices.add(index);
						this.#modifiedIndices.add(newIndex);
						index = newIndex;
					} else {
						particle.resetVelocity();
						break;
					}
				}
			}
		}
	}

	render() {
		if (this.#cleared) {
			r.ClearBackground(r.BLACK);
		}

		for (const index of this.#modifiedIndices) {
			const x = index % this.#width;
			const y = Math.floor(index / this.#width);
			const particle = this.#grid[index];

			r.DrawPixel(x, y, particle.color);
		}
	}

	clear() {
		this.#grid.fill(new Empty());
		this.#modifiedIndices.clear();
		this.#cleared = true;
	}

	/**
	 *
	 * @param {number} x
	 * @param {number} y
	 * @returns
	 */
	index(x, y) {
		return x + y * this.#width;
	}

	/**
	 *
	 * @param {number} x
	 * @param {number} y
	 * @param {Particle} particle
	 * @returns
	 */
	set(x, y, particle) {
		const index = this.index(x, y);

		// Ignore out of bounds
		if (x < 0 || x >= this.#width) return;
		if (y < 0 || y >= this.#height) return;

		this.setIndex(index, particle);
	}

	/**
	 *
	 * @param {number} index
	 * @param {Particle} particle
	 */
	setIndex(index, particle) {
		this.#grid[index] = particle;
		this.#modifiedIndices.add(index);
	}

	/**
	 *
	 * @param {number} x
	 * @param {number} y
	 * @param {number} radius
	 * @param {number} probability
	 */
	setWithinCircle(x, y, radius = 2, probability = 1) {
		let radiusSq = radius * radius;

		for (let y1 = -radius; y1 <= radius; y1++) {
			for (let x1 = -radius; x1 <= radius; x1++) {
				if (x1 * x1 + y1 * y1 <= radiusSq && Math.random() < probability) {
					this.set(x + x1, y + y1, new Sand());
				}
			}
		}
	}

	/**
	 *
	 * @param {number} a
	 * @param {number} b
	 * @returns
	 */
	swap(a, b) {
		if (this.isEmpty(a) && this.isEmpty(b)) {
			return;
		}

		const temp = this.#grid[a];
		this.#grid[a] = this.#grid[b];
		this.setIndex(a, this.#grid[b]);
		this.setIndex(b, temp);
	}

	/**
	 *
	 * @param {number} x
	 * @param {number} y
	 * @returns
	 */
	get(x, y) {
		return this.#grid[x + y * this.#width];
	}

	/**
	 *
	 * @param {number} index
	 * @returns
	 */
	isEmpty(index) {
		return this.#grid.at(index)?.empty ?? false;
	}
}
