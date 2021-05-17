import { FormProps } from 'components/Form';
import { FormItem } from 'components/Form/types';
import { PowerUp } from 'enums';
import { GameConfig } from 'store/redux/reducers/game/types';

type Config = Omit<GameConfig, 'keyboardConfig'>;

type PowerUpIconPack = {
	icon: React.ReactElement;
	color: string;
};

type PowerUpIcons = Record<PowerUp, PowerUpIconPack>;

type ConfigForm = FormProps<Config>;

type PartialFormItems = Array<Partial<FormItem<Config>>>;
type SectionProps = {
	title: string;
	description: string;
	items: PartialFormItems;
};
type PartialConfigFormItems = PartialFormItems | SectionProps;

export type {
	Config,
	PowerUpIconPack,
	PowerUpIcons,
	ConfigForm,
	PartialFormItems,
	PartialConfigFormItems,
	SectionProps,
};
