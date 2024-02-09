import { World } from "objecs";

/**
 * @typedef MovementSystemOptions
 * @property {World<import("../entity.js").Entity>} world
 */

/**
 * @param {MovementSystemOptions} options
 */
export function movementSystemFactory({ world }) {
	const movables = world.archetype("direction", "transform", "velocity");

	/**
	 * @param {number} dt
	 */
	return function movementSystem(dt) {
		for (const entity of movables.entities) {
			entity.transform.position.x +=
				entity.velocity.x * entity.direction.x * dt;

			entity.transform.position.y +=
				entity.velocity.y * entity.direction.y * dt;
		}
	};
}
