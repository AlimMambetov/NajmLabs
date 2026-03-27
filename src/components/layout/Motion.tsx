'use client'

import React, { forwardRef, ElementType } from 'react';
import { motion, MotionProps } from 'framer-motion';

// Единый массив со всеми элементами
const MOTION_ELEMENTS = [
	'div', 'header', 'main', 'section', 'article', 'footer', 'nav', 'aside',
	'form', 'fieldset', 'details', 'summary', 'figure', 'figcaption', 'address',
	'ul', 'ol', 'li', 'p', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
	'button', 'a'
] as const;

type MotionElement = typeof MOTION_ELEMENTS[number];

interface MotionComponentProps extends MotionProps {
	as?: MotionElement;
	children?: React.ReactNode;
	className?: string;
	style?: React.CSSProperties;
}

// Динамически создаем объект с motion компонентами из массива
const motionComponents = MOTION_ELEMENTS.reduce((acc, element) => {
	acc[element] = motion[element as keyof typeof motion];
	return acc;
}, {} as Record<MotionElement, ElementType>);

export const Motion = forwardRef<HTMLElement, MotionComponentProps>(
	({ as = 'div', children, ...props }, ref) => {
		const Component = motionComponents[as];

		return (
			<Component ref={ref} {...props}>
				{children}
			</Component>
		);
	}
);

Motion.displayName = 'Motion';

export default Motion;