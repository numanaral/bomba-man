enum Direction {
	UP = 'Up',
	RIGHT = 'Right',
	DOWN = 'Down',
	LEFT = 'Left',
}

enum Axis {
	X = 'X',
	Y = 'Y',
}

enum ExplosionState {
	Firing = 'Firing',
	Exploding = 'Exploding',
	Exploded = 'Exploded',
}

enum Player {
	P1 = 'P1',
	P2 = 'P2',
	P3 = 'P3',
	P4 = 'P4',
	// Npc1 = 'P3',
	// Npc2 = 'P4',
	// Npc3 = 'P5',
}

enum Tile {
	Empty = 'T1',
	Breaking = 'T2',
	NonBreaking = 'T3',
}

enum PowerUp {
	Life = 'PU1',
	BombCount = 'PU2',
	BombSize = 'PU3',
	MovementSpeed = 'PU4',
}

enum Explosive {
	Bomb = 'B',
	FireCore = 'FC',
	FireHorizontal = 'FH',
	FireVertical = 'FV',
}

const FIRE_VALUES = Object.values(Explosive).filter(v => v !== Explosive.Bomb);

export {
	Direction,
	Axis,
	ExplosionState,
	Player,
	Tile,
	PowerUp,
	Explosive,
	FIRE_VALUES,
};
