import { Grid } from '@material-ui/core';
import ContainerWithCenteredItems from 'components/ContainerWithCenteredItems';
import TooltipButton from 'components/TooltipButton';
import Spacer from 'components/Spacer';
import { FormProps } from './Form';

interface Props
	extends Omit<React.HTMLAttributes<HTMLFormElement>, 'onSubmit'>,
		Pick<FormProps<any>, 'onSubmit' | 'submitText'> {
	doubleSubmit?: boolean;
}

const FormContainer: React.FC<Props> = ({
	onSubmit,
	submitText,
	children,
	doubleSubmit = false,
	...rest
}) => {
	const submitButton = (
		<ContainerWithCenteredItems container>
			<Grid container justify="center" item xs={12} sm={8} md={6}>
				<TooltipButton
					text={submitText}
					type="submit"
					fullWidth
					bg="primary"
					variant="contained"
				/>
			</Grid>
		</ContainerWithCenteredItems>
	);
	return (
		<form onSubmit={onSubmit} noValidate autoComplete="off" {...rest}>
			{doubleSubmit && (
				<>
					<Spacer spacing="3" />
					{submitButton}
					<Spacer spacing="4" />
				</>
			)}
			<Spacer spacing="2" />
			{children}
			<Spacer spacing="2" />
			{submitButton}
		</form>
	);
};

export type { Props as FormContainerProps };
export default FormContainer;
