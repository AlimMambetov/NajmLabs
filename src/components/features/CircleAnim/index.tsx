'use client'
import React, { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import cls from './style.module.scss';

interface CircleAnimProps {
	className?: string;
	speed?: number; // Общий множитель скорости (1 = нормально, 0.5 = медленнее)
	disabled?: boolean; // Отключить анимацию на мобилках по желанию
}

export const CircleAnim = ({ className, speed = 1, disabled = false }: CircleAnimProps) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const isInView = useInView(containerRef, { once: true, amount: 0.3 });
	const prefersReducedMotion = useReducedMotion();

	// Полностью отключаем анимацию если:
	// - пользователь предпочитает меньше анимации
	// - компонент не в области видимости (экономия ресурсов)
	// - анимация отключена пропсом
	const shouldAnimate = !disabled && !prefersReducedMotion && isInView;

	// Данные для вращающихся элементов
	const circles = [
		{ src: '/images/circle-anim/1.svg', direction: 'none', speed: 6, scale: 1 },  // без вращения, только pulse
		{ src: '/images/circle-anim/2.svg', direction: 'right', speed: 90, scale: 1 },
		{ src: '/images/circle-anim/3.svg', direction: 'left', speed: 58, scale: 1 },
		{ src: '/images/circle-anim/4.svg', direction: 'right', speed: 30, scale: 1 },
		{ src: '/images/circle-anim/5.svg', direction: 'left', speed: 100, scale: 1 },
		{ src: '/images/circle-anim/6.svg', direction: 'right', speed: 46, scale: 1 },
	];

	return (
		<div
			ref={containerRef}
			className={`${cls.circle} ${className || ''}`}
			style={{
				width: 'min(700px, 90vw)',
				willChange: shouldAnimate ? 'transform' : 'auto'
			}}
		>
			{circles.map((circle, index) => {
				const rotateAmount = circle.direction === 'right' ? 360 : circle.direction === 'left' ? -360 : 0;
				const duration = circle.speed / speed;
				const isFirst = index === 0;

				// Если не нужно анимировать - показываем статично
				if (!shouldAnimate) {
					return (
						<img
							key={circle.src}
							src={circle.src}
							alt={`Декоративный элемент ${index + 1}`}
							className={cls.circleImage}
							style={{
								position: 'absolute',
								width: '100%',
								opacity: 0.5
							}}
						/>
					);
				}

				return (
					<motion.img
						key={circle.src}
						src={circle.src}
						alt={`Декоративный элемент ${index + 1}`}
						className={cls.circleImage}
						style={{ position: 'absolute', width: '100%' }}
						animate={{
							rotate: rotateAmount !== 0 ? rotateAmount : 0,
							scale: isFirst ? [1, 1.1, 1] : 1,
						}}
						transition={{
							rotate: rotateAmount !== 0 ? {
								duration: duration,
								repeat: Infinity,
								ease: "linear",
								repeatType: "loop",
							} : undefined,
							scale: isFirst ? {
								duration: 2,
								repeat: Infinity,
								ease: "easeInOut",
								repeatType: "loop",
							} : undefined,
						}}
						whileHover={!prefersReducedMotion ? { scale: 1.2 } : undefined}
					/>
				);
			})}
		</div>
	);
};

export default CircleAnim;