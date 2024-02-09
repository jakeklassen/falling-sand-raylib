import Color from "color";
import randomInteger from "just-random-integer";

/**
 * @param {string} hex
 * @param {number} alpha
 * @returns
 */
export const hexColorToRGBA = (hex, alpha = 255) => {
	const r = parseInt(hex.slice(1, 3), 16);
	const g = parseInt(hex.slice(3, 5), 16);
	const b = parseInt(hex.slice(5, 7), 16);

	return { r, g, b, a: alpha };
};

/**
 *
 * @param {string} colorString
 * @returns
 */
export const varyColor = (colorString) => {
	const color = Color(colorString);
	const hue = color.hue();
	const saturation = color.saturationl() + randomInteger(-20, 0);
	const lightness = color.lightness() + randomInteger(-10, 10);

	return color.hsl(hue, saturation, lightness);
};

/**
 *
 * @param {import('raylib').Color} color
 * @returns
 */
export const varyRaylibColor = (color) => {
	const newColor = varyColor(
		Color.rgb({ r: color.r, g: color.g, b: color.b }).toString()
	);

	const c = Color.rgb(newColor);

	return {
		r: c.red(),
		g: c.green(),
		b: c.blue(),
		a: 255,
	};
};
