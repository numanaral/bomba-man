const sleep = (duration = 1000) => {
	return new Promise(r => {
		setTimeout(r, duration);
	});
};

export { sleep };
