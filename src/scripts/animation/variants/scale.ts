// animations/scale.ts
import { ScaleOptions } from '../types';
import { DEFAULTS } from '../config';
import { mergeWithDefaults } from '../utils';

export function scaleIn(options?: ScaleOptions) {
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
			from: DEFAULTS.scaleFrom,
			to: DEFAULTS.scaleTo,
			mode: DEFAULTS.mode,
			asVariant: DEFAULTS.asVariant,
			isActive: DEFAULTS.isActive,
			viewport: {
				once: DEFAULTS.viewportOnce,
				amount: DEFAULTS.viewportAmount,
				margin: DEFAULTS.viewportMargin,
			},
		} as ScaleOptions
	);

	const transition = { duration, delay, ease };
	const initialOpacity = from === 0 ? 0 : 1;

	if (asVariant) {
		return {
			variants: {
				hidden: { scale: from, opacity: initialOpacity },
				visible: { scale: to, opacity: 1, transition },
			},
		};
	}

	switch (mode) {
		case 'view':
			return {
				initial: { scale: from, opacity: initialOpacity },
				whileInView: { scale: to, opacity: 1 },
				viewport,
				transition,
			};

		case 'animate':
			return {
				initial: { scale: from, opacity: initialOpacity },
				animate: { scale: to, opacity: 1 },
				transition,
			};

		case 'state':
			return {
				initial: { scale: from, opacity: initialOpacity },
				animate: isActive
					? { scale: to, opacity: 1 }
					: { scale: from, opacity: initialOpacity },
				transition,
			};

		case 'presence':
			return {
				initial: { scale: from, opacity: initialOpacity },
				animate: { scale: to, opacity: 1 },
				exit: { scale: from, opacity: initialOpacity },
				transition,
			};

		default:
			return {};
	}
}

export function scaleOut(options?: ScaleOptions) {
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
			from: DEFAULTS.scaleTo,
			to: DEFAULTS.scaleFrom,
			mode: DEFAULTS.mode,
			asVariant: DEFAULTS.asVariant,
			isActive: DEFAULTS.isActive,
			viewport: {
				once: DEFAULTS.viewportOnce,
				amount: DEFAULTS.viewportAmount,
				margin: DEFAULTS.viewportMargin,
			},
		} as ScaleOptions
	);

	const transition = { duration, delay, ease };
	const targetOpacity = to === 0 ? 0 : 1;

	if (asVariant) {
		return {
			variants: {
				hidden: { scale: from, opacity: 1 },
				visible: { scale: to, opacity: targetOpacity, transition },
			},
		};
	}

	switch (mode) {
		case 'view':
			return {
				initial: { scale: from, opacity: 1 },
				whileInView: { scale: to, opacity: targetOpacity },
				viewport,
				transition,
			};

		case 'animate':
			return {
				initial: { scale: from, opacity: 1 },
				animate: { scale: to, opacity: targetOpacity },
				transition,
			};

		case 'state':
			return {
				initial: { scale: from, opacity: 1 },
				animate: isActive
					? { scale: to, opacity: targetOpacity }
					: { scale: from, opacity: 1 },
				transition,
			};

		case 'presence':
			return {
				initial: { scale: from, opacity: 1 },
				animate: { scale: from, opacity: 1 },
				exit: { scale: to, opacity: targetOpacity },
				transition,
			};

		default:
			return {};
	}
}

export function popIn(options?: ScaleOptions) {
	const {
		duration,
		delay,
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
			from: DEFAULTS.scaleFrom,
			to: DEFAULTS.scaleTo,
			mode: DEFAULTS.mode,
			asVariant: DEFAULTS.asVariant,
			isActive: DEFAULTS.isActive,
			viewport: {
				once: DEFAULTS.viewportOnce,
				amount: DEFAULTS.viewportAmount,
				margin: DEFAULTS.viewportMargin,
			},
		} as ScaleOptions
	);

	const transition = {
		duration,
		delay,
		type: 'spring' as const,
		stiffness: 300,
		damping: 20,
	};

	const initialOpacity = from === 0 ? 0 : 1;

	if (asVariant) {
		return {
			variants: {
				hidden: { scale: from, opacity: initialOpacity },
				visible: { scale: to, opacity: 1, transition },
			},
		};
	}

	switch (mode) {
		case 'view':
			return {
				initial: { scale: from, opacity: initialOpacity },
				whileInView: { scale: to, opacity: 1 },
				viewport,
				transition,
			};

		case 'animate':
			return {
				initial: { scale: from, opacity: initialOpacity },
				animate: { scale: to, opacity: 1 },
				transition,
			};

		case 'state':
			return {
				initial: { scale: from, opacity: initialOpacity },
				animate: isActive
					? { scale: to, opacity: 1 }
					: { scale: from, opacity: initialOpacity },
				transition,
			};

		case 'presence':
			return {
				initial: { scale: from, opacity: initialOpacity },
				animate: { scale: to, opacity: 1 },
				exit: { scale: from, opacity: initialOpacity },
				transition,
			};

		default:
			return {};
	}
}