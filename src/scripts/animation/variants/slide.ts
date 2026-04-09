// animations/slide.ts
import { DirectionalOptions } from '../types';
import { DEFAULTS } from '../config';
import { mergeWithDefaults, getOffsetByDirection } from '../utils';

export function slideIn(options?: DirectionalOptions) {
	const {
		duration,
		delay,
		ease,
		direction,
		distance,
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
			direction: 'up' as const,
			distance: DEFAULTS.distance,
			mode: DEFAULTS.mode,
			asVariant: DEFAULTS.asVariant,
			isActive: DEFAULTS.isActive,
			viewport: {
				once: DEFAULTS.viewportOnce,
				amount: DEFAULTS.viewportAmount,
				margin: DEFAULTS.viewportMargin,
			},
		} as DirectionalOptions
	);

	const offset = getOffsetByDirection(direction!, distance);
	const transition = { duration, delay, ease };

	if (asVariant) {
		return {
			variants: {
				hidden: { ...offset, opacity: 0 },
				visible: { x: 0, y: 0, opacity: 1, transition },
			},
		};
	}

	switch (mode) {
		case 'view':
			return {
				initial: { ...offset, opacity: 0 },
				whileInView: { x: 0, y: 0, opacity: 1 },
				viewport,
				transition,
			};

		case 'animate':
			return {
				initial: { ...offset, opacity: 0 },
				animate: { x: 0, y: 0, opacity: 1 },
				transition,
			};

		case 'state':
			return {
				initial: { ...offset, opacity: 0 },
				animate: isActive
					? { x: 0, y: 0, opacity: 1 }
					: { ...offset, opacity: 0 },
				transition,
			};

		case 'presence':
			return {
				initial: { ...offset, opacity: 0 },
				animate: { x: 0, y: 0, opacity: 1 },
				exit: { ...offset, opacity: 0 },
				transition,
			};

		default:
			return {};
	}
}

export function slideOut(options?: DirectionalOptions) {
	const {
		duration,
		delay,
		ease,
		direction,
		distance,
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
			direction: 'up' as const,
			distance: DEFAULTS.distance,
			mode: DEFAULTS.mode,
			asVariant: DEFAULTS.asVariant,
			isActive: DEFAULTS.isActive,
			viewport: {
				once: DEFAULTS.viewportOnce,
				amount: DEFAULTS.viewportAmount,
				margin: DEFAULTS.viewportMargin,
			},
		} as DirectionalOptions
	);

	const offset = getOffsetByDirection(direction!, distance);
	const transition = { duration, delay, ease };

	if (asVariant) {
		return {
			variants: {
				hidden: { x: 0, y: 0, opacity: 1 },
				visible: { ...offset, opacity: 0, transition },
			},
		};
	}

	switch (mode) {
		case 'view':
			return {
				initial: { x: 0, y: 0, opacity: 1 },
				whileInView: { ...offset, opacity: 0 },
				viewport,
				transition,
			};

		case 'animate':
			return {
				initial: { x: 0, y: 0, opacity: 1 },
				animate: { ...offset, opacity: 0 },
				transition,
			};

		case 'state':
			return {
				initial: { x: 0, y: 0, opacity: 1 },
				animate: isActive
					? { ...offset, opacity: 0 }
					: { x: 0, y: 0, opacity: 1 },
				transition,
			};

		case 'presence':
			return {
				initial: { x: 0, y: 0, opacity: 1 },
				animate: { x: 0, y: 0, opacity: 1 },
				exit: { ...offset, opacity: 0 },
				transition,
			};

		default:
			return {};
	}
}