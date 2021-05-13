import { GameType, PowerUp } from 'enums';
import * as yup from 'yup';
import { Config } from './types';

const getConfigSchema = (gameType: GameType) =>
	yup.object().shape({
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
				[PowerUp.BombSize]: yup
					.number()
					.integer()
					.min(1)
					.max(5)
					.required(),
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
				[PowerUp.BombSize]: yup
					.number()
					.integer()
					.min(1)
					.max(3)
					.required(),
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
				[PowerUp.BombSize]: yup
					.number()
					.integer()
					.min(1)
					.max(6)
					.required(),
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
		players: yup.object().shape({
			humanPlayers: yup
				.mixed()
				/** Lifesaver @see https://github.com/jquense/yup/issues/735#issuecomment-574260390 */
				.test((_: number, context: yup.TestContext) => {
					const { createError, path, parent } = context;
					const {
						humanPlayers,
						npcPlayers,
					} = parent as Config['players'];
					if (gameType === GameType.Local) {
						if (humanPlayers! + npcPlayers > 4) {
							/** @see https://github.com/jquense/yup/issues/222#issuecomment-557457026 */
							return createError({
								message: `You cannot have more than 4 players`,
								path,
							});
						}
						if (humanPlayers! + npcPlayers < 2) {
							return createError({
								message: `You need at least 2 Players (i.e. 2 Human Players or 1 Human Player & 1 NPC)`,
								path,
							});
						}
						if (humanPlayers! > 2) {
							return createError({
								message: `You cannot have more than 2 Human Players in a Local Game`,
								path,
							});
						}
						if (humanPlayers! < 1) {
							return createError({
								message: `You need at least 1 Human Player`,
								path,
							});
						}
						return true;
					}

					return true;
				}),
			// this breaks online, add it manually under sections.tsx
			// .required(),
			npcPlayers: yup
				.mixed()
				.test((_: number, context: yup.TestContext) => {
					const { createError, path, parent } = context;
					const {
						humanPlayers,
						npcPlayers,
					} = parent as Config['players'];

					if (humanPlayers && humanPlayers + npcPlayers > 4) {
						return createError({
							message: `You cannot have more than 4 players`,
							path,
						});
					}
					if (gameType === GameType.Online) {
						// in the online mode, we do not have a limiter for player
						if (npcPlayers > 2) {
							return createError({
								message: `You cannot have more than 2 NPCs in an Online Game (Pick a local game if you want to do 1 Human Player vs 3 NPC)`,
								path,
							});
						}
					}
					return true;
				})
				.required(),
		}),
	});

export { getConfigSchema };
