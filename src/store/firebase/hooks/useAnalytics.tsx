import useLocalStorage from 'hooks/useLocalStorage';

const IS_ANALYTICS_ENABLED_LOCAL_STORAGE_KEY = 'is-analytics-enabled';
const useAnalytics = () => {
	const [isAnalyticsEnabled, setIsAnalyticsEnabled] = useLocalStorage(
		IS_ANALYTICS_ENABLED_LOCAL_STORAGE_KEY,
		true
	);

	const toggleAnalyticsSetting = () => {
		setIsAnalyticsEnabled(v => !v);
	};

	return { isAnalyticsEnabled, toggleAnalyticsSetting };
};

export default useAnalytics;
