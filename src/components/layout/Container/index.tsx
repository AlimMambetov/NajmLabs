import React, { CSSProperties, ReactNode } from 'react';
import { HTMLMotionProps, motion } from 'framer-motion';
import cls from './style.module.scss';
import { useScreen } from '@/hooks';

interface ContainerProps extends HTMLMotionProps<'div'> {
	style?: CSSProperties;
	children?: ReactNode;
	full?: boolean;
}

const Container = ({
	children,
	className = '',
	style = {},
	full = false,
	...props
}: ContainerProps) => {
	const { adaptiveValue } = useScreen();
	const maxw = adaptiveValue({ desktop: 1200, laptop: 1000, tablet: 800, phone: 400 }, { unit: 'px' });
	const spacing = adaptiveValue({ desktop: 30, laptop: 25, tablet: 20, phone: 10 }, { unit: 'px' });

	return (
		<motion.div
			className={`${cls.container} ${full ? cls._full : ''} ${className}`}
			style={{
				"--max-w": maxw,
				"--spacing": spacing,
				...style,
			} as CSSProperties}
			{...props}
		>
			{children}
		</motion.div>
	);
};

export default Container;