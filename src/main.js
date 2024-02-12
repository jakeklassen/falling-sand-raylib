import Color from "color";
import { fileURLToPath } from "node:url";
import r from "raylib";
import { Grid } from "./lib/grid.js";

const GAME_WIDTH = 256;
const GAME_HEIGHT = 144;
const GAME_SCALE = 3;

const sandColor = Color.rgb("#dcb159");
const SAND_COLOR = {
	r: sandColor.red(),
	g: sandColor.green(),
	b: sandColor.blue(),
	a: 255,
};

const screenWidth = GAME_WIDTH * GAME_SCALE;
const screenHeight = GAME_HEIGHT * GAME_SCALE;

// Found it was smoother to disable vsync
// r.SetConfigFlags(r.FLAG_VSYNC_HINT);
// r.SetConfigFlags(r.FLAG_WINDOW_UNDECORATED);
// r.SetTargetFPS(60);
r.InitWindow(screenWidth, screenHeight, "falling sand");

const visitorFontUrl = fileURLToPath(
	new URL("../assets/font/visitor1.ttf", import.meta.url)
);

// Not sure why, but this seems needed for this font to render properly
const visitorFont = r.LoadFontEx(visitorFontUrl, 10, 0, 0);

/**
 * We render to a texture that represent that _actual_ game size.
 * This texture will get scaled to the window size.
 */
const renderTexture = r.LoadRenderTexture(GAME_WIDTH, GAME_HEIGHT);
const uiRenderTexture = r.LoadRenderTexture(GAME_WIDTH, GAME_HEIGHT);

const mouse = {
	down: false,
	position: { x: 0, y: 0 },
	update() {
		const mousePosition = r.GetMousePosition();

		this.position.x = (mousePosition.x / GAME_SCALE) | 0;
		this.position.y = (mousePosition.y / GAME_SCALE) | 0;

		this.down = r.IsMouseButtonDown(r.MOUSE_BUTTON_LEFT);

		if (!this.down) {
			return;
		}

		grid.setWithinCircle(this.position.x, this.position.y, 5, 0.5);
	},
};

const grid = new Grid(GAME_WIDTH, GAME_HEIGHT);

const TARGET_FPS = 60;
const STEP = 1 / TARGET_FPS;
let deltaTimeAccumulator = 0;

while (!r.WindowShouldClose()) {
	r.SetWindowTitle(
		`falling sand [mouse: {x: ${mouse.position.x}, y: ${mouse.position.y}}]`
	);

	deltaTimeAccumulator += r.GetFrameTime();

	while (deltaTimeAccumulator >= STEP) {
		grid.update();
		mouse.update();

		deltaTimeAccumulator -= STEP;
	}

	// -------------------------------------------------------------------------
	// Render to texture
	// -------------------------------------------------------------------------

	r.BeginTextureMode(renderTexture);

	// r.ClearBackground(r.BLACK);

	grid.render();

	r.EndTextureMode();

	// Mouse cursor
	r.BeginTextureMode(uiRenderTexture);
	r.ClearBackground(r.BLANK);
	r.DrawCircle(mouse.position.x, mouse.position.y, 3, SAND_COLOR);
	r.EndTextureMode();

	// -------------------------------------------------------------------------
	// Render to screen
	// -------------------------------------------------------------------------

	r.BeginDrawing();
	r.ClearBackground(r.BLANK);

	// Draw "sand" texture
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

	// Draw "ui" texture
	r.DrawTexturePro(
		uiRenderTexture.texture,
		{
			x: 0,
			y: 0,
			width: uiRenderTexture.texture.width,
			height: -uiRenderTexture.texture.height,
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

	r.DrawFPS(screenWidth - 120, 10);

	r.EndDrawing();
}

// -------------------------------------------------------------------------
// De-Initialization
// -------------------------------------------------------------------------
// Close audio device (music streaming is automatically stopped)
r.CloseAudioDevice();

r.UnloadRenderTexture(renderTexture);
r.UnloadRenderTexture(uiRenderTexture);
r.UnloadFont(visitorFont);

r.CloseWindow();
