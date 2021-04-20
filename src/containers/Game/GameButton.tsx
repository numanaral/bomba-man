import Button from 'components/Button';
import { GamePayload } from 'store/redux/reducers/game/types';
import { wrapPreventFocusLock } from 'utils';

interface Props extends Partial<React.ComponentProps<typeof Button>> {
	active?: boolean;
	onClick: ReactOnClick<GamePayload>;
}

const GameButton = ({ active = false, onClick, children, ...rest }: Props) => {
	return (
		<Button
			style={{ width: '100%', wordWrap: 'break-word', marginBottom: 10 }}
			variant={active ? 'success' : 'warning'}
			size="medium"
			onClick={wrapPreventFocusLock(onClick)}
			{...rest}
		>
			{children}
		</Button>
	);
};

export default GameButton;
