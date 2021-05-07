import Button from 'components/Button';
import Container from 'components/Container';
import Spacer from 'components/Spacer';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { BASE_PATH } from 'routes/constants';
import theme from 'theme';

import styled from 'styled-components';

const Wrapper = styled(Container)`
	form {
		text-align: center;
	}

	label + span {
		color: ${theme.palette.color.error};
	}
`;

const Join = () => {
	const [searchKeyword, setSearchKeyword] = useState('');
	const [error, setError] = useState('');
	const { push } = useHistory();

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!searchKeyword) {
			setError('Please enter a room id');
			return;
		}
		push(`${BASE_PATH}/online/${searchKeyword}`);
	};

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const keyword = e.target.value.trim();
		if (!keyword) return;
		setSearchKeyword(keyword);
	};

	return (
		<Wrapper>
			<form onSubmit={onSubmit}>
				<h1
					style={{
						width: '100%',
						color: theme.palette.color.primary,
					}}
				>
					Join a room
				</h1>
				<label htmlFor="room-id">
					<input
						type="text"
						id="room-id"
						style={{ width: '100%' }}
						value={searchKeyword}
						onChange={onChange}
					/>
				</label>
				{error && <span>Error: {error}</span>}
				<Spacer direction="bottom" />
				<Button
					style={{ width: '100%' }}
					variant="primary"
					type="submit"
				>
					Join
				</Button>
			</form>
		</Wrapper>
	);
};

export default Join;
