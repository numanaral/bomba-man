import firebase from 'firebase/app';
import { useEffect } from 'react';
// TODO: react-router
// import { useLocation } from 'react-router-dom';
import useAnalytics from './useAnalytics';

const usePageView = () => {
	// TODO: react-router
	// const { pathname } = useLocation();
	const { pathname } = window.location;
	const { isAnalyticsEnabled } = useAnalytics();

	useEffect(() => {
		if (!isAnalyticsEnabled) return;

		firebase.analytics().logEvent('page-view', { path_name: pathname });
	}, [isAnalyticsEnabled, pathname]);
};

export default usePageView;
