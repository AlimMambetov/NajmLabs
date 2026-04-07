'use client'
import React, { forwardRef } from 'react';
import cls from './style.module.scss';
import { MotionProps } from "framer-motion";
import { Motion } from './Motion';

const GlassSVG = () => <svg style={{ display: 'none' }}>
	<filter
		id="glass-distortion"
		x="0%"
		y="0%"
		width="100%"
		height="100%"
		filterUnits="objectBoundingBox"
	>
		<feTurbulence
			type="fractalNoise"
			baseFrequency="0.01 0.01"
			numOctaves="1"
			seed="5"
			result="turbulence"
		/>

		<feComponentTransfer in="turbulence" result="mapped">
			<feFuncR type="gamma" amplitude="1" exponent="10" offset="0.5" />
			<feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
			<feFuncB type="gamma" amplitude="0" exponent="1" offset="0.5" />
		</feComponentTransfer>

		<feGaussianBlur in="turbulence" stdDeviation="3" result="softMap" />

		<feSpecularLighting
			in="softMap"
			surfaceScale="5"
			specularConstant="1"
			specularExponent="100"
			lightingColor="white"
			result="specLight"
		>
			<fePointLight x="-200" y="-200" z="300" />
		</feSpecularLighting>

		<feComposite
			in="specLight"
			operator="arithmetic"
			k1="0"
			k2="1"
			k3="1"
			k4="0"
			result="litImage"
		/>

		<feDisplacementMap
			in="SourceGraphic"
			in2="softMap"
			scale="150"
			xChannelSelector="R"
			yChannelSelector="G"
		/>
	</filter>
</svg>

// Расширяем все возможные HTML атрибуты и события
interface LiquidGlassProps extends Omit<MotionProps, 'style'> {
	as?: React.ElementType;
	children?: React.ReactNode;
	className?: string;
	style?: React.CSSProperties;
	// HTML события
	onClick?: React.MouseEventHandler;
	onSubmit?: React.FormEventHandler;
	onChange?: React.ChangeEventHandler;
	onFocus?: React.FocusEventHandler;
	onBlur?: React.FocusEventHandler;
	onKeyDown?: React.KeyboardEventHandler;
	onKeyUp?: React.KeyboardEventHandler;
	onMouseEnter?: React.MouseEventHandler;
	onMouseLeave?: React.MouseEventHandler;
	onScroll?: React.UIEventHandler;
	// Ссылка для a тега
	href?: string;
	target?: string;
	rel?: string;
	// Для кнопки
	type?: 'button' | 'submit' | 'reset';
	disabled?: boolean;
	// Для формы
	method?: string;
	action?: string;
	// Для инпутов
	value?: string;
	defaultValue?: string;
	placeholder?: string;
	required?: boolean;
	name?: string;
	id?: string;
	distortion?: boolean;
}

// Используем forwardRef для проброса ref
export const LiquidGlass = forwardRef<HTMLElement, LiquidGlassProps>(({
	as = 'div',
	children,
	className,
	style,
	distortion = true,
	...motionProps
}, ref) => {
	return (
		<Motion
			as={as as any}
			ref={ref} // Пробрасываем ref в Motion компонент
			style={style}
			{...motionProps}
			className={`${cls.wrap} ${className || ''}`}
			data-distortion={distortion}
		>
			{children}
			<div className={cls.effect} />
			{distortion && <GlassSVG />}
		</Motion>
	)
});

// Добавляем display name для отладки
LiquidGlass.displayName = 'LiquidGlass';

export default LiquidGlass;