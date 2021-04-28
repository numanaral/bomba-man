import config from 'config';
import theme from 'theme';
import { PowerUp } from 'enums';
import { getPoweredUpValue, isPlayerSteppingOnFire } from 'utils/game';
import Bomb from './components/Bomb';
import Character from './components/Character';
import { PlayerId, PlayerConfig, GameApi } from './types';
import DeadCharacter from './components/DeadCharacter';

type PlayerEntry = Array<[PlayerId, PlayerConfig]>;

interface Props extends GameApi {}

const GameContent = ({ state, provider }: Props) => {
	const { triggerExplosion, onExplosionComplete } = provider;
	const { gameMap, players, bombs, is3D } = state;

	return (
		<>
			{(Object.entries(players) as PlayerEntry).map(
				([playerId, playerConfig]) => {
					// TODO: Put this in the store
					const {
						[playerId]: keyboardConfig,
					} = config.keyboardConfig.player;
					const { coordinates, state: playerState } = playerConfig;

					const { deathCount } = playerState;

					const isAlive =
						deathCount <
						getPoweredUpValue(playerState, PowerUp.Life);

					const isSteppingOnFire = isPlayerSteppingOnFire(
						gameMap,
						coordinates
					);

					return (
						(isAlive && (
							<Character
								id={playerId}
								key={playerId}
								name="Bomber"
								coordinates={coordinates!}
								keyboardConfig={keyboardConfig}
								is3D={is3D}
								highlight={isSteppingOnFire}
							/>
						)) || (
							<DeadCharacter
								key={playerId}
								coordinates={coordinates!}
							/>
						)
					);
				}
			)}
			{bombs.map(({ id, playerId, ...bombProps }) => {
				const playerState = players[playerId]!.state;
				const explosionSize = getPoweredUpValue(
					playerState,
					PowerUp.BombSize
				);

				return (
					<Bomb
						key={id}
						id={id}
						playerId={playerId}
						{...bombProps}
						color={theme.palette.color.error}
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
