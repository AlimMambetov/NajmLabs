'use client'
import React from 'react';
import cls from './style.module.scss';

export const CirlceAnim = ({ className, ...props }: any) => {

	const circle_arr = [1, 2, 3, 4, 5, 6]

	return (<>

		<div {...props} className={`${cls.circle} ${className}`}>
			{circle_arr.map((item, index) => {
				const direction = index % 2 === 0 ? 'left' : 'right';
				const isFirst = index === 0;
				const speeds = [6, 34, 38, 30, 50, 46];
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