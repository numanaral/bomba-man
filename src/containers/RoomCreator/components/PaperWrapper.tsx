import { Box, Paper, PaperProps } from '@material-ui/core';
import theme from 'theme';

const PaperWrapper: React.FC<PaperProps & { isMain?: boolean }> = ({
	children,
	isMain = false,
	...props
}) => {
	return (
		<Paper
			{...props}
			style={{
				backgroundColor:
					theme.palette.background[
						`primary-${isMain ? 'darker' : 'lighter'}` as KeysOf<
							typeof theme.palette.background
						>
					],
				width: '100%',
				...props.style,
			}}
		>
			<Box p={3}>{children}</Box>
		</Paper>
	);
};

export default PaperWrapper;
