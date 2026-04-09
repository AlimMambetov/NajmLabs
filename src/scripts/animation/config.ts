// config.ts
import { Easing } from './types';

// ===== Кастомные кривые сглаживания =====

export const EASINGS = {
	// Стандартные
	linear: 'linear',
	easeIn: 'easeIn',
	easeOut: 'easeOut',
	easeInOut: 'easeInOut',
	circIn: 'circIn',
	circOut: 'circOut',
	circInOut: 'circInOut',
	backIn: 'backIn',
	backOut: 'backOut',
	backInOut: 'backInOut',
	anticipate: 'anticipate',

	// Кастомные кривые (bezier)
	smooth: [0.25, 0.1, 0.25, 1] as Easing,
	bounce: [0.68, -0.55, 0.27, 1.55] as Easing,
	snappy: [0.2, 0.9, 0.1, 1] as Easing,
	elastic: [0.85, 0.02, 0.2, 1] as Easing,
	expo: [0.16, 1, 0.3, 1] as Easing,
} as const;

// ===== Дефолтные значения =====

export const DEFAULTS = {
	// Общие
	duration: 0.4,
	delay: 0,
	ease: EASINGS.smooth,
	mode: 'view' as const,
	asVariant: false,
	isActive: true,

	// Для направленных анимаций
	distance: 30,

	// Для scale
	scaleFrom: 0,
	scaleTo: 1,

	// Для rotate
	rotateFrom: 0,
	rotateTo: 360,

	// Для flip
	flipFrom: 180,
	flipTo: 0,
	flipPerspective: 1000,

	// Для fade
	fadeFrom: 0,
	fadeTo: 1,

	// Для viewport
	viewportOnce: true,
	viewportMargin: '0px',
	viewportAmount: 0.2,

	// Для секций
	staggerChildren: 0.1,
	delayChildren: 0,
} as const;

export type Config = typeof DEFAULTS;