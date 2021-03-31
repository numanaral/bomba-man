import { forwardRef } from 'react';
import './Cube.scss';

const Cube = forwardRef<HTMLDivElement, TileProps>(
	(
		{
			size,
			top,
			left,
			animate,
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
				}`}
				style={{ ...style, top, left, width: size, height: size }}
				ref={ref}
				{...rest}
			>
				<div
					className="cuboid__side"
					style={{
						...(backgroundColor && { backgroundColor }),
						width: size,
						height: size,
					}}
				/>
				<div
					className="cuboid__side"
					style={{
						...(backgroundColor && { backgroundColor }),
						width: size,
						height: size,
					}}
				/>
				<div
					className="cuboid__side"
					style={{
						...(backgroundColor && { backgroundColor }),
						width: size,
						height: size,
					}}
				/>
				<div
					className="cuboid__side"
					style={{
						...(backgroundColor && { backgroundColor }),
						width: size,
						height: size,
					}}
				/>
				<div
					className="cuboid__side"
					style={{
						...(backgroundColor && { backgroundColor }),
						width: size,
						height: size,
					}}
				/>
				<div
					className="cuboid__side"
					style={{
						...(backgroundColor && { backgroundColor }),
						width: size,
						height: size,
					}}
				/>
			</div>
		);
	}
);

export default Cube;
