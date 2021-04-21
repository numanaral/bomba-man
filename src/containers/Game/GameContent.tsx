import { useSelector } from 'react-redux';
import config from 'config';
import {
	makeSelectGameBombs,
	makeSelectGameIs3D,
	makeSelectGamePlayers,
} from 'store/redux/reducers/game/selectors';
import useGameProvider from 'store/redux/hooks/useGameProvider';
import Bomb from './components/Bomb';
import Character from './components/Character';
import { PlayerId, PlayerConfig } from './types';

type PlayerEntry = Array<[PlayerId, PlayerConfig]>;

const GameContent = () => {
	const { setPlayerRef } = useGameProvider();
	const players = useSelector(makeSelectGamePlayers());
	const bombs = useSelector(makeSelectGameBombs());
	const is3D = useSelector(makeSelectGameIs3D());

	const { onExplosion } = useGameProvider();

	const refFunc = ({ id: playerId }: PlayerConfig) => (newRef: any) => {
		setPlayerRef({
			playerId,
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
					is3D={is3D}
				/>
			))}
		</>
	);
};

export default GameContent;
