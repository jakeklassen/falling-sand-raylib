import { fileURLToPath } from "node:url";
import r from "raylib";

const GAME_WIDTH = 128;
const GAME_HEIGHT = 128;

const screenWidth = GAME_WIDTH * 4;
const screenHeight = GAME_HEIGHT * 4;

// Found it was smoother to disable vsync
// r.SetConfigFlags(r.FLAG_VSYNC_HINT);
r.InitWindow(screenWidth, screenHeight, "raylib movement");

r.InitAudioDevice();

const titleScreenMusicWavUrl = fileURLToPath(
	new URL("../assets/audio/title-screen-music.wav", import.meta.url)
);

const titleScreenMusic = r.LoadMusicStream(titleScreenMusicWavUrl);
if (!titleScreenMusic) {
	console.error("Error loading title screen music");
}

r.PlayMusicStream(titleScreenMusic);

const pico8FontUrl = fileURLToPath(
	new URL("../assets/font/pico-8.ttf", import.meta.url)
);

// Not sure why, but this seems needed for this font to render properly
const pico8Font = r.LoadFontEx(pico8FontUrl, 5, 0, 0);

/**
 * We render to a texture that represent that _actual_ game size.
 * This texture will get scaled to the window size.
 */
const renderTexture = r.LoadRenderTexture(GAME_WIDTH, GAME_HEIGHT);

const TARGET_FPS = 60;
const STEP = 1 / TARGET_FPS;
const dt = STEP;
let variableDt = 0;
let deltaTimeAccumulator = 0;

while (!r.WindowShouldClose()) {
	deltaTimeAccumulator += r.GetFrameTime();
	variableDt = r.GetFrameTime();

	r.UpdateMusicStream(titleScreenMusic);

	while (deltaTimeAccumulator >= STEP) {
		deltaTimeAccumulator -= STEP;
	}

	// -------------------------------------------------------------------------
	// Render to texture
	// -------------------------------------------------------------------------

	r.BeginTextureMode(renderTexture);

	r.ClearBackground(r.BLACK);

	const textMetrics = r.MeasureTextEx(pico8Font, `Music Demo`, 5, 1);
	r.DrawTextEx(
		pico8Font,
		`Music Demo`,
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
r.UnloadMusicStream(titleScreenMusic); // Unload music stream buffers from RAM

r.CloseAudioDevice(); // Close audio device (music streaming is automatically stopped)

r.UnloadRenderTexture(renderTexture);

r.CloseWindow();
