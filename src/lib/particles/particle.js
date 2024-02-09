export class Particle {
	/**
	 * @type {import("raylib").Color}
	 */
	color;

	/**
	 * @type {boolean}
	 */
	empty;

	/**
	 * @type {boolean}
	 */
	modified = false;

	/**
	 *
	 * @param {import("./particle.type.js").ParticleOptions} options
	 */
	constructor(options) {
		this.color = options.color;
		this.empty = options.empty ?? false;
	}
}
