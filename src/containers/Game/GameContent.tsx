import theme from 'theme';
import { PowerUp } from 'enums';
import {
	getPoweredUpValue,
	isPlayerDead,
	isPlayerSteppingOnFire,
} from 'utils/game';
import Bomb from './components/Bomb';
import Character from './components/Character';
import { GameApi, PlayerConfig, PlayerId } from './types';
import DeadCharacter from './components/DeadCharacter';

type PlayerEntry = Array<[PlayerId, PlayerConfig]>;

interface Props extends GameApi {}

const GameContent = ({ state, provider }: Props) => {
	const { triggerExplosion, onExplosionComplete } = provider;
	const { gameMap, players, bombs, is3D, config } = state;

	return (
		<>
			{(Object.entries(players) as PlayerEntry).map(
				([playerId, playerConfig]) => {
					// TODO: Put this in the store
					const {
						[playerId]: keyboardConfig,
					} = config.keyboardConfig;
					const { coordinates, state: playerState } = playerConfig;

					const isAlive = !isPlayerDead(playerState, config.powerUps);
					const isSteppingOnFire = isPlayerSteppingOnFire(
						gameMap,
						coordinates,
						config.sizes.movement
					);

					return (
						(isAlive && (
							<Character
								id={playerId}
								key={playerId}
								name="Bomber"
								size={config.sizes.character}
								tileSize={config.sizes.tile}
								coordinates={coordinates!}
								keyboardConfig={keyboardConfig}
								is3D={is3D}
								highlight={isSteppingOnFire}
							/>
						)) || (
							<DeadCharacter
								key={playerId}
								coordinates={coordinates!}
								size={config.sizes.character}
								explodingDuration={
									config.duration.bomb.exploding
								}
							/>
						)
					);
				}
			)}
			{Object.values(bombs).map(({ id, playerId, ...bombProps }) => {
				const playerState = players[playerId]?.state;
				if (!playerState) return null;

				const explosionSize = getPoweredUpValue(
					playerState,
					PowerUp.BombSize,
					config.powerUps
				);

				return (
					<Bomb
						key={id}
						id={id}
						playerId={playerId}
						{...bombProps}
						color={theme.palette.color.error}
						tileSize={config.sizes.tile}
						explosionSize={explosionSize}
						firingDuration={config.duration.bomb.firing}
						explodingDuration={config.duration.bomb.exploding}
						triggerExplosion={triggerExplosion}
						onExplosionComplete={onExplosionComplete}
						is3D={is3D}
					/>
				);
			})}
		</>
	);
};

export type { Props as GameContentProps };
export default GameContent;
