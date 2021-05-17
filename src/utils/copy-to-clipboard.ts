type OptionalCallableFunction = CallableFunction | null;

/** @see https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript */
const fallbackCopyTextToClipboard = (
	text: string,
	postSuccess: OptionalCallableFunction = null,
	postFailure: OptionalCallableFunction = null
) => {
	const textArea = document.createElement('textarea');
	textArea.value = text;

	// Avoid scrolling to bottom
	textArea.style.top = '0';
	textArea.style.left = '0';
	textArea.style.position = 'fixed';

	document.body.appendChild(textArea);
	textArea.focus();
	textArea.select();

	try {
		const successful = document.execCommand('copy');
		if (successful) {
			postSuccess?.();
			return;
		}
		postFailure?.();
	} catch (err) {
		postFailure?.();
	} finally {
		document.body.removeChild(textArea);
	}
};

// https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
const copyToClipboard = (
	text: string,
	postSuccess: OptionalCallableFunction = null,
	postFailure: OptionalCallableFunction = null
) => {
	if (!navigator.clipboard) {
		fallbackCopyTextToClipboard(text, postSuccess, postFailure);
		return;
	}
	navigator.clipboard.writeText(text).then(
		() => {
			postSuccess?.();
		},
		() => {
			postFailure?.();
		}
	);
};

export default copyToClipboard;
