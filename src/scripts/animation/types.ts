// types.ts
import { TargetAndTransition, Transition, Easing as FramerEasing, Variants } from 'framer-motion';

// ===== Базовые типы =====

export type Direction = 'up' | 'down' | 'left' | 'right';
export type Easing = FramerEasing;
export type AnimationMode = 'view' | 'animate' | 'state' | 'presence';

// ===== Настройки viewport =====

export interface ViewportOptions {
	/** Сработать только один раз */
	once?: boolean;
	/** Порог видимости (0-1) */
	amount?: number;
	/** Отступ (например '-100px') */
	margin?: string;
}

// ===== Базовые опции для всех анимаций =====

export interface BaseAnimationOptions {
	/** Длительность анимации в секундах */
	duration?: number;
	/** Задержка перед началом в секундах */
	delay?: number;
	/** Кривая сглаживания */
	ease?: Easing;
	/** Режим работы анимации */
	mode?: AnimationMode;
	/** Использовать как variant (зависит от родительской секции) */
	asVariant?: boolean;
	/** Для mode: 'state' - активна ли анимация */
	isActive?: boolean;
	/** Для mode: 'view' - настройки viewport */
	viewport?: ViewportOptions;
}

// ===== Опции для конкретных анимаций =====

export interface FadeOptions extends BaseAnimationOptions {
	/** Начальная прозрачность (0-1) */
	from?: number;
	/** Конечная прозрачность (0-1) */
	to?: number;
}

export interface DirectionalOptions extends BaseAnimationOptions {
	/** Направление движения */
	direction?: Direction;
	/** Расстояние в px или '%' */
	distance?: number | string;
}

export interface ScaleOptions extends BaseAnimationOptions {
	/** Начальный масштаб (0-1) */
	from?: number;
	/** Конечный масштаб */
	to?: number;
}

export interface RotateOptions extends BaseAnimationOptions {
	/** Начальный угол в градусах */
	from?: number;
	/** Конечный угол в градусах */
	to?: number;
}

export interface FlipOptions extends BaseAnimationOptions {
	/** Ось вращения: 'X' или 'Y' */
	axis?: 'X' | 'Y';
	/** Начальный угол */
	from?: number;
	/** Конечный угол */
	to?: number;
	/** Перспектива для 3D эффекта */
	perspective?: number;
}

// ===== Возвращаемые типы =====

export interface MotionProps {
	initial?: TargetAndTransition;
	animate?: TargetAndTransition;
	exit?: TargetAndTransition;
	whileInView?: TargetAndTransition;
	whileHover?: TargetAndTransition;
	whileTap?: TargetAndTransition;
	transition?: Transition;
	viewport?: ViewportOptions;
	variants?: Variants;
}

export interface SectionViewOptions {
	/** Сработать один раз */
	once?: boolean;
	/** Порог видимости */
	amount?: number;
	/** Отступ */
	margin?: string;
	/** Задержка между дочерними элементами */
	staggerChildren?: number;
	/** Задержка перед первым элементом */
	delayChildren?: number;
}