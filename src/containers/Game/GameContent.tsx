import { useSelector } from 'react-redux';
import config from 'config';
import {
	makeSelectGameBombs,
	makeSelectGameIs3D,
	makeSelectGamePlayers,
} from 'store/redux/reducers/game/selectors';
import useGameProvider from 'store/redux/hooks/useGameProvider';
import theme from 'theme';
import { useCallback } from 'react';
import usePrevious from 'hooks/usePrevious';
import { PowerUp } from 'enums';
import Bomb from './components/Bomb';
import Character from './components/Character';
import { PlayerId, PlayerConfig } from './types';

type PlayerEntry = Array<[PlayerId, PlayerConfig]>;

const GameContent = () => {
	const { setPlayerRef } = useGameProvider();
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
					return (
						<Character
							id={playerId}
							key={playerId}
							name="Bomber"
							coordinates={playerConfig.coordinates!}
							keyboardConfig={keyboardConfig}
							is3D={is3D}
							ref={refFunc(playerConfig)}
						/>
					);
				}
			)}
			{bombs.map(({ id, playerId, ...bombProps }) => {
				const playerState = players[playerId]!.state;
				const defaultBombSize = playerState.bombSize;
				const powerUpBombSize = playerState.powerUps[PowerUp.BombSize];
				const explosionSize = defaultBombSize + powerUpBombSize;

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
