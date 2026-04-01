'use client';

import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';

interface Ball {
	body: Matter.Body;
	title: string;
	icon: string;
	id: number;
}

interface FloatingBallsProps {
	ballCount?: number;
	ballRadius?: number;
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

const FloatingBalls: React.FC<FloatingBallsProps> = ({
	ballRadius = 45,
}) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const engineRef = useRef<Matter.Engine | null>(null);
	const runnerRef = useRef<Matter.Runner | null>(null);
	const ballsRef = useRef<Ball[]>([]);
	const animationRef = useRef<number | undefined>(undefined);
	const tooltipRef = useRef<HTMLDivElement | null>(null);
	const isDraggingRef = useRef<boolean>(false);
	const hoveredBallRef = useRef<Ball | null>(null);
	const wallsRef = useRef<Matter.Body[]>([]);

	const [isMobile, setIsMobile] = useState(false);
	const ballCount = iconsData.length;

	// Определяем мобильное устройство
	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth <= 768);
		};
		checkMobile();
		window.addEventListener('resize', checkMobile);
		return () => window.removeEventListener('resize', checkMobile);
	}, []);

	useEffect(() => {
		if (!containerRef.current || !canvasRef.current) return;

		const getDimensions = () => {
			const rect = containerRef.current!.getBoundingClientRect();
			return { width: rect.width, height: rect.height };
		};

		let { width, height } = getDimensions();

		// Создаем движок с оптимизациями для мобильных
		const engine = Matter.Engine.create();
		engine.gravity.y = 0;
		engine.gravity.x = 0;
		engine.positionIterations = isMobile ? 8 : 15;
		engine.velocityIterations = isMobile ? 5 : 10;
		engineRef.current = engine;

		// Создаем стены
		const createWalls = (w: number, h: number) => {
			const margin = 30;
			const wallOptions = {
				isStatic: true,
				restitution: 0.95,
				friction: 0,
				render: { visible: false },
			};

			return [
				Matter.Bodies.rectangle(w / 2, margin, w, 10, wallOptions),
				Matter.Bodies.rectangle(w / 2, h - margin, w, 10, wallOptions),
				Matter.Bodies.rectangle(margin, h / 2, 10, h, wallOptions),
				Matter.Bodies.rectangle(w - margin, h / 2, 10, h, wallOptions),
			];
		};

		const walls = createWalls(width, height);
		wallsRef.current = walls;

		// Создаем шарики
		const balls: Ball[] = [];
		for (let i = 0; i < ballCount; i++) {
			const data = iconsData[i % iconsData.length];
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
				label: `ball-${i}`,
				render: {
					fillStyle: 'transparent',
					strokeStyle: 'transparent',
					lineWidth: 0,
				},
			});

			Matter.Body.setVelocity(body, {
				x: Math.cos(angle) * speed,
				y: Math.sin(angle) * speed,
			});

			balls.push({
				body,
				title: data.title,
				icon: data.icon,
				id: i,
			});
		}

		ballsRef.current = balls;
		Matter.World.add(engine.world, [...walls, ...balls.map(b => b.body)]);

		// Создаем тултип
		let tooltip: HTMLDivElement | null = null;
		if (!isMobile) {
			tooltip = document.createElement('div');
			tooltip.id = 'ball-tooltip';
			tooltip.style.cssText = `
				position: fixed;
				padding: 8px 16px;
				background: transparent;
				color: white;
				border-radius: 0;
				font-size: 16px;
				font-weight: 600;
				font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
				pointer-events: none;
				z-index: 1000;
				white-space: nowrap;
				opacity: 0;
				transition: opacity 0.2s ease;
				text-shadow: 0 0 10px rgba(67, 35, 119, 0.8), 0 0 20px rgba(67, 35, 119, 0.6);
			`;
			document.body.appendChild(tooltip);
		} else {
			// Для мобильных создаем тултип
			tooltip = document.createElement('div');
			tooltip.id = 'ball-tooltip';
			tooltip.style.cssText = `
				position: fixed;
				padding: 12px 20px;
				background: rgba(0, 0, 0, 0.8);
				color: white;
				border-radius: 12px;
				font-size: 18px;
				font-weight: 600;
				font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
				pointer-events: none;
				z-index: 1000;
				white-space: nowrap;
				opacity: 0;
				transition: opacity 0.2s ease;
				backdrop-filter: blur(10px);
				box-shadow: 0 0 20px rgba(67, 35, 119, 0.5);
			`;
			document.body.appendChild(tooltip);
		}
		tooltipRef.current = tooltip;

		const updateTooltipPosition = (ball: Ball) => {
			if (!tooltip || !canvasRef.current) return;

			const canvasRect = canvasRef.current.getBoundingClientRect();
			const scaleX = canvasRef.current.width / canvasRect.width;
			const scaleY = canvasRef.current.height / canvasRect.height;
			const ballCanvasX = ball.body.position.x;
			const ballCanvasY = ball.body.position.y;
			const ballScreenX = canvasRect.left + (ballCanvasX / scaleX);
			const ballScreenY = canvasRect.top + (ballCanvasY / scaleY);

			tooltip.style.left = `${ballScreenX - tooltip.offsetWidth / 2}px`;
			tooltip.style.top = `${ballScreenY + ballRadius + 8}px`;
			tooltip.textContent = ball.title;
		};

		// Кэш для загруженных изображений
		const imageCache = new Map<string, HTMLImageElement>();

		const drawIcons = () => {
			if (!canvasRef.current) return;
			const ctx = canvasRef.current.getContext('2d');
			if (!ctx) return;

			balls.forEach((ball) => {
				const x = ball.body.position.x;
				const y = ball.body.position.y;
				const size = ballRadius * 0.5;
				const isActive = hoveredBallRef.current === ball;

				ctx.save();

				// Добавляем свечение для активного шарика
				if (isActive) {
					ctx.shadowColor = 'rgba(67, 35, 119, 0.8)';
					ctx.shadowBlur = 20;
					ctx.beginPath();
					ctx.arc(x, y, ballRadius + 5, 0, Math.PI * 2);
					ctx.fillStyle = 'rgba(67, 35, 119, 0.2)';
					ctx.fill();
				} else if (!isMobile) {
					ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
					ctx.shadowBlur = 10;
				}

				// Рисуем шарик
				ctx.beginPath();
				ctx.arc(x, y, ballRadius, 0, Math.PI * 2);

				const gradient = ctx.createLinearGradient(x - 30, y - 30, x + 30, y + 30);
				if (isMobile) {
					gradient.addColorStop(0, 'rgba(33, 17, 54, 0.9)');
					gradient.addColorStop(1, 'rgba(67, 35, 119, 0.6)');
				} else {
					gradient.addColorStop(0, 'rgba(33, 17, 54, 0.8)');
					gradient.addColorStop(1, 'rgba(67, 35, 119, 0.4)');
				}

				ctx.fillStyle = gradient;
				ctx.fill();

				if (!isMobile) {
					ctx.strokeStyle = isActive ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.3)';
					ctx.lineWidth = isActive ? 2.5 : 1.5;
					ctx.stroke();
				} else if (isActive) {
					ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
					ctx.lineWidth = 2.5;
					ctx.stroke();
				}

				// Рисуем иконку из кэша
				let img = imageCache.get(ball.icon);
				if (img && img.complete && img.naturalWidth > 0) {
					ctx.drawImage(img, x - size, y - size, size * 2, size * 2);
				} else if (!img) {
					img = new Image();
					img.src = `/icons/logo-icon/${ball.icon}`;
					imageCache.set(ball.icon, img);

					img.onload = () => {
						drawIcons();
					};

					// Показываем заглушку
					ctx.beginPath();
					ctx.arc(x, y, size, 0, Math.PI * 2);
					ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
					ctx.fill();
				}

				ctx.restore();
			});
		};

		// Оптимизированное поддержание движения
		const maintainConstantMotion = () => {
			const targetSpeed = isMobile ? 0.9 : 1.2;
			balls.forEach(ball => {
				const velocity = ball.body.velocity;
				const speed = Math.sqrt(velocity.x ** 2 + velocity.y ** 2);

				if (speed < targetSpeed * 0.7 || speed < 0.3) {
					const angle = speed < 0.3 ? Math.random() * Math.PI * 2 : Math.atan2(velocity.y, velocity.x);
					Matter.Body.setVelocity(ball.body, {
						x: Math.cos(angle) * targetSpeed,
						y: Math.sin(angle) * targetSpeed,
					});
				} else if (speed > targetSpeed * 1.5) {
					const angle = Math.atan2(velocity.y, velocity.x);
					Matter.Body.setVelocity(ball.body, {
						x: Math.cos(angle) * targetSpeed,
						y: Math.sin(angle) * targetSpeed,
					});
				}
			});
		};

		const motionInterval = setInterval(maintainConstantMotion, isMobile ? 2000 : 1000);

		// Drag and drop (только для десктопа)
		let draggedBall: Matter.Body | null = null;
		let dragStartPoint = { x: 0, y: 0 };
		let moveTimeout: NodeJS.Timeout;

		const handleMouseMove = (e: MouseEvent) => {
			if (!canvasRef.current || isMobile) return;

			if (moveTimeout) clearTimeout(moveTimeout);
			moveTimeout = setTimeout(() => {
				requestAnimationFrame(() => {
					const rect = canvasRef.current!.getBoundingClientRect();
					const scaleX = canvasRef.current!.width / rect.width;
					const scaleY = canvasRef.current!.height / rect.height;
					const mouseX = (e.clientX - rect.left) * scaleX;
					const mouseY = (e.clientY - rect.top) * scaleY;

					if (isDraggingRef.current && draggedBall) {
						const newX = Math.min(Math.max(mouseX, ballRadius + 5), canvasRef.current!.width - ballRadius - 5);
						const newY = Math.min(Math.max(mouseY, ballRadius + 5), canvasRef.current!.height - ballRadius - 5);
						Matter.Body.setPosition(draggedBall, { x: newX, y: newY });
						if (hoveredBallRef.current && tooltip) updateTooltipPosition(hoveredBallRef.current);
					}

					let hoveredBall: Ball | null = null;
					for (const ball of balls) {
						const dx = ball.body.position.x - mouseX;
						const dy = ball.body.position.y - mouseY;
						if (Math.sqrt(dx * dx + dy * dy) <= ballRadius) {
							hoveredBall = ball;
							break;
						}
					}

					if (!isDraggingRef.current) {
						if (hoveredBall && tooltip) {
							if (hoveredBallRef.current !== hoveredBall) {
								hoveredBallRef.current = hoveredBall;
								tooltip.style.opacity = '1';
								updateTooltipPosition(hoveredBall);
							}
						} else if (tooltip && hoveredBallRef.current) {
							tooltip.style.opacity = '0';
							hoveredBallRef.current = null;
						}
					}
				});
			}, 0);
		};

		const handleMouseDown = (e: MouseEvent) => {
			if (!canvasRef.current || isMobile) return;
			const rect = canvasRef.current.getBoundingClientRect();
			const scaleX = canvasRef.current.width / rect.width;
			const scaleY = canvasRef.current.height / rect.height;
			const mouseX = (e.clientX - rect.left) * scaleX;
			const mouseY = (e.clientY - rect.top) * scaleY;

			for (const ball of balls) {
				const dx = ball.body.position.x - mouseX;
				const dy = ball.body.position.y - mouseY;
				if (Math.sqrt(dx * dx + dy * dy) <= ballRadius) {
					draggedBall = ball.body;
					dragStartPoint = { x: mouseX, y: mouseY };
					isDraggingRef.current = true;
					hoveredBallRef.current = ball;
					if (tooltip) {
						tooltip.style.opacity = '1';
						updateTooltipPosition(ball);
					}
					Matter.Body.setVelocity(draggedBall, { x: 0, y: 0 });
					canvasRef.current!.style.cursor = 'grabbing';
					break;
				}
			}
		};

		const handleMouseUp = (e: MouseEvent) => {
			if (!canvasRef.current || isMobile) return;
			if (isDraggingRef.current && draggedBall) {
				const rect = canvasRef.current!.getBoundingClientRect();
				const scaleX = canvasRef.current!.width / rect.width;
				const scaleY = canvasRef.current!.height / rect.height;
				const mouseX = (e.clientX - rect.left) * scaleX;
				const mouseY = (e.clientY - rect.top) * scaleY;
				const dx = mouseX - dragStartPoint.x;
				const dy = mouseY - dragStartPoint.y;

				let speed = Math.min(Math.sqrt(dx * dx + dy * dy) * 0.08, 1.5);
				const angle = Math.atan2(dy, dx);
				if (speed < 0.5) speed = 1.0;

				Matter.Body.setVelocity(draggedBall, {
					x: Math.cos(angle) * speed,
					y: Math.sin(angle) * speed,
				});
				draggedBall = null;
				canvasRef.current!.style.cursor = 'grab';
			}
			isDraggingRef.current = false;
			if (tooltip && !hoveredBallRef.current) tooltip.style.opacity = '0';
		};

		const handleMouseLeave = () => {
			if (isMobile) return;
			if (tooltip) tooltip.style.opacity = '0';
			hoveredBallRef.current = null;
			if (isDraggingRef.current) {
				isDraggingRef.current = false;
				draggedBall = null;
				if (canvasRef.current) canvasRef.current.style.cursor = 'grab';
			}
		};

		// Обработчики для мобильных (без preventDefault)
		const handleTouchStartMobile = (e: TouchEvent) => {
			if (!canvasRef.current || !isMobile) return;

			// Не вызываем preventDefault, чтобы скролл работал
			const rect = canvasRef.current.getBoundingClientRect();
			const scaleX = canvasRef.current.width / rect.width;
			const scaleY = canvasRef.current.height / rect.height;
			const touch = e.touches[0];

			const touchX = (touch.clientX - rect.left) * scaleX;
			const touchY = (touch.clientY - rect.top) * scaleY;

			// Находим шарик под пальцем
			let touchedBall: Ball | null = null;
			for (const ball of balls) {
				const dx = ball.body.position.x - touchX;
				const dy = ball.body.position.y - touchY;
				if (Math.sqrt(dx * dx + dy * dy) <= ballRadius) {
					touchedBall = ball;
					break;
				}
			}

			if (touchedBall) {
				// Если уже есть активный шарик, убираем подсветку
				if (hoveredBallRef.current === touchedBall) {
					hoveredBallRef.current = null;
					if (tooltip) tooltip.style.opacity = '0';
				} else {
					// Показываем новый шарик
					hoveredBallRef.current = touchedBall;
					if (tooltip) {
						tooltip.style.opacity = '1';
						updateTooltipPosition(touchedBall);
					}
				}
			} else {
				// Убираем подсветку если нажали мимо
				hoveredBallRef.current = null;
				if (tooltip) tooltip.style.opacity = '0';
			}
		};

		const handleTouchEndMobile = () => {
			if (!isMobile) return;
			// Убираем подсветку через 2 секунды
			setTimeout(() => {
				if (hoveredBallRef.current && tooltip) {
					hoveredBallRef.current = null;
					tooltip.style.opacity = '0';
				}
			}, 2000);
		};

		// Добавляем обработчики
		if (!isMobile) {
			canvasRef.current.addEventListener('mousedown', handleMouseDown);
			window.addEventListener('mousemove', handleMouseMove);
			window.addEventListener('mouseup', handleMouseUp);
			canvasRef.current.addEventListener('mouseleave', handleMouseLeave);
		} else {
			// Убираем passive: false, чтобы не блокировать скролл
			canvasRef.current.addEventListener('touchstart', handleTouchStartMobile);
			canvasRef.current.addEventListener('touchend', handleTouchEndMobile);
		}

		// Рендерер
		const render = Matter.Render.create({
			canvas: canvasRef.current,
			engine: engine,
			options: {
				width,
				height,
				wireframes: false,
				background: 'transparent',
			},
		});

		Matter.Render.run(render);
		const runner = Matter.Runner.create();
		Matter.Runner.run(runner, engine);
		runnerRef.current = runner;

		const animate = () => {
			drawIcons();
			if (tooltip && tooltip.style.opacity === '1' && hoveredBallRef.current) {
				updateTooltipPosition(hoveredBallRef.current);
			}
			animationRef.current = requestAnimationFrame(animate);
		};
		animate();

		const handleResize = () => {
			if (!containerRef.current || !canvasRef.current || !engineRef.current) return;
			const newWidth = containerRef.current.clientWidth;
			const newHeight = containerRef.current.clientHeight;
			canvasRef.current.width = newWidth;
			canvasRef.current.height = newHeight;
			render.options.width = newWidth;
			render.options.height = newHeight;

			Matter.World.remove(engineRef.current.world, wallsRef.current);
			const newWalls = createWalls(newWidth, newHeight);
			wallsRef.current = newWalls;
			Matter.World.add(engineRef.current.world, newWalls);

			balls.forEach(ball => {
				const x = Math.min(Math.max(ball.body.position.x, ballRadius + 5), newWidth - ballRadius - 5);
				const y = Math.min(Math.max(ball.body.position.y, ballRadius + 5), newHeight - ballRadius - 5);
				Matter.Body.setPosition(ball.body, { x, y });
			});
		};

		window.addEventListener('resize', handleResize);

		// Cleanup
		return () => {
			clearInterval(motionInterval);
			if (moveTimeout) clearTimeout(moveTimeout);
			if (animationRef.current) cancelAnimationFrame(animationRef.current);
			window.removeEventListener('resize', handleResize);

			if (!isMobile) {
				window.removeEventListener('mousemove', handleMouseMove);
				window.removeEventListener('mouseup', handleMouseUp);
				if (canvasRef.current) {
					canvasRef.current.removeEventListener('mousedown', handleMouseDown);
					canvasRef.current.removeEventListener('mouseleave', handleMouseLeave);
				}
			} else {
				if (canvasRef.current) {
					canvasRef.current.removeEventListener('touchstart', handleTouchStartMobile);
					canvasRef.current.removeEventListener('touchend', handleTouchEndMobile);
				}
			}

			if (tooltip) tooltip.remove();
			if (runnerRef.current) Matter.Runner.stop(runnerRef.current);
			if (render) Matter.Render.stop(render);
			if (engineRef.current) {
				Matter.World.clear(engineRef.current.world, true);
				Matter.Engine.clear(engineRef.current);
			}
		};
	}, [ballCount, ballRadius, isMobile]);

	return (
		<div
			ref={containerRef}
			style={{
				position: 'relative',
				width: '100%',
				height: '70vh',
				overflow: 'auto',
				touchAction: 'pan-y', // Разрешаем вертикальный скролл
			}}
		>
			<canvas
				ref={canvasRef}
				style={{
					width: '100%',
					height: '100%',
					display: 'block',
					cursor: isMobile ? 'pointer' : 'grab',
					touchAction: isMobile ? 'pan-y' : 'none', // На мобильных разрешаем скролл
				}}
			/>
		</div>
	);
};

export default FloatingBalls;