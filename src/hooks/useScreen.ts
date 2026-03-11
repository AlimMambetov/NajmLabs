import { useState, useEffect } from 'react';

export type DeviceType = 'mobile' | 'tablet' | 'laptop' | 'desktop';

interface ScreenSize {
	width: number;
	height: number;
	isMobile: boolean;
	isTablet: boolean;
	isLaptop: boolean;
	isDesktop: boolean;
	isTouch: boolean;
	deviceType: DeviceType;
}

const BREAKPOINTS = {
	mobile: 768,
	tablet: 1024,
	laptop: 1440,
	desktop: 1920,
} as const;

export const useScreen = (debounceDelay: number = 100): ScreenSize => {
	const [screenSize, setScreenSize] = useState<ScreenSize>({
		width: typeof window !== 'undefined' ? window.innerWidth : 0,
		height: typeof window !== 'undefined' ? window.innerHeight : 0,
		isMobile: false,
		isTablet: false,
		isLaptop: false,
		isDesktop: false,
		isTouch: true,
		deviceType: 'mobile',
	});

	useEffect(() => {
		const getDeviceType = (width: number): DeviceType => {
			if (width < BREAKPOINTS.mobile) return 'mobile';
			if (width < BREAKPOINTS.tablet) return 'tablet';
			if (width < BREAKPOINTS.laptop) return 'laptop';
			return 'desktop';
		};

		const updateScreenSize = () => {
			const width = window.innerWidth;
			const height = window.innerHeight;
			const deviceType = getDeviceType(width);

			setScreenSize({
				width,
				height,
				isMobile: deviceType === 'mobile',
				isTablet: deviceType === 'tablet',
				isLaptop: deviceType === 'laptop',
				isDesktop: deviceType === 'desktop',
				isTouch: deviceType === 'mobile' || deviceType === 'tablet',
				deviceType,
			});
		};

		let timeoutId: NodeJS.Timeout;
		const handleResize = () => {
			clearTimeout(timeoutId);
			timeoutId = setTimeout(updateScreenSize, debounceDelay);
		};

		updateScreenSize();

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
			clearTimeout(timeoutId);
		};
	}, [debounceDelay]);

	return screenSize;
};

// Дополнительные утилиты для удобства
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

export const useIsTouch = (): boolean => {
	const { isTouch } = useScreen();
	return isTouch;
};

export const useDeviceType = (): DeviceType => {
	const { deviceType } = useScreen();
	return deviceType;
};