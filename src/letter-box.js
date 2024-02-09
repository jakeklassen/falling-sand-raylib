import { fileURLToPath } from "node:url";
import r from "raylib";

const GAME_WIDTH = 128;
const GAME_HEIGHT = 128;

const screenWidth = GAME_WIDTH * 4;
const screenHeight = GAME_HEIGHT * 4;

// Found it was smoother to disable vsync
// r.SetConfigFlags(r.FLAG_VSYNC_HINT);
// r.SetConfigFlags(r.FLAG_WINDOW_UNDECORATED);
r.SetTargetFPS(60);
r.InitWindow(screenWidth, screenHeight, "raylib letter box");

const playerTextureUrl = fileURLToPath(
	new URL("../assets/image/player-ship.png", import.meta.url)
);

const pico8FontUrl = fileURLToPath(
	new URL("../assets/font/pico-8.ttf", import.meta.url)
);

// Not sure why, but this seems needed for this font to render properly
const pico8Font = r.LoadFontEx(pico8FontUrl, 5, 0, 0);

const playerTexture = r.LoadTexture(playerTextureUrl);

const display = r.GetCurrentMonitor();

/**
 * We render to a texture that represent that _actual_ game size.
 * This texture will get scaled to the window size.
 */
const renderTexture = r.LoadRenderTexture(GAME_WIDTH, GAME_HEIGHT);

const input = {
	left: false,
	right: false,
	up: false,
	down: false,
};

const player1 = {
	sprite: playerTexture,
	boxCollider: {
		offsetX: 0,
		offsetY: 0,
		width: playerTexture.width,
		height: playerTexture.height,
	},
	x: Math.floor(GAME_WIDTH / 2 - playerTexture.width / 2),
	y: Math.floor(GAME_HEIGHT / 2 - playerTexture.height / 2) - 8,
	dx: 0,
	dy: 0,
	vx: 60,
	vy: 60,
};

const player2 = {
	sprite: playerTexture,
	boxCollider: {
		offsetX: 0,
		offsetY: 0,
		width: playerTexture.width,
		height: playerTexture.height,
	},
	x: Math.floor(GAME_WIDTH / 2 - playerTexture.width / 2),
	y: Math.floor(GAME_HEIGHT / 2 - playerTexture.height / 2) + 8,
	dx: 0,
	dy: 0,
	vx: 60,
	vy: 60,
};

const players = [player1, player2];

const TARGET_FPS = 60;
const STEP = 1 / TARGET_FPS;
const dt = STEP;
let variableDt = 0;
let deltaTimeAccumulator = 0;

while (!r.WindowShouldClose()) {
	r.SetWindowTitle(`raylib [FPS: ${r.GetFPS()}]`);

	deltaTimeAccumulator += r.GetFrameTime();
	variableDt = r.GetFrameTime();

	input.left = r.IsKeyDown(r.KEY_LEFT);
	input.right = r.IsKeyDown(r.KEY_RIGHT);
	input.up = r.IsKeyDown(r.KEY_UP);
	input.down = r.IsKeyDown(r.KEY_DOWN);

	while (deltaTimeAccumulator >= STEP) {
		deltaTimeAccumulator -= STEP;
	}

	for (const player of players) {
		player.dx = 0;
		player.dy = 0;

		if (input.left) {
			player.dx = -1;
		} else if (input.right) {
			player.dx = 1;
		}

		if (input.up) {
			player.dy = -1;
		} else if (input.down) {
			player.dy = 1;
		}

		player.x += player.dx * player.vx * variableDt;
		player.y += player.dy * player.vy * variableDt;

		if (player.x < 0) {
			player.x = 0;
			player.dx = 1;
		} else if (player.x > GAME_WIDTH - player.boxCollider.width) {
			player.x = GAME_WIDTH - player.boxCollider.width;
			player.dx = -1;
		}

		if (player.y < 0) {
			player.y = 0;
			player.dy = 1;
		} else if (player.y > GAME_HEIGHT - player.boxCollider.height) {
			player.y = GAME_HEIGHT - player.boxCollider.height;
			player.dy = -1;
		}
	}

	// -------------------------------------------------------------------------
	// Render to texture
	// -------------------------------------------------------------------------

	r.BeginTextureMode(renderTexture);

	r.ClearBackground(r.BLACK);

	r.DrawTexture(player1.sprite, player1.x | 0, player1.y | 0, r.WHITE);
	r.DrawTexture(player2.sprite, player2.x | 0, player2.y | 0, r.WHITE);

	r.DrawCircle(GAME_WIDTH / 2, GAME_HEIGHT / 2, 4, r.WHITE);

	const textMetrics = r.MeasureTextEx(pico8Font, `Movement Demo`, 5, 1);
	r.DrawTextEx(
		pico8Font,
		`Movement Demo`,
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
