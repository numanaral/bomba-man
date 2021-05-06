import { useFirebase } from 'react-redux-firebase';
// TODO: notification-provider
// import useNotificationProvider from 'store/redux/hooks/useNotificationProvider';

const useLogin = () => {
	const firebase = useFirebase();
	// const { notifySuccess, notifyError } = useNotificationProvider();

	const logOut = () => {
		firebase.logout();
	};

	const googleLogin = () => {
		firebase.login({ provider: 'google', type: 'popup' });
		// .then(notifySuccess)
		// .catch(notifyError);
	};

	const githubLogin = () => {
		firebase.login({ provider: 'github', type: 'popup' });
		// .then(notifySuccess)
		// .catch(notifyError);
	};

	const emailLogin = (
		credentials: Parameters<typeof firebase.login>['0']
	) => {
		firebase.login(credentials);
		// .then(notifySuccess)
		// .catch(notifyError);
	};

	const emailSignUp = (
		credentials: Parameters<typeof firebase.createUser>['0']
	) => {
		firebase.createUser(credentials);
		// .then(notifySuccess)
		// .catch(notifyError);
	};

	return {
		googleLogin,
		githubLogin,
		emailLogin,
		emailSignUp,
		logOut,
	};
};

export default useLogin;
