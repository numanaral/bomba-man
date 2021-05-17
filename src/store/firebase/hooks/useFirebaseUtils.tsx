import LoadingIndicator from 'components/LoadingIndicator';
import NoAccess from 'components/NoAccess';
import {
	isEmpty,
	isLoaded,
	useFirebase,
	useFirebaseConnect,
} from 'react-redux-firebase';
import { DataSnapshot, FirebaseUtils } from '../types';
// eslint-disable-next-line import/no-unresolved
// import { fromFirestore } from '../utils';
// TODO: notification-provider
// import useNotificationProvider from 'store/redux/hooks/useNotificationProvider';

const useFirebaseUtils = <RootSchema extends FirebaseUtils.UpdateableValue>(
	baseRefPath: string
) => {
	// const { notifyError } = useNotificationProvider();
	const firebase = useFirebase();
	useFirebaseConnect([baseRefPath]);

	const getPath = (subPath?: FirebaseUtils.RefSubPath) => {
		return `${baseRefPath}${subPath || ''}`;
	};

	/**
	 * @example
	 * ```ts
	 * // Usage 1: Generate random id
	 * const { key: newGameId } = (await create(newProps, subPaths)) as DataSnapshot;
	 *
	 * // Usage 2: Set your own id (fails if exists)
	 * const customId = 'some-id';
	 * await create(newProps, subPaths, undefined, customId);
	 * ```
	 */
	const create = async <
		OverrideSchema extends FirebaseUtils.OverridableValue = void
	>(
		...[newProps, subPaths, cb, key]: FirebaseUtils.CreateProps<
			RootSchema,
			OverrideSchema
		>
	): FirebaseUtils.DataSnapshotPromise => {
		try {
			let dataSnapshot: DataSnapshot;
			// if provided with a key, first check if document exists
			// if it
			if (key) {
				dataSnapshot = await firebase.uniqueSet(
					getPath(`${subPaths || ''}/${key}`),
					{
						...newProps,
					}
				);
			} else {
				dataSnapshot = await firebase.push(getPath(subPaths), newProps);
			}
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

	const push = async <
		OverrideSchema extends FirebaseUtils.OverridableValue = void
	>(
		...[newProps, subPaths, cb]: FirebaseUtils.PushProps<
			RootSchema,
			OverrideSchema
		>
	): FirebaseUtils.DataSnapshotPromise => {
		try {
			const dataSnapshot = await firebase.push(
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
		push,
		remove,
	};
};

export default useFirebaseUtils;
