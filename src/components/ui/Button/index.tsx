'use client'
import React, { ComponentProps, CSSProperties, ReactNode, useCallback } from 'react';
import cls from './style.module.scss';
import clsx from 'clsx';
import { motion, MotionProps } from 'motion/react';

export type T_ButtonProps = ComponentProps<typeof motion.button> & {
	className?: string | string[];
	children?: ReactNode;
	style?: CSSProperties;
	adaptive?: boolean;
	color?: 'primary' | 'heavy' | 'plain';
	size?: 'normal' | 'small';
	w?: string;
	href?: string;
	toScroll?: string; // ID элемента для скролла (без #)
	scrollOffset?: number; // Отступ сверху (например, для фиксированной шапки)
}

export const Button = ({
	children,
	color = 'primary',
	adaptive = true,
	size = 'normal',
	w = 'fit-content',
	className,
	style,
	href,
	toScroll,
	scrollOffset = 0,
	onClick,
	...props
}: T_ButtonProps) => {

	const handleScroll = useCallback((e: React.MouseEvent) => {
		if (toScroll) {
			e.preventDefault();

			const element = document.querySelector(toScroll);

			if (element) {
				const elementPosition = element.getBoundingClientRect().top + window.scrollY;
				const offsetPosition = elementPosition - scrollOffset;

				window.scrollTo({
					top: offsetPosition,
					behavior: 'smooth'
				});
			} else {
				console.warn(`Element with id "${toScroll}" not found`);
			}
		}
	}, [toScroll, scrollOffset]);

	const handleClick = (e: any) => {
		// Вызываем переданный onClick если есть
		if (onClick) onClick(e);

		// Обработка href (обычная навигация)
		if (href) {
			location.hash = href;
		}

		// Обработка кастомного скролла
		if (toScroll) {
			handleScroll(e);
		}
	};

	const ops = {
		...props,
		style: {
			...style,
			"--default-width": w,
		} as CSSProperties,
		className: clsx(className, cls.btn),
		"data-color": color,
		"data-size": size,
		whileTap: { scale: 0.95 },
		onClick: handleClick,
		// Если это ссылка с toScroll, предотвращаем стандартное поведение
		...(toScroll && { href: undefined })
	} as MotionProps

	return (<>
		{href && !toScroll && <motion.a {...ops} href={href}>{children}</motion.a>}
		{toScroll && <motion.button {...ops}>{children}</motion.button>}
		{!href && !toScroll && <motion.button {...ops}>{children}</motion.button>}
	</>)
}

export default Button;