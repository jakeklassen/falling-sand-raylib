type Vector2d = {
	x: number;
	y: number;
};

type Transform = {
	position: Vector2d;
	scale: Vector2d;
	rotation: number;
};

export type Entity = {
	direction?: Vector2d;
	star?: {
		color: string;
	};
	transform?: Transform;
	velocity?: Vector2d;
};
