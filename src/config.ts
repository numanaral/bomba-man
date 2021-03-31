const config = {
	size: {
		game: 15 as RangeOf<15>, // squares
		character: 32, // px
		tile: 32, // px
		movement: 32, // px
		collisionMin: 1,
		collisionMax: 1,
	},
	duration: {
		movement: 300, // ms
	},
};

config.size.collisionMin = Math.floor(
	(config.size.game * config.size.game) / 3
);
config.size.collisionMax = Math.floor(
	(config.size.game * config.size.game) / 2
);

export default config;
