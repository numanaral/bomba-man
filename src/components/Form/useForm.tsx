import { useEffect } from 'react';
import {
	useForm as useReactHookForm,
	SubmitErrorHandler,
	ControllerProps,
	get,
	FieldError,
	DeepMap,
	Path,
} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { UseFormProps, UseFormUtils } from './types';

const useForm = <Schema,>({
	onSubmit,
	defaultValues,
	schema,
	firstFocusElementName,
}: UseFormProps<Schema>) => {
	const reactHookFormUtils = useReactHookForm<Schema>({
		resolver: yupResolver(schema),
		defaultValues,
	});

	const {
		setFocus,
		handleSubmit,
		formState: { errors },
	} = reactHookFormUtils;

	// Focus on the first element in the first render
	useEffect(() => {
		if (firstFocusElementName) setFocus(firstFocusElementName);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	/** Focus on the first error */
	const onInvalid: SubmitErrorHandler<Schema> = err => {
		let values: DeepMap<Schema, FieldError> = err;
		// recursively look for the first ref, then focus on it
		while (values) {
			const { ref } = values as FieldError;
			if (ref) {
				ref!.focus?.();
				return;
			}
			[values] = Object.values(values);
		}
	};

	const getRequiredField: UseFormUtils<Schema>['getRequiredField'] = (
		fieldName,
		required
	) => {
		if (!required) return [{}, {}];
		const controllerRequiredProps: Pick<ControllerProps, 'rules'> = {
			rules: {
				required: true,
			},
		};

		const field = get(errors, fieldName);

		const componentRequiredProps: DynamicObject = {
			required: true,
			rules: { required: true },
			...(field && {
				helperText: `${field.message}`,
				error: true,
			}),
		};

		return [controllerRequiredProps, componentRequiredProps];
	};

	/** Checks if the field is required from the yup schema */
	const checkIfRequiredField = (fieldName: Path<Schema>) => {
		return schema.fields?.[fieldName]?.exclusiveTests?.required;
	};

	const utils = {
		getRequiredField,
		checkIfRequiredField,
		...reactHookFormUtils,
	};

	return {
		handleSubmit: handleSubmit(onSubmit, onInvalid),
		utils,
	};
};

export default useForm;
