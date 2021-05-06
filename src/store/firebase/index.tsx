import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/firestore';
import 'firebase/analytics';
import { createFirestoreInstance } from 'redux-firestore';
import { ReactReduxFirebaseProviderProps } from 'react-redux-firebase';
import { Store } from 'redux';
import { FirebaseObjects } from './types';

const firebaseConfig = {
	apiKey: process.env.REACT_APP_API_KEY,
	authDomain: process.env.REACT_APP_AUTH_DOMAIN,
	databaseURL: process.env.REACT_APP_DATABASE_URL,
	projectId: process.env.REACT_APP_PROJECT_ID,
	storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
	messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
	appId: process.env.REACT_APP_APP_ID,
	measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

// Initialize firebase instance
firebase.initializeApp(firebaseConfig);

// Initialize other services on firebase instance
firebase.firestore();
firebase.analytics();

const reactReduxFirebaseConfig: ReactReduxFirebaseProviderProps['config'] = {
	userProfile: 'users',
	// profileParamsToPopulate: [
	// 	{ child: 'role', root: 'roles' }, // populates user's role with matching role object from roles
	// ],
	// Add "User" role to the user on signUp
	profileFactory: user => {
		if (!user) {
			// TODO: double check this
			throw new Error('Error creating the user, the user was not found');
		}
		// const _user = user?.user || user;
		const profile: FirebaseObjects.Generic = {
			email: user.email || user.providerData[0]?.email || null,
			roles: ['User'],
		};
		if (user.providerData && user.providerData.length) {
			profile.providerData = user.providerData;
		}
		return profile;
	},
};

const getReactReduxFirebaseProps = (store: Store) => ({
	firebase,
	config: reactReduxFirebaseConfig,
	dispatch: store.dispatch,
	createFirestoreInstance,
});

export { firebaseConfig, reactReduxFirebaseConfig, getReactReduxFirebaseProps };
