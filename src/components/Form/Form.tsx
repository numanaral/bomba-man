import { SubmitHandler, DeepPartial, UnpackNestedValue } from 'react-hook-form';
import { ObjectSchema } from 'yup';
import { FormItem } from './types';
import useForm from './useForm';
import FormField from './FormField';
import FormContainer, { FormContainerProps } from './FormContainer';

interface Props<Schema> {
	items: Array<FormItem<Schema>>;
	/** @see https://github.com/react-hook-form/react-hook-form/issues/2129#issuecomment-657334424 */
	schema: ObjectSchema<object | any>;
	onSubmit: SubmitHandler<Schema>;
	defaultValues?: UnpackNestedValue<DeepPartial<Schema>>;
	submitText?: string;
	focusOnFirstElement?: boolean;
	fullWidth?: boolean;
	containerProps?: Partial<FormContainerProps>;
	pending?: boolean;
	disabled?: boolean;
}

const Form = <Schema,>({
	items,
	schema,
	onSubmit,
	defaultValues,
	submitText = 'Submit',
	focusOnFirstElement = false,
	fullWidth = false,
	containerProps = {},
	pending = false,
	disabled = false,
}: Props<Schema>) => {
	const { handleSubmit, utils } = useForm({
		defaultValues,
		onSubmit,
		schema,
		...(focusOnFirstElement && { firstFocusElementName: items[0]?.name }),
	});

	const _containerProps = {
		...containerProps,
		style: {
			...containerProps?.style,
			...(fullWidth && { width: '100%' }),
		},
	};

	return (
		<FormContainer
			onSubmit={handleSubmit}
			submitText={submitText}
			pending={pending}
			disabled={disabled}
			{..._containerProps}
		>
			{items.map(props => (
				<FormField
					key={props.name}
					utils={utils}
					{...props}
					required={props.required}
				/>
			))}
		</FormContainer>
	);
};

export type { Props as FormProps };
export default Form;
