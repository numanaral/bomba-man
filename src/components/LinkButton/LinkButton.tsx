import Button, { ButtonProps } from 'components/Button';
import { useHistory } from 'react-router-dom';
// import { BASE_PATH } from 'routes/constants';

interface Props extends ButtonProps {
	to: string;
}

const LinkButton = ({ to, children, ...rest }: Props) => {
	const { push } = useHistory();
	const onClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.preventDefault();
		push(to);
	};

	return (
		<Button type="button" variant="info" onClick={onClick} {...rest}>
			{children}
		</Button>
	);
};

export default LinkButton;
