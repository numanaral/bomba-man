import config from 'config';
import { PowerUp } from 'enums';
import usePrevious from 'hooks/usePrevious';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import useGameProvider from 'store/redux/hooks/useGameProvider';
import {
	makeSelectGameBombs,
	makeSelectGameIs3D,
	makeSelectGamePlayers,
} from 'store/redux/reducers/game/selectors';
import theme from 'theme';
import { getPoweredUpValue } from 'utils/game';
import Bomb from './components/Bomb';
import Character from './components/Character';
import { PlayerConfig, PlayerId } from './types';

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
