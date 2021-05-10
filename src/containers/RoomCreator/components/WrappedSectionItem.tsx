import { Divider } from '@material-ui/core';
import { FormField } from 'components/Form';

const WrappedSectionItem = ({ name, utils, ...props }: any) => {
	return (
		<>
			<Divider />
			<div style={{ padding: '20px 0' }}>
				<FormField key={name} utils={utils} name={name} {...props} />
			</div>
		</>
	);
};

export default WrappedSectionItem;
