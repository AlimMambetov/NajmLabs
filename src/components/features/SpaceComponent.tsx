'use client';

import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';

interface Ball {
	body: Matter.Body;
	title: string;
	icon: string;
}

const iconsData = [
	{ icon: 'ae.svg', title: 'After Effects' },
	{ icon: 'ue.svg', title: 'Unreal Engine' },
	{ icon: 'c++.svg', title: 'C++' },
	{ icon: 'electron.svg', title: 'Electron' },
	{ icon: 'blender.svg', title: 'Blender' },
	{ icon: 'figma.svg', title: 'Figma' },
	{ icon: 'kotlin.svg', title: 'Kotlin' },
	{ icon: 'next.svg', title: 'Next.js' },
	{ icon: 'ps.svg', title: 'Photoshop' },
	{ icon: 'nodejs.svg', title: 'Node.js' },
	{ icon: 'react-native.svg', title: 'React Native' },
	{ icon: 'react.svg', title: 'React' },
];

const FloatingBalls: React.FC = () => {
	const containerRef = useRef<HTMLDivElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const engineRef = useRef<Matter.Engine | null>(null);
	const ballsRef = useRef<Ball[]>([]);
	const tooltipRef = useRef<HTMLDivElement | null>(null);
	const hoveredBallRef = useRef<Ball | null>(null);
	const imageCache = useRef<Map<string, HTMLImageElement>>(new Map());

	const [isMobile, setIsMobile] = useState(false);
	const ballRadius = isMobile ? 32 : 60;
	const ballCount = iconsData.length;

	useEffect(() => {
		const checkMobile = () => setIsMobile(window.innerWidth <= 768);
		checkMobile();
		window.addEventListener('resize', checkMobile);
		return () => window.removeEventListener('resize', checkMobile);
	}, []);

	useEffect(() => {
		if (!containerRef.current || !canvasRef.current) return;

		const getDimensions = () => containerRef.current!.getBoundingClientRect();
		let { width, height } = getDimensions();
		const pixelRatio = window.devicePixelRatio || 1;

		// Настройка canvas
		canvasRef.current.width = width * pixelRatio;
		canvasRef.current.height = height * pixelRatio;
		canvasRef.current.style.width = `${width}px`;
		canvasRef.current.style.height = `${height}px`;

		// Создание движка физики
		const engine = Matter.Engine.create();
		engine.gravity.y = engine.gravity.x = 0;
		engine.positionIterations = isMobile ? 8 : 15;
		engine.velocityIterations = isMobile ? 5 : 10;
		engineRef.current = engine;

		// Создание стен
		const createWalls = (w: number, h: number) => {
			const margin = 30;
			const wallOptions = { isStatic: true, restitution: 0.95, friction: 0, render: { visible: false } };
			return [
				Matter.Bodies.rectangle(w / 2, margin, w, 10, wallOptions),
				Matter.Bodies.rectangle(w / 2, h - margin, w, 10, wallOptions),
				Matter.Bodies.rectangle(margin, h / 2, 10, h, wallOptions),
				Matter.Bodies.rectangle(w - margin, h / 2, 10, h, wallOptions),
			];
		};

		const walls = createWalls(width, height);

		// Создание шариков
		const balls: Ball[] = iconsData.map((data, i) => {
			const x = ballRadius + Math.random() * (width - ballRadius * 2);
			const y = ballRadius + Math.random() * (height - ballRadius * 2);
			const angle = Math.random() * Math.PI * 2;
			const speed = isMobile ? 0.8 + Math.random() * 0.4 : 1.2 + Math.random() * 0.6;

			const body = Matter.Bodies.circle(x, y, ballRadius, {
				restitution: 0.95,
				friction: 0,
				frictionAir: 0,
				density: 0.001,
				inertia: Infinity,
				render: { fillStyle: 'transparent', strokeStyle: 'transparent', lineWidth: 0 },
			});

			Matter.Body.setVelocity(body, { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed });
			return { body, title: data.title, icon: data.icon };
		});

		ballsRef.current = balls;
		Matter.World.add(engine.world, [...walls, ...balls.map(b => b.body)]);

		// Создание тултипа
		const tooltip = document.createElement('div');
		Object.assign(tooltip.style, {
			position: 'fixed',
			padding: '8px 16px',
			background: 'transparent',
			color: 'white',
			borderRadius: '0',
			fontSize: isMobile ? '16px' : '25px',
			fontWeight: '600',
			fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
			pointerEvents: 'none',
			zIndex: '1000',
			whiteSpace: 'nowrap',
			opacity: '0',
			transition: '0.2s',
			textShadow: '0 0 10px rgba(0, 0, 0, 1), 0 0 20px rgba(67, 35, 119, 0.6)',
		});
		document.body.appendChild(tooltip);
		tooltipRef.current = tooltip;

		const updateTooltipPosition = (ball: Ball) => {
			if (!tooltip || !canvasRef.current) return;
			const rect = canvasRef.current.getBoundingClientRect();
			const offset = isMobile ? ballRadius - 60 : ballRadius - 125;
			tooltip.style.left = `${rect.left + ball.body.position.x - tooltip.offsetWidth / 2}px`;
			tooltip.style.top = `${rect.top + ball.body.position.y - offset}px`;
			tooltip.textContent = ball.title;
		};

		// Преобразование координат
		const screenToPhysics = (clientX: number, clientY: number) => {
			if (!canvasRef.current) return { x: 0, y: 0 };
			const rect = canvasRef.current.getBoundingClientRect();
			return {
				x: (clientX - rect.left) * (canvasRef.current.width / rect.width) / pixelRatio,
				y: (clientY - rect.top) * (canvasRef.current.height / rect.height) / pixelRatio,
			};
		};

		// Обработчики взаимодействия
		const handleInteraction = (clientX: number, clientY: number, isHover = true) => {
			const { x: mouseX, y: mouseY } = screenToPhysics(clientX, clientY);
			const hovered = balls.find(ball => Math.hypot(ball.body.position.x - mouseX, ball.body.position.y - mouseY) <= ballRadius);

			if (hovered && tooltip) {
				if (hoveredBallRef.current !== hovered) {
					hoveredBallRef.current = hovered;
					tooltip.style.opacity = '1';
					updateTooltipPosition(hovered);
				}
			} else if (tooltip && hoveredBallRef.current && isHover) {
				tooltip.style.opacity = '0';
				hoveredBallRef.current = null;
			}
		};

		const handleMouseMove = (e: MouseEvent) => handleInteraction(e.clientX, e.clientY, true);
		const handleMouseLeave = () => {
			if (tooltipRef.current) tooltipRef.current.style.opacity = '0';
			hoveredBallRef.current = null;
		};

		const handleTouchStart = (e: TouchEvent) => {
			if (!isMobile) return;
			const touch = e.touches[0];
			handleInteraction(touch.clientX, touch.clientY, false);
		};

		const handleTouchEnd = () => {
			if (!isMobile) return;
			setTimeout(() => {
				if (tooltipRef.current) tooltipRef.current.style.opacity = '0';
				hoveredBallRef.current = null;
			}, 5000);
		};

		// Добавление обработчиков
		const canvas = canvasRef.current;
		if (!isMobile) {
			canvas.addEventListener('mousemove', handleMouseMove);
			canvas.addEventListener('mouseleave', handleMouseLeave);
		} else {
			canvas.addEventListener('touchstart', handleTouchStart);
			canvas.addEventListener('touchend', handleTouchEnd);
		}

		// Поддержание движения
		const maintainMotion = setInterval(() => {
			const targetSpeed = isMobile ? 0.9 : 1.2;
			balls.forEach(ball => {
				const v = ball.body.velocity;
				const speed = Math.hypot(v.x, v.y);
				if (speed < targetSpeed * 0.7 || speed < 0.3) {
					const angle = speed < 0.3 ? Math.random() * Math.PI * 2 : Math.atan2(v.y, v.x);
					Matter.Body.setVelocity(ball.body, { x: Math.cos(angle) * targetSpeed, y: Math.sin(angle) * targetSpeed });
				} else if (speed > targetSpeed * 1.5) {
					const angle = Math.atan2(v.y, v.x);
					Matter.Body.setVelocity(ball.body, { x: Math.cos(angle) * targetSpeed, y: Math.sin(angle) * targetSpeed });
				}
			});
		}, isMobile ? 2000 : 1000);

		// Рендеринг иконок
		const drawIcons = () => {
			const ctx = canvasRef.current?.getContext('2d');
			if (!ctx || !canvasRef.current) return;

			ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
			ctx.save();
			ctx.scale(pixelRatio, pixelRatio);

			balls.forEach(ball => {
				const { x, y } = ball.body.position;
				const size = ballRadius * 0.5;
				const isActive = hoveredBallRef.current === ball;

				ctx.save();

				if (isActive) {
					ctx.shadowColor = `rgba(67, 35, 119, 0.8)`;
					ctx.shadowBlur = 30;
					ctx.beginPath();
					ctx.arc(x, y, ballRadius + 5, 0, Math.PI * 2);
					ctx.fillStyle = `rgba(67, 35, 119, 0.2)`;
					ctx.fill();

					ctx.shadowColor = `rgba(147, 89, 255, 0.6)`;
					ctx.shadowBlur = 25;
					ctx.beginPath();
					ctx.arc(x, y, ballRadius + 3, 0, Math.PI * 2);
					ctx.fillStyle = `rgba(255, 255, 255, 0.4)`;
					ctx.fill();
				}

				ctx.beginPath();
				ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
				const gradient = ctx.createLinearGradient(x - 30, y - 30, x + 30, y + 30);
				gradient.addColorStop(0, 'rgba(33, 17, 54, 0.6)');
				gradient.addColorStop(1, 'rgba(67, 35, 119, 0.2)');
				ctx.fillStyle = gradient;
				ctx.fill();
				ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
				ctx.stroke();

				let img = imageCache.current.get(ball.icon);
				if (img?.complete && img.naturalWidth > 0) {
					ctx.drawImage(img, x - size, y - size, size * 2, size * 2);
				} else if (!img) {
					img = new Image();
					img.src = `/icons/logo-icon/${ball.icon}`;
					imageCache.current.set(ball.icon, img);
					img.onload = () => drawIcons();
				}

				ctx.restore();
			});
			ctx.restore();
		};

		// Запуск физики и рендера
		const render = Matter.Render.create({
			canvas: canvasRef.current,
			engine,
			options: { width: canvasRef.current.width, height: canvasRef.current.height, wireframes: false, background: 'transparent' },
		});

		Matter.Render.run(render);
		const runner = Matter.Runner.create();
		Matter.Runner.run(runner, engine);

		const animate = () => {
			drawIcons();
			if (tooltip?.style.opacity === '1' && hoveredBallRef.current) updateTooltipPosition(hoveredBallRef.current);
			requestAnimationFrame(animate);
		};
		animate();

		// Обработчик ресайза
		const handleResize = () => {
			if (!containerRef.current || !canvasRef.current || !engineRef.current) return;
			const { width: newWidth, height: newHeight } = getDimensions();
			const newPixelRatio = window.devicePixelRatio || 1;

			canvasRef.current.width = newWidth * newPixelRatio;
			canvasRef.current.height = newHeight * newPixelRatio;
			canvasRef.current.style.width = `${newWidth}px`;
			canvasRef.current.style.height = `${newHeight}px`;
			render.options.width = canvasRef.current.width;
			render.options.height = canvasRef.current.height;

			Matter.World.remove(engineRef.current.world, walls);
			const newWalls = createWalls(newWidth, newHeight);
			Matter.World.add(engineRef.current.world, newWalls);

			balls.forEach(ball => {
				const x = Math.min(Math.max(ball.body.position.x, ballRadius + 5), newWidth - ballRadius - 5);
				const y = Math.min(Math.max(ball.body.position.y, ballRadius + 5), newHeight - ballRadius - 5);
				Matter.Body.setPosition(ball.body, { x, y });
			});
		};

		window.addEventListener('resize', handleResize);

		return () => {
			clearInterval(maintainMotion);
			window.removeEventListener('resize', handleResize);
			if (!isMobile) {
				canvas.removeEventListener('mousemove', handleMouseMove);
				canvas.removeEventListener('mouseleave', handleMouseLeave);
			} else {
				canvas.removeEventListener('touchstart', handleTouchStart);
				canvas.removeEventListener('touchend', handleTouchEnd);
			}
			tooltip?.remove();
			Matter.Runner.stop(runner);
			Matter.Render.stop(render);
			Matter.World.clear(engine.world, true);
			Matter.Engine.clear(engine);
		};
	}, [ballCount, ballRadius, isMobile]);

	return (
		<div ref={containerRef} style={{
			position: 'relative',
			width: '100%',
			height: isMobile ? '500px' : '700px',
			overflow: 'hidden',
			touchAction: 'pan-y',
		}}>
			<canvas ref={canvasRef} style={{
				width: '100%',
				height: '100%',
				display: 'block',
				cursor: 'pointer',
				touchAction: isMobile ? 'pan-y' : 'auto',
			}} />
		</div>
	);
};

export default FloatingBalls;