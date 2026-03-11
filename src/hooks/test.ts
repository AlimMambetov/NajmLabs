import { useState, useEffect, useRef, useCallback } from 'react';

// Типы для брейкпоинтов
export type DeviceType = 'mobile' | 'tablet' | 'laptop' | 'desktop';

// Интерфейс для возвращаемых значений
interface ScreenSize {
	width: number;
	height: number;
	isMobile: boolean;
	isTablet: boolean;
	isLaptop: boolean;
	isDesktop: boolean;
	deviceType: DeviceType;
	isTouch: boolean;
}

// Конфигурация брейкпоинтов
const BREAKPOINTS = {
	mobile: 768,
	tablet: 1024,
	laptop: 1440,
	desktop: 1920,
} as const;

// Мемоизированная функция для определения типа устройства
const getDeviceType = (width: number): DeviceType => {
	if (width < BREAKPOINTS.mobile) return 'mobile';
	if (width < BREAKPOINTS.tablet) return 'tablet';
	if (width < BREAKPOINTS.laptop) return 'laptop';
	return 'desktop';
};

// Хук для отслеживания размеров экрана
export const useScreen = (debounceDelay: number = 100): ScreenSize => {
	const [screenSize, setScreenSize] = useState<ScreenSize>(() => {
		const width = typeof window !== 'undefined' ? window.innerWidth : 0;
		const height = typeof window !== 'undefined' ? window.innerHeight : 0;
		const deviceType = getDeviceType(width);

		return {
			width,
			height,
			isMobile: deviceType === 'mobile',
			isTablet: deviceType === 'tablet',
			isLaptop: deviceType === 'laptop',
			isDesktop: deviceType === 'desktop',
			deviceType,
			isTouch: deviceType === 'mobile' || deviceType === 'tablet', // Добавляем isTouch
		};
	});

	const timeoutRef = useRef<NodeJS.Timeout>(null);

	// Мемоизированная функция обновления размеров
	const updateScreenSize = useCallback(() => {
		const width = window.innerWidth;
		const height = window.innerHeight;
		const deviceType = getDeviceType(width);

		setScreenSize(prev => {
			// Проверяем, действительно ли изменились значения
			if (
				prev.width === width &&
				prev.height === height &&
				prev.deviceType === deviceType
			) {
				return prev;
			}

			return {
				width,
				height,
				isMobile: deviceType === 'mobile',
				isTablet: deviceType === 'tablet',
				isLaptop: deviceType === 'laptop',
				isDesktop: deviceType === 'desktop',
				deviceType,
				isTouch: deviceType === 'mobile' || deviceType === 'tablet', // Добавляем isTouch
			};
		});
	}, []);

	// Мемоизированный обработчик resize с дебаунсом
	const handleResize = useCallback(() => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}

		timeoutRef.current = setTimeout(updateScreenSize, debounceDelay);
	}, [debounceDelay, updateScreenSize]);

	useEffect(() => {
		// Проверяем, что мы в браузерном окружении
		if (typeof window === 'undefined') {
			return;
		}

		// Используем passive event listener для лучшей производительности
		window.addEventListener('resize', handleResize, { passive: true });

		// Очистка
		return () => {
			window.removeEventListener('resize', handleResize);
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, [handleResize]);

	return screenSize;
};

// селекторы для отдельных свойств
export const useIsMobile = (): boolean => {
	const { isMobile } = useScreen();
	return isMobile;
};

export const useIsTablet = (): boolean => {
	const { isTablet } = useScreen();
	return isTablet;
};

export const useIsLaptop = (): boolean => {
	const { isLaptop } = useScreen();
	return isLaptop;
};

export const useIsDesktop = (): boolean => {
	const { isDesktop } = useScreen();
	return isDesktop;
};

export const useDeviceType = (): DeviceType => {
	const { deviceType } = useScreen();
	return deviceType;
};

export const useIsTouch = (): boolean => {
	const { isTouch } = useScreen();
	return isTouch;
};

export const useBreakpoint = (breakpoint: number): boolean => {
	const { width } = useScreen();
	return width >= breakpoint;
};