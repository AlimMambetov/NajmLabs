'use client'

import React, { CSSProperties, ReactNode, createElement } from 'react';
import { motion } from 'framer-motion';
import cls from './style.module.scss';
import { useScreen } from '@/hooks';

const MOTION_ELEMENTS = [
	// Структурные
	'div',
	'section',
	'article',
	'main',
	'header',
	'footer',
	'nav',
	'aside',

	// Семантические
	'figure',
	'figcaption',
	'details',
	'summary',
	'address',

	// Формы
	'form',
	'fieldset',

	// Группировка
	'blockquote',
	'pre',
	'p',
	'ul',
	'ol',
	'li',
	'dl',
	'dt',
	'dd',
] as const;

type ContainerElement = typeof MOTION_ELEMENTS[number];

interface ContainerProps {
	style?: CSSProperties;
	children?: ReactNode;
	full?: boolean;
	as?: ContainerElement;
	className?: string;
	[key: string]: any;
}

// Автоматически создаем объект из массива
const motionComponents = MOTION_ELEMENTS.reduce((acc, element) => {
	acc[element] = motion[element as keyof typeof motion];
	return acc;
}, {} as Record<ContainerElement, any>);

export const Container = ({
	children,
	className = '',
	style = {},
	full = false,
	as = 'div',
	...props
}: ContainerProps) => {
	const { adaptiveValue } = useScreen();
	const maxw = adaptiveValue({ desktop: 1200, laptop: 1000, tablet: 800, phone: 400 }, { unit: 'px' });
	const spacing = adaptiveValue({ desktop: 30, laptop: 25, tablet: 20, phone: 10 }, { unit: 'px' });

	const MotionComponent = motionComponents[as];

	return createElement(MotionComponent, {
		className: `${cls.container} ${full ? cls._full : ''} ${className}`,
		style: {
			"--max-w": maxw,
			"--spacing": spacing,
			...style,
		} as CSSProperties,
		...props,
	}, children);
};

export default Container;