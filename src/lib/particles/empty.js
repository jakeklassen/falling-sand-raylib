import r from "raylib";
import { Particle } from "./particle.js";

export class Empty extends Particle {
	static baseColor = "#000000";

	constructor() {
		super({ color: r.BLACK, empty: true });
	}
}
