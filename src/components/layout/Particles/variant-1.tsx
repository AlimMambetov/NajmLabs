'use client'
import React, { useEffect, useRef } from 'react';

interface Particle {
	x: number;
	y: number;
	radius: number;
	speedX: number;
	speedY: number;
	opacity: number;
}

interface ShootingStar {
	x: number;
	y: number;
	length: number;
	speed: number;
	angle: number;
	opacity: number;
}

// ==================== ОБЪЕКТ С НАСТРОЙКАМИ ====================
const CONFIG = {
	// Настройки звездопада
	starShower: {
		enabled: true,
		minInterval: 0.3 * 60 * 1000,
		maxInterval: 3 * 60 * 1000,
		minStars: 2,
		maxStars: 6,
		minSpeed: 7,
		maxSpeed: 12,
		angleVariation: 0.25,
		xOffset: 100,
		yOffset: 60,
		delayBetweenStars: 0.2,
		minOpacity: 0.5,
		maxOpacity: 1.0,
	},

	// Настройки одиночных звезд
	singleStars: {
		enabled: true,
		spawnChance: 0.001,
		maxSimultaneous: 1,
		minOpacity: 0.3,
		maxOpacity: 1.0,
	},

	// Общие настройки для всех падающих звезд
	stars: {
		minSpeed: 8,
		maxSpeed: 14,
		minLength: 60,
		maxLength: 100,
		baseAngle: Math.PI / 4,
		angleVariation: 0.5,
		fadeSpeed: 0.008,
		tailWidth: 1.5,
		headRadius: 1.5,
	},

	// Настройки фона и обычных звезд
	background: {
		color: '#18072e',                // Цвет фона (темно-синий для примера)
		starColor: 'rgba(255, 255, 255, ', // Цвет обычных звезд
		constellationColor: 'rgba(150, 180, 255, ',
		starsCount: 250,
		fadeEffect: 0.3,
		starMinOpacity: 0.2,
		starMaxOpacity: 0.9,
		starMinRadius: 0.5,
		starMaxRadius: 2.0,
	},

	// Настройки созвездий
	constellations: {
		enabled: true,
		maxOpacity: 0.6,
		influenceRadius: 180,
		maxDistance: 120,
		lineWidth: 1,
		fadeSpeed: 0.05,
	},
};

