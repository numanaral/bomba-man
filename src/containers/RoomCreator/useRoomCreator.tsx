import { useForm } from 'components/Form';
import { GameType } from 'enums';
import { generateDefaultGameConfig } from 'utils/game';
import { GameConfig, GameConfigRanges } from 'store/redux/reducers/game/types';
import { useState } from 'react';
import { getConfigSchema } from './schemas';
import { getConfigSections } from './sections';
import { SectionProps } from './types';
import useCreateRoomAndRedirect from './useCreateRoomAndRedirect';

const defaultValues = generateDefaultGameConfig();

const useRoomCreator = (type: GameType) => {
	const [pending, setPending] = useState(false);
	const onCreate = useCreateRoomAndRedirect(type);
	const onSubmit = (gameConfig: GameConfig) => {
		setPending(true);
		onCreate(gameConfig);
	};

	const { handleSubmit, utils } = useForm({
		defaultValues: {
			...defaultValues,
			players: {
				// online mode will not have a limiter
				...(type === GameType.Local && {
					humanPlayers: 1 as GameConfigRanges.HumanPlayerCount,
				}),
				npcPlayers:
					type === GameType.Local
						? 3
						: (0 as GameConfigRanges.NPCPlayerCount),
			},
		},
		onSubmit,
		schema: getConfigSchema(type),
	});

	const columns = getConfigSections(type).reduce<
		Record<string, Array<SectionProps>>
	>((acc, { side, ...props }) => {
		if (!acc[side]) acc[side] = [];
		acc[side].push(props as SectionProps);
		return acc;
	}, {});

	return {
		pending,
		handleSubmit,
		utils,
		columns,
	};
};

export default useRoomCreator;
