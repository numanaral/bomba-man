import { FormGroup } from '@material-ui/core';
import { Controller, ControllerProps } from 'react-hook-form';
import { COMPONENTS } from '.';
import { FormItem, UseFormUtils } from './types';

// const useFormWithSchema = ()

type Props<Schema> = FormItem<Schema> & {
	utils: UseFormUtils<Schema>;
};

const FormField = <Schema,>({
	// utils
	utils: {
		checkIfRequiredField,
		getRequiredField,
		control,
		register,
		setValue,
		trigger,
	},
	// FormItemProps
	type,
	name,
	label,
	boundNames,
	dependentFields,
	required = false,
	defaultValue = '',
	...formItemProps
}: Props<Schema>) => {
	const [controllerRequiredProps, componentRequiredProps] = getRequiredField(
		name,
		required || checkIfRequiredField(name)
	);

	// render is added later for sure
	const controllerProps: Partial<ControllerProps<Schema>> = {
		control,
		name,
		defaultValue,
		...controllerRequiredProps,
	};

	const As = COMPONENTS[type];
	const componentProps: Partial<React.ComponentProps<typeof As>> = {
		label,
		...formItemProps,
		...componentRequiredProps,
	};

	controllerProps.render = ({ field: { onChange, ...rest } }) => {
		const { ref } = register(name);
		const _onChange = (value: any, ...onChangeRest: any[]) => {
			// update all bound values
			boundNames?.forEach(pathName => {
				setValue(pathName, value);
			});
			// trigger the change
			onChange(value, ...onChangeRest);
			// trigger a check on the dependent fields
			if (dependentFields) {
				dependentFields.forEach(pathName => {
					trigger(pathName);
				});
				// also trigger a check on the current field
				trigger(name);
			}
		};
		// TODO: create a wrapper/util that will pass the exact
		// props based on the type
		return (
			// @ts-expect-error
			<As {...rest} {...componentProps} onChange={_onChange} ref={ref} />
		);
	};

	// NOTE: rhfProps contains: onChange, onBlur and value

	return (
		<FormGroup>
			<Controller
				// We added the `render` so this can be ignored
				// eslint-disable-next-line max-len
				{...(controllerProps as ControllerProps<Schema>)}
			/>
		</FormGroup>
	);
};

export default FormField;
