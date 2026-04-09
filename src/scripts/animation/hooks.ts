// hooks.ts (исправленная версия)
import { useEffect, useState, useRef } from 'react';
import { useMotionValue, useSpring, useTransform, MotionValue } from 'framer-motion';

// ===== useReducedMotion =====

export function useReducedMotion(): boolean {
	const [prefersReduced, setPrefersReduced] = useState(false);

	useEffect(() => {
		const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

		setPrefersReduced(mediaQuery.matches);

		const handleChange = (e: MediaQueryListEvent) => {
			setPrefersReduced(e.matches);
		};

		mediaQuery.addEventListener('change', handleChange);

		return () => mediaQuery.removeEventListener('change', handleChange);
	}, []);

	return prefersReduced;
}

// ===== useScrollProgress =====

export function useScrollProgress(
	target: React.RefObject<HTMLElement>,
	offset: number = 0
): MotionValue<number> {
	const scrollY = useMotionValue(0);
	const progress = useTransform(scrollY, [offset, offset + 1], [0, 1]);

	useEffect(() => {
		const handleScroll = () => {
			if (target.current) {
				const rect = target.current.getBoundingClientRect();
				const scrollProgress = 1 - rect.bottom / window.innerHeight;
				scrollY.set(Math.max(0, Math.min(1, scrollProgress)));
			}
		};

		window.addEventListener('scroll', handleScroll);
		handleScroll();

		return () => window.removeEventListener('scroll', handleScroll);
	}, [target, scrollY]);

	return progress;
}

// ===== useParallax =====

export function useParallax(
	distance: number = 100,
	springConfig: { stiffness?: number; damping?: number } = {}
): MotionValue<number> {
	const { stiffness = 100, damping = 30 } = springConfig;

	const scrollY = useMotionValue(0);
	const springScrollY = useSpring(scrollY, { stiffness, damping });
	const y = useTransform(springScrollY, [0, 1], [0, distance]);

	useEffect(() => {
		const handleScroll = () => {
			const progress = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
			scrollY.set(progress);
		};

		window.addEventListener('scroll', handleScroll);
		handleScroll();

		return () => window.removeEventListener('scroll', handleScroll);
	}, [scrollY]);

	return y;
}

// ===== useMousePosition =====

export function useMousePosition(): { x: MotionValue<number>; y: MotionValue<number> } {
	const mouseX = useMotionValue(0);
	const mouseY = useMotionValue(0);

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			mouseX.set(e.clientX);
			mouseY.set(e.clientY);
		};

		window.addEventListener('mousemove', handleMouseMove);

		return () => window.removeEventListener('mousemove', handleMouseMove);
	}, [mouseX, mouseY]);

	return { x: mouseX, y: mouseY };
}

// ===== useElementSize =====

export function useElementSize<T extends HTMLElement>(): [
	React.RefObject<T | null>,
	{ width: number; height: number }
] {
	const ref = useRef<T>(null);
	const [size, setSize] = useState({ width: 0, height: 0 });

	useEffect(() => {
		if (!ref.current) return;

		const observer = new ResizeObserver((entries) => {
			const entry = entries[0];
			if (entry) {
				setSize({
					width: entry.contentRect.width,
					height: entry.contentRect.height,
				});
			}
		});

		observer.observe(ref.current);

		return () => observer.disconnect();
	}, []);

	return [ref, size];
}

// ===== useInView =====

export function useInView<T extends HTMLElement>(
	options: IntersectionObserverInit = {}
): [React.RefObject<T | null>, boolean] {
	const ref = useRef<T>(null);
	const [inView, setInView] = useState(false);

	useEffect(() => {
		if (!ref.current) return;

		const observer = new IntersectionObserver(([entry]) => {
			setInView(entry.isIntersecting);
		}, options);

		observer.observe(ref.current);

		return () => observer.disconnect();
	}, [options]);

	return [ref, inView];
}