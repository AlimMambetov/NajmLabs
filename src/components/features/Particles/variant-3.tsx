'use client'
import React, { useEffect, useRef } from 'react';

interface Particle {
	x: number;
	y: number;
	radius: number;
	speed: number;
	horizontalSpeed: number;
	opacity: number;
	twinkleSpeed: number;
	twinklePhase: number;
}

interface ShootingStar {
	x: number;
	y: number;
	length: number;
	speed: number;
	angle: number;
	vx: number;
	vy: number;
	opacity: number;
}

// ==================== ОБЪЕКТ С НАСТРОЙКАМИ ====================
const CONFIG = {
	// Настройки звездопада
	starShower: {
		enabled: true,
		minInterval: 30 * 1000,        // 30 секунд
		maxInterval: 60 * 1000,        // 60 секунд
		minStars: 3,
		maxStars: 8,
		minSpeed: 7,
		maxSpeed: 12,
		angleVariation: 0.2,
		xOffset: 120,
		yOffset: 80,
		delayBetweenStars: 0.15,
		minOpacity: 0.6,
		maxOpacity: 1.0,
	},

	// Настройки одиночных звезд
	singleStars: {
		enabled: true,
		spawnChance: 0.002,
		maxSimultaneous: 2,
		minOpacity: 0.5,
		maxOpacity: 0.9,
	},

	// Общие настройки для всех падающих звезд
	stars: {
		minSpeed: 6,
		maxSpeed: 14,
		minLength: 50,
		maxLength: 90,
		baseAngle: Math.PI / 4,
		angleVariation: 0.4,
		tailWidth: 2,
		headRadius: 2.5,
	},

	// Настройки фона и обычных звезд
	background: {
		color: '#18072e',
		starColor: 'rgba(200, 190, 255, ',
		glowColor: 'rgba(166, 153, 239, ',
		starsCount: 250,
		starMinOpacity: 0.3,
		starMaxOpacity: 0.9,
		starMinRadius: 0.8,
		starMaxRadius: 2.5,
		twinkleSpeedMin: 0.005,
		twinkleSpeedMax: 0.02,
		minSpeed: 0.05,
		maxSpeed: 0.35,
		minHorizontalSpeed: -0.08,
		maxHorizontalSpeed: 0.08,
	},

	// Настройки созвездий
	constellations: {
		enabled: true,
		maxOpacity: 0.5,
		influenceRadius: 200,
		maxDistance: 130,
		lineWidth: 1.2,
		fadeSpeed: 0.05,
	},
};


