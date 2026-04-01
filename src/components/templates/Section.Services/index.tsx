'use client'
import React from 'react';
import { motion, AnimatePresence, MotionProps } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Container } from '@/components/layout';
import cls from './style.module.scss';
import { Icon } from '@/components/ui';
import servicesJSON from '&/data/services.json';
import { useScreen } from '@/hooks';

export const SectionServices = (props: any) => {
	const { isPointer } = useScreen();
	const [activeIndex, setActiveIndex] = useState(0);
	const [targetIndex, setTargetIndex] = useState(null);
	const items = servicesJSON || [];


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

	const handleItemClick = (clickedIndex: any) => {
		if (clickedIndex === activeIndex) return;
		setTargetIndex(clickedIndex);
	};

	const getEllipticalPosition = (itemIndex: any, currentIndex: any) => {
		const totalItems = items.length;
		const angle = ((itemIndex - currentIndex) / totalItems) * Math.PI * 2;

		const radiusX = isPointer ? 250 : 160;
		const radiusY = isPointer ? -200 : -90;

		const x = Math.sin(angle) * radiusX;
		const y = Math.cos(angle) * (isPointer ? radiusY : -radiusY);
		const scale = 1.3;
		const zIndex = Math.floor((Math.cos(angle) + 1) * 50) + 10;

		return { x, y, scale, zIndex };
	};

	// Animation variants for content
	const bias: number = 60;
	const contentVariants = {
		enter: (direction: number) => ({
			x: direction > 0 ? -bias / 3 : bias,
			opacity: 0,
		}),
		center: {
			x: 0,
			opacity: 1,
		},
		exit: (direction: number) => ({
			x: direction > 0 ? bias : -bias / 3,
			opacity: 0,
		}),
	};

	const transition = {
		type: 'spring',
		damping: 30,
		stiffness: 300,
	} as MotionProps;

	const [direction, setDirection] = useState(0);

	const handlePrev = () => {
		setDirection(-1);
		handleItemClick((activeIndex - 1 + items.length) % items.length);
	};

	const handleNext = () => {
		setDirection(1);
		handleItemClick((activeIndex + 1) % items.length);
	};

	return (
		<Container as='section' id='services' className={cls.wrap}>
			<h2 className={`${cls.title} title`}>Наши услуги</h2>

			<div className={cls.grid}>
				<div className={cls.orbit} >
					<div className={cls.orbit__center}>
						<Icon as={'logo'} />
					</div>
					<div className={cls.orbit__planets}>
						{items.map((item: any, i) => {
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
									transition={transition}
									onClick={() => handleItemClick(i)}
									className={cls.planet}
									data-active={i === activeIndex || null}
								>
									<div className={cls.planet__content}>
										<Icon as={item.icon} />
									</div>
								</motion.div>
							);
						})}
					</div>

				</div>


				<motion.div className={`${cls.info} glass-box`}>
					<div className={cls.info__head}>
						<div className={`${cls.info__icon} `}>
							<Icon as={items[activeIndex].icon as any} />
						</div>
						<AnimatePresence mode="wait" custom={direction}>
							<motion.h3
								key={activeIndex}
								custom={direction}
								variants={contentVariants}
								initial="enter"
								animate="center"
								exit="exit"
								transition={transition}
								className={`${cls.info__title}`}
							>
								{items[activeIndex].title}
							</motion.h3>
						</AnimatePresence>
					</div>
					<div className={cls.info__main}>
						<AnimatePresence mode="wait" custom={direction}>
							<motion.p
								key={`desc-${activeIndex}`}
								custom={direction}
								variants={contentVariants}
								initial="enter"
								animate="center"
								exit="exit"
								transition={transition}
								className={`${cls.info__desc}`}
							>
								{items[activeIndex].desc}
							</motion.p>
						</AnimatePresence>
						<AnimatePresence mode="wait" custom={direction}>
							<motion.ul
								key={`list-${activeIndex}`}
								custom={direction}
								variants={contentVariants}
								initial="enter"
								animate="center"
								exit="exit"
								transition={{
									...transition,
									delay: 0.1
								}}
								className={`${cls.info__list}`}
							>
								<h4 className={cls.info__subtitle}>Что мы делаем:</h4>
								{items[activeIndex].list.map((item: any, i: number) => (
									<li className={`${cls.info__item}`} key={i}>{item}</li>
								))}
							</motion.ul>
						</AnimatePresence>
					</div>
					<div className={cls.info__foot}>
						<motion.button whileTap={{ scale: 0.9 }} onClick={handlePrev}><Icon as='arrow-L' /></motion.button>
						<motion.button whileTap={{ scale: 0.9 }} onClick={handleNext}><Icon as='arrow-R' /></motion.button>
					</div>
				</motion.div>
			</div>


		</Container>
	);
}

export default SectionServices;