import { World } from "objecs";
import { hexColorToRGBA } from "../../lib/color.js";

/**
 * @typedef StarfieldRenderingSystemOptions
 * @property {World<import("../entity.js").Entity>} world
 * @property {import('raylib')} r
 */

/**
 * @param {StarfieldRenderingSystemOptions} options
 */
export function starfieldRenderingSystemFactory({ world, r }) {
	const stars = world.archetype("star", "transform");

	return function starfieldRenderingSystem() {
		for (const { star, transform } of stars.entities) {
			r.rlPushMatrix();

			r.rlTranslatef(transform.position.x | 0, transform.position.y | 0, 0);
			r.rlRotatef(transform.rotation, 0, 0, 1);
			r.rlScalef(transform.scale.x, transform.scale.y, 1);

			r.DrawRectangle(0, 0, 1, 1, hexColorToRGBA(star.color));

			r.rlPopMatrix();
		}
	};
}
