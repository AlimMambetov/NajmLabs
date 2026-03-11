'use client'
import React from 'react';
import cls from './style.module.scss';
import clsx from 'clsx';
import { motion, MotionProps } from 'motion/react';

export type T_TextProps =
	React.ComponentProps<'p'> &
	React.ComponentProps<typeof motion.p> & {
		size?: 1 | 2 | 3 | 4;
	} & MotionProps;

export const Text = ({ children, style, className, size = 1, ...props }: T_TextProps) => {

	return (<>
		<motion.p
			{...props}
			className={clsx(className, cls.text)}
			data-size={size}
			style={{ ...style } as React.CSSProperties}
		>
			{children}
		</motion.p>
	</>)
}

export default Text;