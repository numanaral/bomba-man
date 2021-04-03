const sleep = (duration = 1000) => {
	return new Promise(r => {
		setTimeout(r, duration);
	});
};

/**
 * Wraps the button on click with a blur event to undo auto on focus. This is
 * especially annoying when view is changed and the user hits the "Space"
 * button and it switches the view back as it's "focus"ed on.
 *
 * @param cb Curried function where callback is wrapped with this utility.
 * @returns Base event cb
 */
const wrapPreventFocusLock = (
	cb: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
	// undo onFocus lock
	e.currentTarget.blur();
	cb(e);
};

export { sleep, wrapPreventFocusLock };
