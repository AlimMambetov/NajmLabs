// animations/rotate.ts
import { RotateOptions } from '../types';
import { DEFAULTS } from '../config';
import { mergeWithDefaults } from '../utils';

export function rotateIn(options?: RotateOptions) {
	const {
		duration,
		delay,
		ease,
		from,
		to,
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
			from: DEFAULTS.rotateFrom,
			to: DEFAULTS.rotateTo,
			mode: DEFAULTS.mode,
			asVariant: DEFAULTS.asVariant,
			isActive: DEFAULTS.isActive,
			viewport: {
				once: DEFAULTS.viewportOnce,
				amount: DEFAULTS.viewportAmount,
				margin: DEFAULTS.viewportMargin,
			},
		} as RotateOptions
	);

	const transition = { duration, delay, ease };

	if (asVariant) {
		return {
			variants: {
				hidden: { rotate: from, opacity: 0 },
				visible: { rotate: to, opacity: 1, transition },
			},
		};
	}

	switch (mode) {
		case 'view':
			return {
				initial: { rotate: from, opacity: 0 },
				whileInView: { rotate: to, opacity: 1 },
				viewport,
				transition,
			};

		case 'animate':
			return {
				initial: { rotate: from, opacity: 0 },
				animate: { rotate: to, opacity: 1 },
				transition,
			};

		case 'state':
			return {
				initial: { rotate: from, opacity: 0 },
				animate: isActive
					? { rotate: to, opacity: 1 }
					: { rotate: from, opacity: 0 },
				transition,
			};

		case 'presence':
			return {
				initial: { rotate: from, opacity: 0 },
				animate: { rotate: to, opacity: 1 },
				exit: { rotate: from, opacity: 0 },
				transition,
			};

		default:
			return {};
	}
}

export function rotateOut(options?: RotateOptions) {
	const {
		duration,
		delay,
		ease,
		from,
		to,
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
			from: DEFAULTS.rotateTo,
			to: DEFAULTS.rotateFrom,
			mode: DEFAULTS.mode,
			asVariant: DEFAULTS.asVariant,
			isActive: DEFAULTS.isActive,
			viewport: {
				once: DEFAULTS.viewportOnce,
				amount: DEFAULTS.viewportAmount,
				margin: DEFAULTS.viewportMargin,
			},
		} as RotateOptions
	);

	const transition = { duration, delay, ease };

	if (asVariant) {
		return {
			variants: {
				hidden: { rotate: from, opacity: 1 },
				visible: { rotate: to, opacity: 0, transition },
			},
		};
	}

	switch (mode) {
		case 'view':
			return {
				initial: { rotate: from, opacity: 1 },
				whileInView: { rotate: to, opacity: 0 },
				viewport,
				transition,
			};

		case 'animate':
			return {
				initial: { rotate: from, opacity: 1 },
				animate: { rotate: to, opacity: 0 },
				transition,
			};

		case 'state':
			return {
				initial: { rotate: from, opacity: 1 },
				animate: isActive
					? { rotate: to, opacity: 0 }
					: { rotate: from, opacity: 1 },
				transition,
			};

		case 'presence':
			return {
				initial: { rotate: from, opacity: 1 },
				animate: { rotate: from, opacity: 1 },
				exit: { rotate: to, opacity: 0 },
				transition,
			};

		default:
			return {};
	}
}

export function spin(options?: RotateOptions) {
	const {
		duration,
		delay,
		ease,
		mode,
		asVariant,
		isActive,
		viewport,
	} = mergeWithDefaults(
		options,
		{
			duration: 1,
			delay: DEFAULTS.delay,
			ease: 'linear',
			mode: DEFAULTS.mode,
			asVariant: DEFAULTS.asVariant,
			isActive: DEFAULTS.isActive,
			viewport: {
				once: DEFAULTS.viewportOnce,
				amount: DEFAULTS.viewportAmount,
				margin: DEFAULTS.viewportMargin,
			},
		} as RotateOptions
	);

	const transition = {
		duration,
		delay,
		ease,
		repeat: Infinity,
		repeatType: 'loop' as const,
	};

	if (asVariant) {
		return {
			variants: {
				hidden: { rotate: 0 },
				visible: { rotate: 360, transition },
			},
		};
	}

	switch (mode) {
		case 'view':
			return {
				initial: { rotate: 0 },
				whileInView: { rotate: 360 },
				viewport,
				transition,
			};

		case 'animate':
			return {
				initial: { rotate: 0 },
				animate: { rotate: 360 },
				transition,
			};

		case 'state':
			return {
				initial: { rotate: 0 },
				animate: isActive ? { rotate: 360 } : { rotate: 0 },
				transition,
			};

		default:
			return {
				animate: { rotate: 360 },
				transition,
			};
	}
}