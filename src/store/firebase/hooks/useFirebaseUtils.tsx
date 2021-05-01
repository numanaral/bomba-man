import {
	isEmpty,
	isLoaded,
	useFirebase,
	useFirebaseConnect,
} from 'react-redux-firebase';
import { FirebaseUtils } from '../types';
// eslint-disable-next-line import/no-unresolved
// import { fromFirestore } from '../utils';
// TODO: notification-provider
// import useNotificationProvider from 'store/redux/hooks/useNotificationProvider';

const LoadingIndicator = () => <h1>Loading...</h1>;
const NoAccess = () => <h1>No Access</h1>;

const useFirebaseUtils = <RootSchema extends FirebaseUtils.UpdateableValue>(
	baseRefPath: string
) => {
	// const { notifyError } = useNotificationProvider();
	const firebase = useFirebase();
	useFirebaseConnect([baseRefPath]);

	const getPath = (subPath?: FirebaseUtils.RefSubPath) => {
		return `${baseRefPath}${subPath || ''}`;
	};

	const create = async <
		OverrideSchema extends FirebaseUtils.OverridableValue = void
	>(
		...[newProps, subPaths, cb]: FirebaseUtils.CreateProps<
			RootSchema,
			OverrideSchema
		>
	): FirebaseUtils.DataSnapshotPromise => {
		try {
			const dataSnapshot = await firebase.set(
				getPath(subPaths),
				newProps
			);
			cb?.onSuccess?.(dataSnapshot);

			return dataSnapshot;
		} catch (err) {
			if (cb?.onError) cb.onError(err);
			// else notifyError(err);
			return err;
		}
	};

	const read = <OverrideSchema extends FirebaseUtils.OverridableValue = void>(
		...[state]: FirebaseUtils.ReadProps<RootSchema, OverrideSchema>
	) => {
		const pending = !isLoaded(state) && <LoadingIndicator />;
		const error = isEmpty(state) && <NoAccess />;
		return {
			state,
			pending,
			error,
		};
	};

	const update = async <
		OverrideSchema extends FirebaseUtils.OverridableValue = void
	>(
		...[newProps, subPaths, cb]: FirebaseUtils.UpdateProps<
			RootSchema,
			OverrideSchema
		>
	): FirebaseUtils.DataSnapshotPromise => {
		try {
			const dataSnapshot = await firebase.update(
				getPath(subPaths),
				newProps
			);
			cb?.onSuccess?.(dataSnapshot);
			return dataSnapshot;
		} catch (err) {
			if (cb?.onError) cb.onError(err);
			// else notifyError(err);
			return err;
		}
	};

	const remove = async (
		...[subPaths, cb]: FirebaseUtils.RemoveProps
	): FirebaseUtils.DataSnapshotPromise => {
		try {
			const dataSnapshot = await firebase.remove(getPath(subPaths));
			cb?.onSuccess?.(dataSnapshot);
			return dataSnapshot;
		} catch (err) {
			if (cb?.onError) cb.onError(err);
			// else notifyError(err);
			return err;
		}
	};

	return {
		create,
		read,
		update,
		remove,
	};
};

export default useFirebaseUtils;
