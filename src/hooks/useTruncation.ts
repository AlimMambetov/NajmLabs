import { useState, useRef, useEffect } from 'react';

interface UseTruncationOptions {
	enabled?: boolean;
}

export const useTruncation = <T extends HTMLElement = HTMLElement>(
	options: UseTruncationOptions = {}
) => {
	const { enabled = true } = options;
	const [isTruncated, setIsTruncated] = useState(false);
	const ref = useRef<T>(null);

	useEffect(() => {
		if (!enabled) return;

		const element = ref.current;
		if (!element) return;

		const checkTruncation = () => {
			const newIsTruncated = element.scrollWidth > element.clientWidth;
			setIsTruncated(prev => prev !== newIsTruncated ? newIsTruncated : prev);
		};

		// Первоначальная проверка с задержкой для применения стилей
		const rafId = requestAnimationFrame(() => {
			checkTruncation();
		});

		// Наблюдатель за изменением размера
		const resizeObserver = new ResizeObserver(checkTruncation);
		resizeObserver.observe(element);

		return () => {
			cancelAnimationFrame(rafId);
			resizeObserver.disconnect();
		};
	}, [enabled]);

	return { ref, isTruncated };
};