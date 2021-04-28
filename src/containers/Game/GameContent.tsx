import config from 'config';
import { PowerUp } from 'enums';
import usePrevious from 'hooks/usePrevious';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import useGameProvider from 'store/redux/hooks/useGameProvider';
import {
	makeSelectGameBombs,
	makeSelectGameIs3D,
	makeSelectGameMap,
	makeSelectGamePlayers,
} from 'store/redux/reducers/game/selectors';
import theme from 'theme';
import { getPoweredUpValue, isPlayerSteppingOnFire } from 'utils/game';
import Bomb from './components/Bomb';
import Character from './components/Character';
import DeadCharacter from './components/DeadCharacter';
import { PlayerConfig, PlayerId } from './types';

type PlayerEntry = Array<[PlayerId, PlayerConfig]>;

const GameContent = () => {
	const { setPlayerRef } = useGameProvider();
	const gameMap = useSelector(makeSelectGameMap());
	const players = useSelector(makeSelectGamePlayers());
	const bombs = useSelector(makeSelectGameBombs());
	const is3D = useSelector(makeSelectGameIs3D());
	const previousIs3D = usePrevious(is3D);

	const { triggerExplosion, onExplosionComplete } = useGameProvider();

	const refFunc = useCallback(
		({ id: playerId, ref }: PlayerConfig) => (newRef: any) => {
			// if we already have a ref, don't try setting it again
			if (previousIs3D === is3D && ref) return;
			setPlayerRef({
				playerId,
				newRef,
			});
		},
		[is3D, previousIs3D, setPlayerRef]
	);

	return (
		<>
			{(Object.entries(players) as PlayerEntry).map(
				([playerId, playerConfig]) => {
					// TODO: Put this in the store
					const {
						[playerId]: keyboardConfig,
					} = config.keyboardConfig.player;
					const { coordinates, state } = playerConfig;

					const { deathCount } = state;

					const isAlive =
						deathCount < getPoweredUpValue(state, PowerUp.Life);

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
								ref={refFunc(playerConfig)}
							/>
						)) || <DeadCharacter coordinates={coordinates!} />
					);
				}
			)}
			{bombs.map(({ id, playerId, ...bombProps }) => {
				console.log(playerId);
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

export default GameContent;
