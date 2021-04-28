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
type FirebaseGenericObject = Record<string, any>;
type FirebaseObjectKeys = Array<string>;
// TODO: Once we have react-router and auth/roles setup, update this

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

export type { FirebaseObjects, FirebaseSchema };
