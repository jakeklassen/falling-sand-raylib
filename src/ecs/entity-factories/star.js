/**
 * @typedef StarFactoryOptions
 * @property {NonNullable<import("../entity.js").Entity['transform']>['position']} position
 * @property {World<import("../entity.js").Entity>} world
 */

import { World } from "objecs";
import { rndFromList } from "../../lib/array.js";
import { rndInt } from "../../lib/math.js";
import { Pico8Colors } from "../constants.js";

/**
 *
 * @param {StarFactoryOptions} options
 */
export function starFactory({ position, world }) {
	const entity = world.createEntity({
		direction: {
			x: 0,
			y: 1,
		},
		star: {
			color: Pico8Colors.Color7,
		},
		transform: {
			position,
			rotation: 0,
			scale: {
				x: 1,
				y: 1,
			},
		},
		velocity: {
			x: 0,
			y: rndFromList([60, 30, 20]),
		},
	});

	// Adjust star color based on velocity
	if (entity.velocity.y < 30) {
		entity.star.color = Pico8Colors.Color1;
	} else if (entity.velocity.y < 60) {
		entity.star.color = Pico8Colors.Color13;
	}
}

/**
 * @typedef StarfieldFactoryOptions
 * @property {number} areaWidth
 * @property {number} areaHeight
 * @property {number} count
 * @property {World<import("../entity.js").Entity>} world
 */

/**
 * @param {StarfieldFactoryOptions} options
 */
export function starfieldFactory({ areaHeight, areaWidth, count, world }) {
	for (let i = 0; i < count; i++) {
		starFactory({
			position: {
				x: rndInt(areaWidth, 1),
				y: rndInt(areaHeight, 1),
			},
			world,
		});
	}
}
