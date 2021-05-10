import { cloneElement, useState } from 'react';
import { Popover as MuiPopover } from '@material-ui/core';
import { PopoverProps } from '@material-ui/core/Popover';
import TooltipButton from 'components/TooltipButton';
import styled from 'styled-components';

interface Props extends Omit<PopoverProps, 'open'> {
	component: React.ReactElement;
	passCallback?: boolean;
	passDownOnCloseProp?: boolean;
	tooltip?: string;
	text?: string;
	icon?: ReactElementOrElementType;
	buttonComponent?: React.ReactElement;
	open?: boolean;
}

const Wrapper = styled.div`
	&.MuiPopover-root {
		margin: auto;
		/* width: '3.5rem', */
		height: 48px;
		width: 48px;

		display: inline-flex;
		position: relative;
		align-items: center;
		vertical-align: middle;
		-moz-appearance: none;
		justify-content: center;
	}

	& button {
		margin: auto;
	}
`;

const Popover = ({
	component,
	tooltip,
	text,
	icon,
	buttonComponent,
	passCallback = false,
	passDownOnCloseProp = false,
	anchorOrigin = {
		vertical: 'bottom',
		horizontal: 'center',
	},
	transformOrigin = {
		vertical: 'top',
		horizontal: 'center',
	},
	...rest
}: Props) => {
	const [anchorEl, setAnchorEl] = useState<
		HTMLButtonElement | HTMLAnchorElement | null
	>(null);

	const onClick: ReactOnButtonClick = e => {
		e.stopPropagation();
		setAnchorEl(e.currentTarget);
	};
	const onClose = () => {
		setAnchorEl(null);
	};

	const isPopoverOpen = Boolean(anchorEl);
	const id = isPopoverOpen ? '__popover' : undefined;

	return (
		<Wrapper>
			{(buttonComponent &&
				cloneElement(buttonComponent, {
					onClick: (e => {
						// If you need to do a check before executing on click,
						// pass it back. (Eg: auth)
						if (passCallback) {
							if (!buttonComponent.props.onClick) {
								throw new Error(
									'You forgot to pass an onClick.'
								);
							}
							buttonComponent.props.onClick(() => onClick(e));
							return;
						}
						onClick(e);
					}) as ReactOnButtonClick,
				})) || (
				<TooltipButton
					aria-describedby={id}
					tooltip={tooltip}
					onClick={onClick}
					text={text}
					icon={icon}
				/>
			)}
			<MuiPopover
				{...rest}
				id={id}
				open={isPopoverOpen}
				anchorEl={anchorEl}
				onClose={onClose}
				anchorOrigin={anchorOrigin}
				transformOrigin={transformOrigin}
			>
				{(passDownOnCloseProp &&
					cloneElement(component, { popoverOnClose: onClose })) ||
					component}
			</MuiPopover>
		</Wrapper>
	);
};

export default Popover;
