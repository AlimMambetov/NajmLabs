// utils.ts
import { Direction, SectionViewOptions, MotionProps } from './types';
import { DEFAULTS } from './config';

// ===== Получение смещения по направлению =====

export function getOffsetByDirection(
	direction: Direction,
	distance: number | string = DEFAULTS.distance
): { x?: number | string; y?: number | string } {
	const value = typeof distance === 'number' ? distance : distance;

	switch (direction) {
		case 'up':
			return { y: typeof value === 'number' ? value : `-${value}` };
		case 'down':
			return { y: typeof value === 'number' ? -value : value };
		case 'left':
			return { x: typeof value === 'number' ? value : `-${value}` };
		case 'right':
			return { x: typeof value === 'number' ? -value : value };
		default:
			return {};
	}
}

// ===== Форматирование значения для CSS =====

export function formatValue(value: number | string): string | number {
	if (typeof value === 'number') {
		return value;
	}
	if (typeof value === 'string' && (value.includes('%') || value.includes('px') || value.includes('vw') || value.includes('vh'))) {
		return value;
	}
	return value;
}

// ===== Слияние опций с дефолтами =====

export function mergeWithDefaults<T extends Record<string, any>>(
	options: T | undefined,
	defaults: T
): T {
	if (!options) return defaults;

	return {
		...defaults,
		...options,
		viewport: options.viewport ? {
			...defaults.viewport,
			...options.viewport,
		} : defaults.viewport,
	};
}

// ===== Получение значений для rotate/flip =====

export function getTransformValue(
	axis: 'X' | 'Y',
	angle: number,
	perspective?: number
): string {
	const baseTransform = `rotate${axis}(${angle}deg)`;

	if (perspective !== undefined) {
		return `perspective(${perspective}px) ${baseTransform}`;
	}

	return baseTransform;
}

// ===== Проверка на reduced motion =====

export function shouldReduceMotion(
	prefersReducedMotion: boolean | null,
	respectUserPreference: boolean = true
): boolean {
	return respectUserPreference && prefersReducedMotion === true;
}

// ===== Задержка для stagger эффектов =====

export function getStaggerDelay(
	index: number,
	baseDelay: number = 0.1
): number {
	return index * baseDelay;
}

// ===== Случайная задержка =====

export function getRandomDelay(
	min: number = 0,
	max: number = 0.5
): number {
	return Math.random() * (max - min) + min;
}

// ===== sectionViewOps - хелпер для секций =====

export function sectionViewOps(options?: SectionViewOptions) {
	const {
		once = DEFAULTS.viewportOnce,
		amount = DEFAULTS.viewportAmount,
		margin = DEFAULTS.viewportMargin,
		staggerChildren = DEFAULTS.staggerChildren,
		delayChildren = DEFAULTS.delayChildren,
	} = options || {};

	return {
		initial: 'hidden',
		whileInView: 'visible',
		viewport: { once, amount, margin },
		variants: {
			hidden: {},
			visible: {
				transition: {
					staggerChildren,
					delayChildren,
				},
			},
		},
	};
}

// ===== Создание вариантов для зависимых анимаций =====

export function createVariants<T>(
	hiddenProps: T,
	visibleProps: T,
	transition: { duration: number; delay: number; ease: any }
) {
	return {
		hidden: {
			...hiddenProps,
			transition: { duration: 0, delay: 0 }, // Мгновенно скрываем
		},
		visible: {
			...visibleProps,
			transition,
		},
	};
}