import { GameState } from 'store/redux/reducers/game/types';
// eslint-disable-next-line import/no-unresolved
import { DataSnapshot } from '@firebase/database-types';

namespace FirebaseObjects {
	export type Sortable = {
		updatedOn: {
			seconds: number;
			[key: string]: any;
		};
		[key: string]: any;
	};

	export type Generic = Record<string, any>;
}

namespace FirebaseUtils {
	export type OverridableType<
		Default,
		Override = void
	> = Override extends void ? Default : Override;

	export type UpdateableValue = string | number | boolean | object;
	export type OverridableValue = UpdateableValue | void;

	export type RefSubPath = `/${string}`;

	export type PromiseCallback = {
		onSuccess?: (data: DataSnapshot) => void;
		onError?: (err: Error) => void;
	};

	export type DataSnapshotPromise = Promise<DataSnapshot | Error>;
	/** @see https://github.com/Microsoft/TypeScript/issues/12776#issuecomment-265885846 */
	export const DataSnapshotPromise = Promise;

	export type CreateOrUpdateProps<RootSchema, OverrideSchema> = [
		newProps: Partial<OverridableType<RootSchema, OverrideSchema>>,
		subPath?: RefSubPath,
		cb?: PromiseCallback
	];

	export type CreateProps<RootSchema, OverrideSchema> = CreateOrUpdateProps<
		RootSchema,
		OverrideSchema
	>;

	export type ReadProps<RootSchema, OverrideSchema> = [
		state: OverridableType<RootSchema, OverrideSchema>
	];

	export type UpdateProps<RootSchema, OverrideSchema> = CreateOrUpdateProps<
		RootSchema,
		OverrideSchema
	>;

	export type RemoveProps = [subPath?: RefSubPath, cb?: PromiseCallback];
}

namespace FirebaseSchema {
	// TODO: Once we have react-router and auth/roles setup, update this
	export type FirebaseProfile = {
		roles: Array<string>;
	};

	export type FirebaseSchema = {
		online: GameState;
	};

	// TODO: Once we have are collecting data, update this
	export type FirestoreSchema = FirebaseObjects.Generic;
}

export type { FirebaseObjects, FirebaseUtils, FirebaseSchema };
