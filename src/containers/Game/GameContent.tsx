import { useSelector } from 'react-redux';
import config from 'config';
import {
	makeSelectGameBombs,
	makeSelectGameIs3D,
	makeSelectGamePlayers,
} from 'store/redux/reducers/game/selectors';
import useGameProvider from 'store/redux/hooks/useGameProvider';
import Bomb from './Bomb';
import Character from './Character';
import { PlayerId, PlayerConfig } from './types';

type PlayerEntry = Array<[PlayerId, PlayerConfig]>;

const GameContent = () => {
	const { setPlayerRef } = useGameProvider();
	const players = useSelector(makeSelectGamePlayers());
	const bombs = useSelector(makeSelectGameBombs());
	const is3D = useSelector(makeSelectGameIs3D());

	const { onExplosion } = useGameProvider();

	const refFunc = ({ id }: PlayerConfig) => (newRef: any) => {
		// if (ref?.current) return;
		setPlayerRef({
			id,
			newRef,
		});
	};

	return (
		<>
			{(Object.entries(players) as PlayerEntry).map(
				([playerId, playerConfig]) => {
					return (
						<Character
							id={playerId}
							key={playerId}
							name="Bomber"
							coordinates={playerConfig.coordinates!}
							is3D={is3D}
							ref={refFunc(playerConfig)}
							// ref={playerConfig.ref}
						/>
					);
				}
			)}
			{bombs.map(({ id, ...bombProps }) => (
				<Bomb
					key={id}
					id={id}
					{...bombProps}
					color="red"
					explosionSize={config.size.explosion}
					firingDuration={config.duration.bomb.firing}
					explodingDuration={config.duration.bomb.exploding}
					onExplosion={onExplosion}
				/>
			))}
		</>
	);
};

export default GameContent;
