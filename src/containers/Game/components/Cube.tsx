import { forwardRef } from 'react';
import './Cube.scss';
import { TileProps } from '../types';

const Cube = forwardRef<HTMLDivElement, TileProps>(
	(
		{
			size,
			top,
			left,
			animate,
			variant,
			color: backgroundColor,
			collisionIndex,
			style,
			className,
			...rest
		},
		ref
	) => {
		return (
			<div
				className={`${
					(className && `${className} `) || ''
				}cuboid bouncy-block-${
					(!animate && 'no-animation') || collisionIndex || 0
				} ${variant}`}
				style={{ ...style, top, left, width: size, height: size }}
				ref={ref}
				{...rest}
			>
				{Array(6)
					.fill(0)
					.map((_, ind) => (
						<div
							key={ind}
							className="cuboid__side"
							style={{
								...(backgroundColor && { backgroundColor }),
								width: size,
								height: size,
							}}
						/>
					))}
			</div>
		);
	}
);

export default Cube;
