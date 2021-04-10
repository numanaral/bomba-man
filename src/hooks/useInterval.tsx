import { useEffect, useRef } from 'react';

type Callback = () => void;

/**
 * setInterval hook.
 *
 * @see https://overreacted.io/making-setinterval-declarative-with-react-hooks/#just-show-me-the-code
 *
 * @param callback Method to call in each interval.
 * @param delay Delay for interval.
 */
const useInterval = (callback: Callback, delay: number) => {
	const savedCallback = useRef<Callback>();

	// Remember the latest callback.
	useEffect(() => {
		savedCallback.current = callback;
	}, [callback]);

	// Set up the interval.
	useEffect(() => {
		const tick = () => {
			savedCallback.current?.();
		};

		const id = setInterval(tick, delay);
		return () => clearInterval(id);
	}, [delay]);
};

export default useInterval;
