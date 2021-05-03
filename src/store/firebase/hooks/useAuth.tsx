import { useSelector } from 'react-redux';
import { makeSelectAuth } from 'store/redux/reducers/firebase/selectors';

const useAuth = () => {
	const { isLoaded, isEmpty, ...user } = useSelector(makeSelectAuth());

	const isAuthorizing = !isLoaded;
	const isLoggedIn =
		!isAuthorizing && !isEmpty && (user.displayName || user.email);
	const userId = user.uid || '';

	return { isAuthorizing, isLoggedIn, user, userId };
};

export default useAuth;
