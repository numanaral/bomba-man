import theme from 'theme';
import { PowerUp } from 'enums';
import {
	getPoweredUpValue,
	isPlayerDead,
	isPlayerSteppingOnFire,
} from 'utils/game';
import useWatchOnlineGame from 'store/firebase/hooks/useWatchOnlineGame';
import Bomb from './components/Bomb';
import Character from './components/Character';
import { GameApi, OnlineGameId, PlayerConfig, PlayerId } from './types';
import DeadCharacter from './components/DeadCharacter';

type PlayerEntry = Array<[PlayerId, PlayerConfig]>;

interface Props extends GameApi {
	gameId?: OnlineGameId;
}

const GameContent = ({
	state,
	provider,
	playerId: currentOnlinePlayerId,
	gameId,
}: Props) => {
	const {
		triggerExplosion,
		onExplosionComplete,
		updatePlayerIsWalking,
	} = provider;
	const { gameMap, players, bombs, is3D, config } = state;

	const { onPlayerDeath } = useWatchOnlineGame(gameId || '');

	return (
		<>
			{(Object.entries(players) as PlayerEntry).map(
				([playerId, playerConfig]) => {
					const {
						coordinates,
						state: playerState,
						...rest
					} = playerConfig;

					const isAlive = !isPlayerDead(playerState, config.powerUps);
					const isSteppingOnFire = isPlayerSteppingOnFire(
						gameMap,
						coordinates,
						config.sizes.movement
					);

					return (
						(isAlive && (
							<Character
								currentOnlinePlayerId={currentOnlinePlayerId}
								key={playerId}
								name="Bomber"
								size={config.sizes.character}
								tileSize={config.sizes.tile}
								coordinates={coordinates!}
								is3D={is3D}
								highlight={isSteppingOnFire}
								onPlayerIsWalking={updatePlayerIsWalking}
								{...rest}
							/>
						)) || (
							<DeadCharacter
								id={playerId}
								name={playerId}
								key={playerId}
								coordinates={coordinates!}
								size={config.sizes.character}
								explodingDuration={
									config.duration.bomb.exploding
								}
								onDeathAnimationComplete={onPlayerDeath}
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
						currentOnlinePlayerId={currentOnlinePlayerId}
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
