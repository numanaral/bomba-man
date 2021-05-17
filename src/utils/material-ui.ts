import { SliderProps } from '@material-ui/core';

function generateMarks(stops: Array<number>): SliderProps['marks'];
function generateMarks(min: number, max: number): SliderProps['marks'];
function generateMarks(
	minOrStops: number | Array<number>,
	maxOrNull?: number | undefined
): SliderProps['marks'] {
	// if it's an array
	if (Array.isArray(minOrStops)) {
		return minOrStops.map(value => ({
			value,
			label: value,
		}));
	}
	const diff = (maxOrNull as number) - minOrStops;
	return Array(diff + 1)
		.fill(0)
		.map((_, ind) => {
			const value = minOrStops + ind;
			return {
				value,
				...((ind === 0 || ind === diff) && { label: value }),
			};
		});
}

export { generateMarks };
