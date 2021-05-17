import { useEffect, useRef } from 'react';

const useIsUnmounted = () => {
	const isMounted = useRef(true);

	useEffect(() => {
		return () => {
			isMounted.current = false;
		};
	}, []);

	return isMounted;
};

export default useIsUnmounted;
