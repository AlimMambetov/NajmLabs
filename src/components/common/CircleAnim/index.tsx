'use client'
import React from 'react';
import cls from './style.module.scss';

export const CirlceAnim = (props: any) => {

	const circle_arr = [1, 2, 3, 4, 5, 6]

	return (<>

		<div className={cls.circle}>
			{circle_arr.map((item, index) => {
				// Determine rotation direction: even index = left, odd index = right
				const direction = index % 2 === 0 ? 'left' : 'right';
				// Check if it's the first element (index 0)
				const isFirst = index === 0;
				// Different speeds for each ring (slower for inner rings, faster for outer)
				// You can adjust these values
				const speeds = [6, 34, 38, 30, 50, 46]; // seconds per full rotation
				const speed = speeds[index] || 10;

				return (
					<img
						src={`/images/circle-anim/${item}.svg`}
						alt={`${item}`}
						key={item}
						className={`
								${cls[`rotate-${direction}`]}
								${isFirst ? cls.pulse : ''}
							`}
						style={{ animationDuration: `${speed}s` }}
					/>
				);
			})}
		</div>
	</>)
}

export default CirlceAnim;