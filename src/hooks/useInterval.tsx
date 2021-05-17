import { useCallback, useEffect, useRef } from 'react';

type Callback = () => void;

/**
 * setInterval hook.
 *
 * @see https://overreacted.io/making-setinterval-declarative-with-react-hooks/#just-show-me-the-code
 *
 * @param callback Method to call in each interval.
 * @param delay Delay for interval (in milliseconds).
 * @param shouldStop Some condition to trigger a stop on the interval.
 *
 * @returns stopper for the interval
 */
const useInterval = (
	callback: Callback,
	delay: number,
	shouldStop: boolean
) => {
	const savedCallback = useRef<Callback>();
	const id = useRef<NodeJS.Timeout>();

	// Remember the latest callback.
	useEffect(() => {
		savedCallback.current = callback;
	}, [callback]);

	const clearLastInterval = useCallback(() => {
		if (!id.current) return;
		clearInterval(id.current as NodeJS.Timeout);
	}, []);

	const triggerCb = useCallback(() => {
		savedCallback.current?.();
	}, []);

	// Set up the interval.
	useEffect(() => {
		if (!shouldStop) id.current = setInterval(triggerCb, delay);
		return () => clearLastInterval();
	}, [delay, shouldStop, clearLastInterval, triggerCb]);

	// Stop the interval if the stop is requested
	useEffect(() => {
		if (shouldStop) clearLastInterval();
	}, [shouldStop, clearLastInterval]);

	return clearLastInterval;
};

export default useInterval;
