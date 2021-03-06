import { FormComponent } from 'components/Form/types';
import { GameType, PowerUp } from 'enums';
import { generateMarks } from 'utils/material-ui';
import {
	PowerUpIcon,
	CubeIcon,
	MapIcon,
	CharacterIcon,
	SquareIcon,
	powerUpIconPack,
	FireIcon,
	UserIcon,
	RobotIcon,
	ICON_STYLE,
} from './icons';
import { PartialConfigFormItems, SectionProps } from './types';
import { generatePowerUpSection } from './utils';

const powerUps = [
	{
		type: FormComponent.Slider,
		label: 'Power Up Chance',
		name: 'powerUps.chance',
		min: 1,
		max: 5,
		marks: generateMarks(1, 5),
		icon: <PowerUpIcon style={ICON_STYLE} />,
	},
	{
		title: 'Defaults',
		description: 'Values to start the game with',
		items: generatePowerUpSection('powerUps.defaults', 5, [100, 150, 200]),
	},
	{
		title: 'Increase Values',
		description: 'Amount to increase when you gain a power up',
		items: generatePowerUpSection('powerUps.increaseValues', 3, [
			-10,
			-15,
			-20,
			-25,
			-30,
		]),
	},
	{
		title: 'Max Drop Count',
		description: 'Maximum amount of power ups that can drop',
		items: generatePowerUpSection('powerUps.maxDropCount', 6),
	},
] as PartialConfigFormItems;

const tiles = [
	{
		type: FormComponent.Slider,
		label: 'Blocking Tile Chance',
		name: 'tiles.blockTileChance',
		min: 1,
		max: 10,
		marks: generateMarks(1, 10),
		icon: <CubeIcon style={ICON_STYLE} />,
	},
] as PartialConfigFormItems;

const sizes = [
	{
		type: FormComponent.Slider,
		label: 'Map (n by n squares)',
		name: 'sizes.map',
		min: 6,
		max: 15,
		marks: generateMarks(6, 15),
		icon: <MapIcon style={ICON_STYLE} />,
	},
	{
		type: FormComponent.Slider,
		label: 'Character (pixels)',
		name: 'sizes.character',
		boundNames: ['sizes.tile', 'sizes.movement'],
		step: null,
		min: 32,
		max: 64,
		marks: generateMarks([32, 48, 64]),
		icon: <CharacterIcon size={40} />,
		// disabled: true,
	},
	{
		type: FormComponent.Slider,
		label: 'Tile (pixels) => [bound to char size, for now]',
		name: 'sizes.tile',
		min: 32,
		max: 64,
		marks: generateMarks([32, 48, 64]),
		icon: <SquareIcon style={ICON_STYLE} />,
		disabled: true,
	},
	{
		type: FormComponent.Slider,
		label: 'Movement (pixels) => [bound to char size, for now]',
		name: 'sizes.movement',
		min: 32,
		max: 64,
		marks: generateMarks([32, 48, 64]),
		icon: powerUpIconPack[PowerUp.MovementSpeed].icon,
		disabled: true,
	},
] as PartialConfigFormItems;

const duration = [
	{
		title: 'Bomb',
		description: 'Timings for the bomb and explosion',
		items: [
			{
				type: FormComponent.Slider,
				name: 'duration.bomb.firing',
				label: 'Duration before bomb explodes (seconds)',
				min: 1,
				max: 3,
				marks: generateMarks([1.5, 2.5, 3, 1, 2]),
				step: null,
				icon: powerUpIconPack[PowerUp.BombCount].icon,
			},
			{
				type: FormComponent.Slider,
				name: 'duration.bomb.exploding',
				label: 'Duration of the explosion (seconds)',
				min: 0.5,
				max: 1.5,
				marks: generateMarks([0.5, 1, 1.5]),
				step: null,
				icon: <FireIcon style={ICON_STYLE} />,
			},
		],
	} as SectionProps,
] as PartialConfigFormItems;

const players = (type: GameType) => {
	const isLocalGame = type === GameType.Local;
	const title = 'Human vs Human vs NPC';
	let description = 'Select Human Players and NPCs';

	if (!isLocalGame) {
		description = 'Select NPCs to join the game';
	}

	return [
		{
			title,
			description,
			items: [
				...((isLocalGame && [
					{
						type: FormComponent.Slider,
						name: 'players.humanPlayers',
						label: 'Human Player Count',
						min: 1,
						max: 4,
						marks: generateMarks([1, 2, 3, 4]),
						step: null,
						icon: <UserIcon style={ICON_STYLE} />,
						dependentFields: ['players.npcPlayers'],
						required: true,
					},
				]) ||
					[]),
				{
					type: FormComponent.Slider,
					name: 'players.npcPlayers',
					label: 'NPC Player Count',
					min: 0,
					max: 4,
					marks: generateMarks([0, 1, 2, 3, 4]),
					step: null,
					icon: <RobotIcon style={ICON_STYLE} />,
					dependentFields: ['players.humanPlayers'],
					required: true,
				},
			],
		} as SectionProps,
	] as PartialConfigFormItems;
};

const getConfigSections = (type: GameType) => {
	const isLocalGame = type === GameType.Local;
	let playersTitle = 'Players';
	let playersDescription = 'Players for the game';

	if (!isLocalGame) {
		playersTitle = 'NPCs';
		playersDescription = 'Optional NPCs to play alongside';
	}

	return [
		{
			title: 'Power Ups',
			description: 'Power Up Configurations',
			items: powerUps,
			side: 2,
		},
		// NOTE: disabled NPCs for online game, they lag the game
		...((isLocalGame && [
			{
				title: playersTitle,
				description: playersDescription,
				items: players(type),
				side: 1,
			},
		]) ||
			[]),
		{
			title: 'Sizes',
			description: 'Size Configurations',
			items: sizes,
			side: 1,
		},
		{
			title: 'Duration',
			description: 'Duration Configurations',
			items: duration,
			side: 1,
		},
		{
			title: 'Tiles',
			description: 'Tile Configurations',
			items: tiles,
			side: 1,
		},
	];
};

export { getConfigSections };
