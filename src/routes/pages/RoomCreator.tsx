import { RoomType } from 'enums';

interface Props {
	roomType: RoomType;
}

const RoomCreator = ({ roomType }: Props) => {
	// grab game state and updater function
	// setup the game
	return <div>{roomType}</div>;
};

export default RoomCreator;
