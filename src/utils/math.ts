function getRandomInt(max: number): number;
function getRandomInt(min: number, max: number): number;
function getRandomInt(min: number, max?: number | undefined) {
	const _max = max || min;
	const _min = (max !== undefined && min) || 0;
	return Math.floor(Math.random() * (_max - _min)) + _min;
}

export { getRandomInt };
