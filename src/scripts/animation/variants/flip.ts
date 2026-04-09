// animations/flip.ts
import { FlipOptions } from '../types';
import { DEFAULTS } from '../config';
import { mergeWithDefaults, getTransformValue } from '../utils';

// Расширяем типы
export type FlipDirection = 'left' | 'right' | 'up' | 'down';

export interface ExtendedFlipOptions extends FlipOptions {
	/** Сторона флипа */
	flipDirection?: FlipDirection;
}

export function flipIn(options?: ExtendedFlipOptions) {
	const {
		duration,
		delay,
		ease,
		axis,
		from,
		to,
		perspective,
		flipDirection = 'right',
		mode,
		asVariant,
		isActive,
		viewport,
	} = mergeWithDefaults(
		options,
		{
			duration: DEFAULTS.duration,
			delay: DEFAULTS.delay,
			ease: DEFAULTS.ease,
			axis: 'Y' as const,
			from: DEFAULTS.flipFrom,
			to: DEFAULTS.flipTo,
			perspective: DEFAULTS.flipPerspective,
			flipDirection: 'right' as FlipDirection,
			mode: DEFAULTS.mode,
			asVariant: DEFAULTS.asVariant,
			isActive: DEFAULTS.isActive,
			viewport: {
				once: DEFAULTS.viewportOnce,
				amount: DEFAULTS.viewportAmount,
				margin: DEFAULTS.viewportMargin,
			},
		} as ExtendedFlipOptions
	);

	// Определяем знак угла в зависимости от направления
	const getAngle = (baseAngle: number): number => {
		if (axis === 'Y') {
			// Для Y: left = отрицательный, right = положительный
			return flipDirection === 'left' ? -Math.abs(baseAngle) : Math.abs(baseAngle);
		} else {
			// Для X: up = отрицательный, down = положительный
			return flipDirection === 'up' ? -Math.abs(baseAngle) : Math.abs(baseAngle);
		}
	};

	const transition = { duration, delay, ease };
	const hiddenTransform = getTransformValue(axis!, getAngle(from!), perspective);
	const visibleTransform = getTransformValue(axis!, getAngle(to!), perspective);

	if (asVariant) {
		return {
			variants: {
				hidden: { transform: hiddenTransform, opacity: 0 },
				visible: { transform: visibleTransform, opacity: 1, transition },
			},
		};
	}

	switch (mode) {
		case 'view':
			return {
				initial: { transform: hiddenTransform, opacity: 0 },
				whileInView: { transform: visibleTransform, opacity: 1 },
				viewport,
				transition,
			};

		case 'animate':
			return {
				initial: { transform: hiddenTransform, opacity: 0 },
				animate: { transform: visibleTransform, opacity: 1 },
				transition,
			};

		case 'state':
			return {
				initial: { transform: hiddenTransform, opacity: 0 },
				animate: isActive
					? { transform: visibleTransform, opacity: 1 }
					: { transform: hiddenTransform, opacity: 0 },
				transition,
			};

		case 'presence':
			return {
				initial: { transform: hiddenTransform, opacity: 0 },
				animate: { transform: visibleTransform, opacity: 1 },
				exit: { transform: hiddenTransform, opacity: 0 },
				transition,
			};

		default:
			return {};
	}
}

export function flipOut(options?: ExtendedFlipOptions) {
	const {
		duration,
		delay,
		ease,
		axis,
		from,
		to,
		perspective,
		flipDirection = 'left',
		mode,
		asVariant,
		isActive,
		viewport,
	} = mergeWithDefaults(
		options,
		{
			duration: DEFAULTS.duration,
			delay: DEFAULTS.delay,
			ease: DEFAULTS.ease,
			axis: 'Y' as const,
			from: DEFAULTS.flipTo,
			to: DEFAULTS.flipFrom,
			perspective: DEFAULTS.flipPerspective,
			flipDirection: 'left' as FlipDirection,
			mode: DEFAULTS.mode,
			asVariant: DEFAULTS.asVariant,
			isActive: DEFAULTS.isActive,
			viewport: {
				once: DEFAULTS.viewportOnce,
				amount: DEFAULTS.viewportAmount,
				margin: DEFAULTS.viewportMargin,
			},
		} as ExtendedFlipOptions
	);

	const getAngle = (baseAngle: number): number => {
		if (axis === 'Y') {
			return flipDirection === 'left' ? -Math.abs(baseAngle) : Math.abs(baseAngle);
		} else {
			return flipDirection === 'up' ? -Math.abs(baseAngle) : Math.abs(baseAngle);
		}
	};

	const transition = { duration, delay, ease };
	const hiddenTransform = getTransformValue(axis!, getAngle(from!), perspective);
	const visibleTransform = getTransformValue(axis!, getAngle(to!), perspective);

	if (asVariant) {
		return {
			variants: {
				hidden: { transform: hiddenTransform, opacity: 1 },
				visible: { transform: visibleTransform, opacity: 0, transition },
			},
		};
	}

	switch (mode) {
		case 'view':
			return {
				initial: { transform: hiddenTransform, opacity: 1 },
				whileInView: { transform: visibleTransform, opacity: 0 },
				viewport,
				transition,
			};

		case 'animate':
			return {
				initial: { transform: hiddenTransform, opacity: 1 },
				animate: { transform: visibleTransform, opacity: 0 },
				transition,
			};

		case 'state':
			return {
				initial: { transform: hiddenTransform, opacity: 1 },
				animate: isActive
					? { transform: visibleTransform, opacity: 0 }
					: { transform: hiddenTransform, opacity: 1 },
				transition,
			};

		case 'presence':
			return {
				initial: { transform: hiddenTransform, opacity: 1 },
				animate: { transform: hiddenTransform, opacity: 1 },
				exit: { transform: visibleTransform, opacity: 0 },
				transition,
			};

		default:
			return {};
	}
}

// Сокращения для flip по X
export function flipXIn(options?: Omit<ExtendedFlipOptions, 'axis'>) {
	return flipIn({ ...options, axis: 'X' });
}

export function flipXOut(options?: Omit<ExtendedFlipOptions, 'axis'>) {
	return flipOut({ ...options, axis: 'X' });
}

// Сокращения для flip по Y
export function flipYIn(options?: Omit<ExtendedFlipOptions, 'axis'>) {
	return flipIn({ ...options, axis: 'Y' });
}

export function flipYOut(options?: Omit<ExtendedFlipOptions, 'axis'>) {
	return flipOut({ ...options, axis: 'Y' });
}