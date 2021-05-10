import { useEffect, useRef } from 'react';

type Callback = () => void;

/**
 * setInterval hook.
 *
 * @see https://overreacted.io/making-setinterval-declarative-with-react-hooks/#just-show-me-the-code
 *
 * @param callback Method to call in each interval.
 * @param delay Delay for interval (in milliseconds).
 *
 * @returns stopper for the interval
 */
const useInterval = (callback: Callback, delay: number) => {
	const savedCallback = useRef<Callback>();
	const id = useRef<NodeJS.Timeout>();

	// Remember the latest callback.
	useEffect(() => {
		savedCallback.current = callback;
	}, [callback]);

	const clearLastInterval = () => {
		clearInterval(id.current as NodeJS.Timeout);
	};

	// Set up the interval.
	useEffect(() => {
		const tick = () => {
			savedCallback.current?.();
		};

		id.current = setInterval(tick, delay);
		return () => clearLastInterval();
	}, [delay]);

	return clearLastInterval;
};

export default useInterval;
