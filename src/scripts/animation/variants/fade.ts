// animations/fade.ts
import { FadeOptions } from '../types';
import { DEFAULTS } from '../config';
import { mergeWithDefaults } from '../utils';

export function fadeIn(options?: FadeOptions) {
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
			from: DEFAULTS.fadeFrom,
			to: DEFAULTS.fadeTo,
			mode: DEFAULTS.mode,
			asVariant: DEFAULTS.asVariant,
			isActive: DEFAULTS.isActive,
			viewport: {
				once: DEFAULTS.viewportOnce,
				amount: DEFAULTS.viewportAmount,
				margin: DEFAULTS.viewportMargin,
			},
		} as FadeOptions
	);

	const transition = { duration, delay, ease };

	// Режим варианта (зависит от родительской секции)
	if (asVariant) {
		return {
			variants: {
				hidden: { opacity: from },
				visible: { opacity: to, transition },
			},
		};
	}

	// Обычные режимы
	switch (mode) {
		case 'view':
			return {
				initial: { opacity: from },
				whileInView: { opacity: to },
				viewport,
				transition,
			};

		case 'animate':
			return {
				initial: { opacity: from },
				animate: { opacity: to },
				transition,
			};

		case 'state':
			return {
				initial: { opacity: from },
				animate: { opacity: isActive ? to : from },
				transition,
			};

		case 'presence':
			return {
				initial: { opacity: from },
				animate: { opacity: to },
				exit: { opacity: from },
				transition,
			};

		default:
			return {};
	}
}

export function fadeOut(options?: FadeOptions) {
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
			from: DEFAULTS.fadeTo,
			to: DEFAULTS.fadeFrom,
			mode: DEFAULTS.mode,
			asVariant: DEFAULTS.asVariant,
			isActive: DEFAULTS.isActive,
			viewport: {
				once: DEFAULTS.viewportOnce,
				amount: DEFAULTS.viewportAmount,
				margin: DEFAULTS.viewportMargin,
			},
		} as FadeOptions
	);

	const transition = { duration, delay, ease };

	if (asVariant) {
		return {
			variants: {
				hidden: { opacity: from },
				visible: { opacity: to, transition },
			},
		};
	}

	switch (mode) {
		case 'view':
			return {
				initial: { opacity: from },
				whileInView: { opacity: to },
				viewport,
				transition,
			};

		case 'animate':
			return {
				initial: { opacity: from },
				animate: { opacity: to },
				transition,
			};

		case 'state':
			return {
				initial: { opacity: from },
				animate: { opacity: isActive ? to : from },
				transition,
			};

		case 'presence':
			return {
				initial: { opacity: from },
				animate: { opacity: to },
				exit: { opacity: from },
				transition,
			};

		default:
			return {};
	}
}