const config = {
	size: {
		game: 15 as RangeOf<15>, // squares
		character: 32, // px
		tile: 32, // px
		movement: 32, // px
		collisionMin: 1, // squares
		collisionMax: 1, // squares
		bomb: 16, // px
		explosion: 1, // square
	},
	duration: {
		movement: 300, // ms
		bomb: {
			firing: 2, // second
			exploding: 2, // second
		},
	},
};

config.size.collisionMin = Math.floor(
	(config.size.game * config.size.game) / 3
);
config.size.collisionMax = Math.floor(
	(config.size.game * config.size.game) / 2
);

export default config;
