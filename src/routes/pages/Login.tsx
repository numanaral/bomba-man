interface Props {
	authorizing: boolean;
}

const Login = ({ authorizing }: Props) => {
	return (
		<div>
			Login
			{authorizing}
		</div>
	);
};

export type { Props as LoginProps };
export default Login;
