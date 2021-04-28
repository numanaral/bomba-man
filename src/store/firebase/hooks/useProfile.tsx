import { useSelector } from 'react-redux';
import { useFirebase } from 'react-redux-firebase';
import { makeSelectProfile } from 'store/redux/reducers/firebase/selectors';
import { FirebaseProfile } from '../types';
// TODO: notification-provider
// import useNotificationProvider from 'store/redux/hooks/useNotificationProvider';

const useProfile = () => {
	const { isLoaded, isEmpty, ...profile } = useSelector(makeSelectProfile());
	// const { notifySuccess, notifyError } = useNotificationProvider();
	const firebase = useFirebase();

	const updateProfile = async (props: FirebaseProfile) => {
		try {
			await firebase.updateProfile({ ...props });
			// notifySuccess('Profile has been updated successfully!');
		} catch (err) {
			// notifyError(err);
		}
	};

	// const updateProp = (prop: FirebaseProfile['prop']) => {
	// 	updateProfile({ prop });
	// };

	const isAuthorizing = !isLoaded;
	const roles = profile.roles || [];

	return {
		isAuthorizing,
		roles,
		profile,
		updateProfile,
		// updateProp,
	};
};

export default useProfile;
