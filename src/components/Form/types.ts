import { ControllerProps, Path, UseFormReturn } from 'react-hook-form';
import { FormProps } from '.';
import COMPONENTS from './components';

enum FormComponent {
	Text = 'Text',
	Password = 'Password',
	Checkbox = 'Checkbox',
	ColorPicker = 'ColorPicker',
	Slider = 'Slider',
	Rating = 'Rating',
}

namespace ComponentTypes {
	export type Text = typeof COMPONENTS[FormComponent.Text];
	export type Password = typeof COMPONENTS[FormComponent.Password];
	export type Checkbox = typeof COMPONENTS[FormComponent.Checkbox];
	export type ColorPicker = typeof COMPONENTS[FormComponent.ColorPicker];
	export type Slider = typeof COMPONENTS[FormComponent.Slider];
	export type Rating = typeof COMPONENTS[FormComponent.Rating];
}

type PossibleComponentProps = Partial<
	| React.ComponentProps<ComponentTypes.Text>
	| React.ComponentProps<ComponentTypes.Password>
	| React.ComponentProps<ComponentTypes.Checkbox>
	| React.ComponentProps<ComponentTypes.ColorPicker>
	| React.ComponentProps<ComponentTypes.Slider>
	| React.ComponentProps<ComponentTypes.Rating>
>;

type FormItem<Schema> = {
	type: FormComponent;
	name: Path<Schema>;
	label: string;
	/** If you want a field to update other fields' values */
	boundNames?: Array<Path<Schema>>;
	required?: boolean;
	defaultValue?: string;
} & PossibleComponentProps;

type PropsWithFormControl<T> = Omit<T, 'onChange' | 'icon'> & {
	label: string;
	onChange: (
		value: any
	) =>
		| void
		| ((event: React.ChangeEvent<{}>, value: number | number[]) => void)
		| undefined;
};

type UseFormProps<Schema> = Omit<
	FormProps<Schema>,
	'submitText' | 'items' | 'focusOnFirstElement'
> & {
	firstFocusElementName?: Path<Schema>;
};

type UseFormUtils<Schema> = {
	getRequiredField: (
		fieldName: Path<Schema>,
		required: boolean
	) => [Pick<ControllerProps, 'rules'>, DynamicObject];
} & UseFormReturn<Schema>;

export { FormComponent };
export type {
	FormItem,
	ComponentTypes,
	PropsWithFormControl,
	UseFormProps,
	UseFormUtils,
};
