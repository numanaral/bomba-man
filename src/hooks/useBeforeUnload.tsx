import { useEffect } from 'react';

const noop = () => null;
type UseBeforeLoadCb = (this: Window, ev: BeforeUnloadEvent) => any;

const useBeforeUnload = (
	onBeforeUnload: UseBeforeLoadCb,
	onUnload: UseBeforeLoadCb = noop
) => {
	useEffect(() => {
		window.addEventListener('beforeunload', onBeforeUnload);
		window.addEventListener('unload', onUnload);
		return () => {
			window.removeEventListener('beforeunload', onBeforeUnload);
			window.removeEventListener('unload', onUnload);
		};
	});
};

export default useBeforeUnload;
