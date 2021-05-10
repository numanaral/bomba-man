import { PowerUp } from 'enums';
import * as yup from 'yup';

const configSchema = yup.object().shape({
	powerUps: yup.object().shape({
		chance: yup.number().integer().min(1).max(5).required(),
		defaults: yup.object().shape({
			[PowerUp.Life]: yup.number().integer().min(1).max(5).required(),
			[PowerUp.BombCount]: yup
				.number()
				.integer()
				.min(1)
				.max(5)
				.required(),
			[PowerUp.BombSize]: yup.number().integer().min(1).max(5).required(),
			[PowerUp.MovementSpeed]: yup
				.number()
				.integer()
				.oneOf([100, 150, 200]),
		}),
		increaseValues: yup.object().shape({
			[PowerUp.Life]: yup.number().integer().min(1).max(3).required(),
			[PowerUp.BombCount]: yup
				.number()
				.integer()
				.min(1)
				.max(3)
				.required(),
			[PowerUp.BombSize]: yup.number().integer().min(1).max(3).required(),
			[PowerUp.MovementSpeed]: yup
				.number()
				.integer()
				.oneOf([-10, -15, -20, -25, -30]),
		}),
		maxDropCount: yup.object().shape({
			[PowerUp.Life]: yup.number().integer().min(1).max(6).required(),
			[PowerUp.BombCount]: yup
				.number()
				.integer()
				.min(1)
				.max(6)
				.required(),
			[PowerUp.BombSize]: yup.number().integer().min(1).max(6).required(),
			[PowerUp.MovementSpeed]: yup
				.number()
				.integer()
				.min(1)
				.max(6)
				.required(),
		}),
	}),
	tiles: yup.object().shape({
		blockTileChance: yup.number().integer().min(1).max(10).required(),
	}),
	sizes: yup.object().shape({
		map: yup.number().integer().min(6).max(15).required(),
		character: yup.number().integer().oneOf([32, 48, 64]).required(),
		tile: yup.number().integer().oneOf([32, 48, 64]).required(),
		movement: yup.number().integer().oneOf([32, 48, 64]).required(),
	}),
	duration: yup.object().shape({
		bomb: yup.object().shape({
			firing: yup.number().oneOf([1.5, 2.5, 1, 2, 3]).required(),
			exploding: yup.number().oneOf([0.5, 1, 1.5]).required(),
		}),
	}),
});

export { configSchema };
