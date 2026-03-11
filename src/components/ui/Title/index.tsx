'use client'
import React from 'react'
import cls from './style.module.scss'
import { motion, MotionProps } from 'motion/react'
import clsx from 'clsx'


type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

// Используем ComponentPropsWithoutRef для получения правильных HTML атрибутов
export type T_TitleProps = {
	size?: HeadingLevel;
	decorLine?: boolean;
} & MotionProps &
	Omit<React.ComponentPropsWithoutRef<'h1'>, keyof MotionProps | 'size' | 'decorLine'> // Исключаем конфликтующие пропсы

const headingTags = {
	1: motion.h1,
	2: motion.h2,
	3: motion.h3,
	4: motion.h4,
	5: motion.h5,
	6: motion.h6,
} as const

export const Title = ({
	children,
	size = 1,
	decorLine = false,
	className,
	...props // Убираем style из деструктуризации
}: T_TitleProps) => {
	const MotionHeading = headingTags[size]

	return (
		<MotionHeading
			{...props}
			data-line={decorLine || null}
			className={clsx(className, cls.title)}
		>
			{children}
		</MotionHeading>
	)
}