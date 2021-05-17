import ErrorBoundary from 'components/ErrorBoundary';

interface Props {
	components: Array<React.ComponentType>;
	props: Record<string, any>;
}

const ErrorBoundaryWrapper = ({ components, props }: Props) =>
	components.map((Component, ind) => (
		<ErrorBoundary key={ind}>
			<Component {...props} />
		</ErrorBoundary>
	));

export default ErrorBoundaryWrapper;
