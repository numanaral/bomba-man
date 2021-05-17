import {
	uniqueNamesGenerator,
	Config,
	colors,
	animals,
} from 'unique-names-generator';

const customConfig: Config = {
	dictionaries: [colors, animals],
	separator: '-',
};

const getRandomName = () => uniqueNamesGenerator(customConfig);

export default getRandomName;
