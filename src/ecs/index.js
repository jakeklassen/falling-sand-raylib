import { fileURLToPath } from "node:url";
import { World } from "objecs";
import r from "raylib";
import { starfieldFactory } from "./entity-factories/star.js";
import { movementSystemFactory } from "./systems/movement-system.js";
import { starfieldRenderingSystemFactory } from "./systems/starfield-rendering-system.js";
import { starfieldSystemFactory } from "./systems/starfield-system.js";

const GAME_WIDTH = 128;
const GAME_HEIGHT = 128;

const screenWidth = GAME_WIDTH * 4;
const screenHeight = GAME_HEIGHT * 4;

// Found it was smoother to disable vsync
// r.SetConfigFlags(r.FLAG_VSYNC_HINT);
// r.SetConfigFlags(r.FLAG_WINDOW_UNDECORATED);
// r.SetConfigFlags(r.FLAG_FULLSCREEN_MODE);
r.InitWindow(screenWidth, screenHeight, "ECS Demo");
r.SetWindowMinSize(GAME_WIDTH, GAME_HEIGHT);
// r.SetTargetFPS(60);

const playerTextureUrl = fileURLToPath(
	new URL("../../assets/image/player-ship.png", import.meta.url)
);

const pico8FontUrl = fileURLToPath(
	new URL("../../assets/font/pico-8.ttf", import.meta.url)
);

// Not sure why, but this seems needed for this font to render properly
const pico8Font = r.LoadFontEx(pico8FontUrl, 5, 0, 0);

const playerTexture = r.LoadTexture(playerTextureUrl);

/**
 * We render to a texture that represent that _actual_ game size.
 * This texture will get scaled to the window size.
 */
const renderTexture = r.LoadRenderTexture(GAME_WIDTH, GAME_HEIGHT);

/**
 * @type {World<import("./entity.js").Entity>}
 */
const world = new World();

starfieldFactory({
	areaWidth: GAME_WIDTH - 1,
	areaHeight: GAME_HEIGHT - 1,
	count: 100,
	world,
});

const systems = [
	starfieldSystemFactory({
		world,
	}),
	movementSystemFactory({
		world,
	}),
	starfieldRenderingSystemFactory({
		r,
		world,
	}),
];

const input = {
	left: false,
	right: false,
	up: false,
	down: false,
};

const TARGET_FPS = 60;
const STEP = 1 / TARGET_FPS;
const dt = STEP;
let variableDt = 0;
let deltaTimeAccumulator = 0;

while (!r.WindowShouldClose()) {
	r.SetWindowTitle(`ECS Demo [FPS: ${r.GetFPS()}]`);

	deltaTimeAccumulator += r.GetFrameTime();
	variableDt = r.GetFrameTime();

	input.left = r.IsKeyDown(r.KEY_LEFT);
	input.right = r.IsKeyDown(r.KEY_RIGHT);
	input.up = r.IsKeyDown(r.KEY_UP);
	input.down = r.IsKeyDown(r.KEY_DOWN);

	// -------------------------------------------------------------------------
	// Render to texture
	// -------------------------------------------------------------------------

	r.BeginTextureMode(renderTexture);

	r.ClearBackground(r.BLACK);

	while (deltaTimeAccumulator >= STEP) {
		// Fixed update

		deltaTimeAccumulator -= STEP;
	}

	for (const system of systems) {
		system(variableDt);
	}

	const textMetrics = r.MeasureTextEx(pico8Font, `ECS Demo`, 5, 1);
	r.DrawTextEx(
		pico8Font,
		`ECS Demo`,
		{ x: Math.floor(GAME_WIDTH / 2 - textMetrics.x / 2), y: 1 },
		5,
		1,
		r.WHITE
	);

	r.EndTextureMode();

	// -------------------------------------------------------------------------
	// Render to screen
	// -------------------------------------------------------------------------

	r.BeginDrawing();

	r.ClearBackground(r.BLACK);

	r.DrawTexturePro(
		renderTexture.texture,
		{
			x: 0,
			y: 0,
			width: renderTexture.texture.width,
			height: -renderTexture.texture.height,
		},
		{
			x: 0,
			y: 0,
			width: screenWidth,
			height: screenHeight,
		},
		{
			x: 0,
			y: 0,
		},
		0,
		r.WHITE
	);

	r.EndDrawing();
}

// -------------------------------------------------------------------------
// De-Initialization
// -------------------------------------------------------------------------
r.CloseAudioDevice(); // Close audio device (music streaming is automatically stopped)

r.UnloadRenderTexture(renderTexture);
r.UnloadTexture(playerTexture);

r.CloseWindow();
