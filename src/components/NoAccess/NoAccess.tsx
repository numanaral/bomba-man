import Container from 'components/Container';

const NoAccess: React.FC = ({ children }) => (
	<Container>
		<h1 style={{ color: 'white' }}>
			Either the game is not found or you don&apos;t have access to it.
		</h1>
		{children}
	</Container>
);

export default NoAccess;
