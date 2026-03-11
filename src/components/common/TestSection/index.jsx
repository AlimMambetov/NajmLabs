'use client'
import React from 'react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export const TestSection = (props) => {
	const [activeIndex, setActiveIndex] = useState(0);
	const [targetIndex, setTargetIndex] = useState(null);
	const items = ['Слайд 1', 'Слайд 2', 'Слайд 3', 'Слайд 4', 'Слайд 5', 'Слайд 6', 'Слайд 7'];

	useEffect(() => {
		if (targetIndex !== null && targetIndex !== activeIndex) {
			const totalItems = items.length;
			let diff = targetIndex - activeIndex;

			if (Math.abs(diff) > totalItems / 2) {
				diff = diff > 0 ? diff - totalItems : diff + totalItems;
			}

			const direction = diff > 0 ? 1 : -1;

			const timer = setTimeout(() => {
				setActiveIndex((activeIndex + direction + totalItems) % totalItems);
			}, 100);

			return () => clearTimeout(timer);
		}
	}, [activeIndex, targetIndex, items.length]);

	const handleItemClick = (clickedIndex) => {
		if (clickedIndex === activeIndex) return;
		setTargetIndex(clickedIndex);
	};

	const getEllipticalPosition = (itemIndex, currentIndex) => {
		const totalItems = items.length;
		const angle = ((itemIndex - currentIndex) / totalItems) * Math.PI * 2;

		const radiusX = 300;
		const radiusY = -150;

		const x = Math.sin(angle) * radiusX;
		const y = Math.cos(angle) * radiusY;
		const scale = 0.3 + (Math.cos(angle) + 1) * 0.2;
		const zIndex = Math.floor((Math.cos(angle) + 1) * 50) + 10;

		return { x, y, scale, zIndex };
	};

	return (
		<div style={{ position: 'relative', height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
			{items.map((item, i) => {
				const { x, y, scale, zIndex } = getEllipticalPosition(i, activeIndex);

				return (
					<motion.div
						key={i}
						style={{
							position: 'absolute',
							zIndex: zIndex,
							cursor: 'pointer',
						}}
						animate={{ x, y, scale }}
						transition={{ type: 'spring', stiffness: 300, damping: 30 }}
						onClick={() => handleItemClick(i)}
					>
						<div style={{
							width: '150px',
							height: '150px',
							background: '#4f46e5',
							color: 'white',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							borderRadius: '10000px',
							border: '1px solid white',
						}}>
							{item}
						</div>
					</motion.div>
				);
			})}

			<button onClick={() => handleItemClick((activeIndex + 1) % items.length)}>Вперед</button>
			<button onClick={() => handleItemClick((activeIndex - 1 + items.length) % items.length)}>Назад</button>
		</div>
	);
}

export default TestSection;