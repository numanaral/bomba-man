import React from 'react';

interface Props extends React.FC {
	title?: string;
}

interface State {
	hasError: boolean;
	error: {
		title: string;
		message: string;
	};
}

/**
 * Catches errors on children and displays error information
 * instead of breaking the entire app
 *
 */
class ErrorBoundary extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			hasError: false,
			error: {
				title: props.title || 'Error in the module.',
				message: '',
			},
		};
	}

	static getDerivedStateFromError(/* error */) {
		// Update state so the next render will show the fallback UI.
		return { hasError: true };
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		// You can also log the error to an error reporting service
		this.setState(prevState => {
			return {
				...prevState,
				error: {
					...prevState.error,
					message: error.message || errorInfo.componentStack || '',
				},
			};
		});
	}

	render() {
		const { hasError, error } = this.state;
		const { title, message } = error;
		const { children } = this.props;

		return (
			(hasError && (
				<div style={{ padding: 20, color: 'white' }}>
					<h1> {title} </h1>
					<pre> {message} </pre>
				</div>
			)) ||
			children
		);
	}
}

export default ErrorBoundary;
