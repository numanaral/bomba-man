import { H1, H4, Small } from 'components/typography';

const ConfigDisclaimer = () => {
	return (
		<>
			<H1> Game Config </H1>
			<H4>
				You can adjust the game config here if you want to create
				special modes!
				<br />
				<Small>
					NOTE: This might be too much to configure right now, just
					skip and come back later to adjust it :)
				</Small>
			</H4>
		</>
	);
};

export { ConfigDisclaimer };