export const Variant_1 = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const mousePos = useRef<{ x: number; y: number } | null>(null);
	const linesOpacity = useRef<number>(0);
	const lastShowerTime = useRef<number>(Date.now());
	const showerStarsQueue = useRef<ShootingStar[]>([]);
	const lastShowerStarTime = useRef<number>(0);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		let particles: Particle[] = [];
		let shootingStars: ShootingStar[] = [];
		let animationId: number;

		// Инициализация звезд с рандомной прозрачностью
		const initParticles = () => {
			particles = [];
			for (let i = 0; i < CONFIG.background.starsCount; i++) {
				const opacity = CONFIG.background.starMinOpacity +
					Math.random() * (CONFIG.background.starMaxOpacity - CONFIG.background.starMinOpacity);

				particles.push({
					x: Math.random() * canvas.width,
					y: Math.random() * canvas.height,
					radius: CONFIG.background.starMinRadius +
						Math.random() * (CONFIG.background.starMaxRadius - CONFIG.background.starMinRadius),
					speedX: (Math.random() - 0.5) * 0.1,
					speedY: (Math.random() - 0.5) * 0.05,
					opacity: opacity,
				});
			}
		};

		// Создание падающей звезды с рандомной прозрачностью
		const createShootingStar = (angle?: number, x?: number, y?: number, speed?: number, isFromShower: boolean = false) => {
			const finalAngle = angle !== undefined
				? angle
				: CONFIG.stars.baseAngle + (Math.random() - 0.5) * CONFIG.stars.angleVariation;

			let opacity;
			if (isFromShower) {
				opacity = CONFIG.starShower.minOpacity +
					Math.random() * (CONFIG.starShower.maxOpacity - CONFIG.starShower.minOpacity);
			} else {
				opacity = CONFIG.singleStars.minOpacity +
					Math.random() * (CONFIG.singleStars.maxOpacity - CONFIG.singleStars.minOpacity);
			}

			return {
				x: x !== undefined ? x : Math.random() * canvas.width,
				y: y !== undefined ? y : -10,
				length: CONFIG.stars.minLength + Math.random() * (CONFIG.stars.maxLength - CONFIG.stars.minLength),
				speed: speed !== undefined
					? speed
					: CONFIG.stars.minSpeed + Math.random() * (CONFIG.stars.maxSpeed - CONFIG.stars.minSpeed),
				angle: finalAngle,
				opacity: opacity,
			};
		};

		// Создание звездопада
		const createStarShower = () => {
			const starCount = CONFIG.starShower.minStars +
				Math.floor(Math.random() * (CONFIG.starShower.maxStars - CONFIG.starShower.minStars + 1));
			const baseAngle = CONFIG.stars.baseAngle + (Math.random() - 0.5) * CONFIG.starShower.angleVariation;
			const startX = Math.random() * canvas.width;
			const startY = -20 - Math.random() * 30;

			const stars: ShootingStar[] = [];

			for (let i = 0; i < starCount; i++) {
				const speedVariation = CONFIG.starShower.minSpeed + Math.random() * (CONFIG.starShower.maxSpeed - CONFIG.starShower.minSpeed);
				const xOffset = (Math.random() - 0.5) * CONFIG.starShower.xOffset;
				const yOffset = (Math.random() - 0.5) * CONFIG.starShower.yOffset;
				const angleVariation = (Math.random() - 0.5) * CONFIG.starShower.angleVariation;

				stars.push(createShootingStar(
					baseAngle + angleVariation,
					startX + xOffset,
					startY + yOffset - i * 15,
					speedVariation,
					true
				));
			}

			return stars;
		};

		// Рисование падающей звезды
		const drawShootingStar = (star: ShootingStar) => {
			const tailX = star.x - Math.cos(star.angle) * star.length;
			const tailY = star.y - Math.sin(star.angle) * star.length;

			const gradient = ctx.createLinearGradient(star.x, star.y, tailX, tailY);
			gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
			gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);

			ctx.beginPath();
			ctx.moveTo(star.x, star.y);
			ctx.lineTo(tailX, tailY);
			ctx.strokeStyle = gradient;
			ctx.lineWidth = CONFIG.stars.tailWidth;
			ctx.stroke();

			ctx.beginPath();
			ctx.arc(star.x, star.y, CONFIG.stars.headRadius, 0, Math.PI * 2);
			ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
			ctx.fill();
		};

		// Обновление падающей звезды
		const updateShootingStar = (star: ShootingStar) => {
			star.x += Math.cos(star.angle) * star.speed;
			star.y += Math.sin(star.angle) * star.speed;
			star.opacity -= CONFIG.stars.fadeSpeed;

			return star.opacity > 0 &&
				star.x < canvas.width + 200 &&
				star.x > -200 &&
				star.y < canvas.height + 200;
		};

		// Рисование линий между звездами
		const drawConstellations = () => {
			if (!CONFIG.constellations.enabled) return;
			if (!mousePos.current) return;

			const targetOpacity = mousePos.current ? CONFIG.constellations.maxOpacity : 0;
			linesOpacity.current = linesOpacity.current * (1 - CONFIG.constellations.fadeSpeed) + targetOpacity * CONFIG.constellations.fadeSpeed;

			if (linesOpacity.current < 0.05) return;

			const mouseX = mousePos.current.x;
			const mouseY = mousePos.current.y;
			const radius = CONFIG.constellations.influenceRadius;

			const nearbyStars: Particle[] = [];
			particles.forEach(star => {
				const dx = star.x - mouseX;
				const dy = star.y - mouseY;
				const dist = Math.sqrt(dx * dx + dy * dy);
				if (dist < radius) {
					nearbyStars.push(star);
				}
			});

			if (nearbyStars.length < 3) return;

			const maxDist = CONFIG.constellations.maxDistance;

			for (let i = 0; i < nearbyStars.length; i++) {
				for (let j = i + 1; j < nearbyStars.length; j++) {
					const star1 = nearbyStars[i];
					const star2 = nearbyStars[j];

					const dx = star1.x - star2.x;
					const dy = star1.y - star2.y;
					const dist = Math.sqrt(dx * dx + dy * dy);

					if (dist < maxDist) {
						const distToMouse1 = Math.hypot(star1.x - mouseX, star1.y - mouseY);
						const distToMouse2 = Math.hypot(star2.x - mouseX, star2.y - mouseY);
						const avgDist = (distToMouse1 + distToMouse2) / 2;
						const opacity = linesOpacity.current * (1 - avgDist / radius) * (1 - dist / maxDist);

						if (opacity > 0.1) {
							ctx.beginPath();
							ctx.moveTo(star1.x, star1.y);
							ctx.lineTo(star2.x, star2.y);
							ctx.strokeStyle = `${CONFIG.background.constellationColor}${opacity})`;
							ctx.lineWidth = CONFIG.constellations.lineWidth;
							ctx.stroke();
						}
					}
				}
			}
		};

		// Обработка движения мыши
		const handleMouseMove = (e: MouseEvent) => {
			mousePos.current = { x: e.clientX, y: e.clientY };
		};

		const handleMouseLeave = () => {
			mousePos.current = null;
		};

		// Анимация
		const animate = () => {
			if (!ctx || !canvas) return;

			// ВАЖНО: Очищаем canvas цветом фона из конфига
			ctx.fillStyle = CONFIG.background.color;
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			// Добавляем дополнительный fade эффект для хвостов (опционально)
			// Если нужен эффект "хвостов" от звезд, раскомментируйте:
			// ctx.fillStyle = `rgba(0, 0, 0, ${CONFIG.background.fadeEffect})`;
			// ctx.fillRect(0, 0, canvas.width, canvas.height);

			// Обновляем и рисуем звезды
			particles.forEach(star => {
				star.x += star.speedX;
				star.y += star.speedY;

				if (star.x < 0) star.x = canvas.width;
				if (star.x > canvas.width) star.x = 0;
				if (star.y < 0) star.y = canvas.height;
				if (star.y > canvas.height) star.y = 0;

				// Рисуем звезду с прозрачностью
				ctx.beginPath();
				ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
				ctx.fillStyle = `${CONFIG.background.starColor}${star.opacity})`;
				ctx.fill();
			});

			// Рисуем созвездия
			drawConstellations();

			// Логика звездопада
			if (CONFIG.starShower.enabled) {
				const now = Date.now();
				const timeSinceLastShower = now - lastShowerTime.current;

				if (timeSinceLastShower > CONFIG.starShower.minInterval &&
					shootingStars.length === 0 &&
					showerStarsQueue.current.length === 0) {

					const randomInterval = CONFIG.starShower.minInterval +
						Math.random() * (CONFIG.starShower.maxInterval - CONFIG.starShower.minInterval);

					if (timeSinceLastShower > randomInterval) {
						showerStarsQueue.current = createStarShower();
						lastShowerTime.current = now;
						lastShowerStarTime.current = now;
					}
				}

				if (showerStarsQueue.current.length > 0) {
					const now = Date.now();
					const timeSinceLastStar = now - lastShowerStarTime.current;

					if (timeSinceLastStar >= CONFIG.starShower.delayBetweenStars * 1000) {
						const nextStar = showerStarsQueue.current.shift();
						if (nextStar) {
							shootingStars.push(nextStar);
							lastShowerStarTime.current = now;
						}
					}
				}
			}

			// Одиночные звезды
			if (CONFIG.singleStars.enabled) {
				const currentSingleStars = shootingStars.filter(star =>
					!showerStarsQueue.current.includes(star)
				).length;

				if (Math.random() < CONFIG.singleStars.spawnChance &&
					currentSingleStars < CONFIG.singleStars.maxSimultaneous) {
					shootingStars.push(createShootingStar(undefined, undefined, undefined, undefined, false));
				}
			}

			// Обновляем и рисуем все падающие звезды
			shootingStars = shootingStars.filter(star => {
				const active = updateShootingStar(star);
				if (active) drawShootingStar(star);
				return active;
			});

			animationId = requestAnimationFrame(animate);
		};

		// Настройка размера canvas
		const handleResize = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			initParticles();
		};

		handleResize();
		animate();

		window.addEventListener('resize', handleResize);
		window.addEventListener('mousemove', handleMouseMove);
		window.addEventListener('mouseleave', handleMouseLeave);

		return () => {
			cancelAnimationFrame(animationId);
			window.removeEventListener('resize', handleResize);
			window.removeEventListener('mousemove', handleMouseMove);
			window.removeEventListener('mouseleave', handleMouseLeave);
		};
	}, []);

	return (
		<canvas
			ref={canvasRef}
			style={{
				position: 'fixed',
				top: 0,
				left: 0,
				width: '100%',
				height: '100%',
				zIndex: -1,
				pointerEvents: 'none',
				// Убираем backgroundColor из CSS, теперь фон рисуется на canvas
			}}
		/>
	);
};

export default Variant_1;