export const Variant_3 = (props: any) => {
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

		// Инициализация звезд с разной скоростью
		const initParticles = () => {
			particles = [];
			for (let i = 0; i < CONFIG.background.starsCount; i++) {
				const opacity = CONFIG.background.starMinOpacity +
					Math.random() * (CONFIG.background.starMaxOpacity - CONFIG.background.starMinOpacity);

				const speed = CONFIG.background.minSpeed +
					Math.random() * (CONFIG.background.maxSpeed - CONFIG.background.minSpeed);

				const horizontalSpeed = CONFIG.background.minHorizontalSpeed +
					Math.random() * (CONFIG.background.maxHorizontalSpeed - CONFIG.background.minHorizontalSpeed);

				particles.push({
					x: Math.random() * canvas.width,
					y: Math.random() * canvas.height,
					radius: CONFIG.background.starMinRadius +
						Math.random() * (CONFIG.background.starMaxRadius - CONFIG.background.starMinRadius),
					speed: speed,
					horizontalSpeed: horizontalSpeed,
					opacity: opacity,
					twinkleSpeed: CONFIG.background.twinkleSpeedMin +
						Math.random() * (CONFIG.background.twinkleSpeedMax - CONFIG.background.twinkleSpeedMin),
					twinklePhase: Math.random() * Math.PI * 2,
				});
			}
		};

		// Создание падающей звезды (без затухания)
		const createShootingStar = (angle?: number, x?: number, y?: number, speed?: number, isFromShower: boolean = false) => {
			const finalAngle = angle !== undefined
				? angle
				: CONFIG.stars.baseAngle + (Math.random() - 0.5) * CONFIG.stars.angleVariation;

			const finalSpeed = speed !== undefined
				? speed
				: CONFIG.stars.minSpeed + Math.random() * (CONFIG.stars.maxSpeed - CONFIG.stars.minSpeed);

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
				speed: finalSpeed,
				angle: finalAngle,
				vx: Math.cos(finalAngle) * finalSpeed,
				vy: Math.sin(finalAngle) * finalSpeed,
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
					startY + yOffset - i * 12,
					speedVariation,
					true
				));
			}

			return stars;
		};

		// Рисование обычной звезды с мерцанием
		const drawStar = (star: Particle, time: number) => {
			const twinkle = Math.sin(time * star.twinkleSpeed + star.twinklePhase) * 0.3 + 0.7;
			const alpha = star.opacity * twinkle;

			ctx.beginPath();
			ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
			ctx.fillStyle = `${CONFIG.background.starColor}${alpha})`;
			ctx.fill();

			if (star.radius > 1.8) {
				ctx.beginPath();
				ctx.arc(star.x, star.y, star.radius * 1.8, 0, Math.PI * 2);
				ctx.fillStyle = `${CONFIG.background.glowColor}${alpha * 0.2})`;
				ctx.fill();
			}
		};

		// Рисование падающей звезды (без затухания)
		const drawShootingStar = (star: ShootingStar) => {
			const tailX = star.x - Math.cos(star.angle) * star.length;
			const tailY = star.y - Math.sin(star.angle) * star.length;

			const gradient = ctx.createLinearGradient(tailX, tailY, star.x, star.y);
			gradient.addColorStop(0, `rgba(166, 153, 239, 0)`);
			gradient.addColorStop(0.7, `${CONFIG.background.starColor}${star.opacity * 0.6})`);
			gradient.addColorStop(1, `rgba(255, 255, 255, ${star.opacity})`);

			ctx.beginPath();
			ctx.moveTo(tailX, tailY);
			ctx.lineTo(star.x, star.y);
			ctx.strokeStyle = gradient;
			ctx.lineWidth = CONFIG.stars.tailWidth;
			ctx.stroke();

			ctx.beginPath();
			ctx.arc(star.x, star.y, CONFIG.stars.headRadius, 0, Math.PI * 2);
			ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
			ctx.fill();
		};

		// Обновление падающей звезды (без затухания, только движение)
		const updateShootingStar = (star: ShootingStar) => {
			star.x += star.vx;
			star.y += star.vy;

			// Удаляем только когда звезда полностью вышла за пределы экрана
			return star.x < canvas.width + 200 &&
				star.x > -200 &&
				star.y < canvas.height + 200 &&
				star.y > -200;
		};

		// Рисование созвездий
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
							ctx.strokeStyle = `${CONFIG.background.glowColor}${opacity})`;
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
		const animate = (timestamp: number) => {
			if (!ctx || !canvas) return;

			const time = timestamp * 0.001;

			// Очистка с цветом фона
			ctx.fillStyle = CONFIG.background.color;
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			// Обновляем и рисуем обычные звезды
			particles.forEach(star => {
				star.y -= star.speed;
				star.x += star.horizontalSpeed;

				if (star.y < -50) {
					star.y = canvas.height + 50;
					star.x = Math.random() * canvas.width;
				}

				if (star.x < -50) {
					star.x = canvas.width + 50;
				}
				if (star.x > canvas.width + 50) {
					star.x = -50;
				}

				drawStar(star, time);
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
				if (Math.random() < CONFIG.singleStars.spawnChance &&
					shootingStars.length < CONFIG.singleStars.maxSimultaneous) {
					shootingStars.push(createShootingStar(undefined, undefined, undefined, undefined, false));
				}
			}

			// Обновляем и рисуем падающие звезды (без затухания)
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
		animationId = requestAnimationFrame(animate);

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
				zIndex: 1,
				pointerEvents: 'none',
			}}
		/>
	);
};

export default Variant_3;