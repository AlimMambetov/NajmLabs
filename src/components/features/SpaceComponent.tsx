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
	// ballRadius = 45,
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
	const pixelRatioRef = useRef<number>(1);
	const timeoutTouchRef = useRef<any>(null);

	const [isMobile, setIsMobile] = useState(false);
	const ballCount = iconsData.length;

	const ballRadius = isMobile ? 32 : 60;

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

		// Получаем pixel ratio для высокого DPI
		const pixelRatio = window.devicePixelRatio || 1;
		pixelRatioRef.current = pixelRatio;

		// Устанавливаем реальный размер canvas с учетом pixel ratio
		canvasRef.current.width = width * pixelRatio;
		canvasRef.current.height = height * pixelRatio;
		canvasRef.current.style.width = `${width}px`;
		canvasRef.current.style.height = `${height}px`;

		// Настраиваем контекст для высокого качества
		const ctx = canvasRef.current.getContext('2d');
		if (ctx) {
			ctx.imageSmoothingEnabled = true;
			ctx.imageSmoothingQuality = 'high';
		}

		// Создаем движок с оптимизациями для мобильных
		const engine = Matter.Engine.create();
		engine.gravity.y = 0;
		engine.gravity.x = 0;
		engine.positionIterations = isMobile ? 8 : 15;
		engine.velocityIterations = isMobile ? 5 : 10;
		engineRef.current = engine;

		// Создаем стены (используем логические размеры для физики)
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
		tooltip = document.createElement('div');
		tooltip.id = 'ball-tooltip';
		tooltip.style.cssText = `
				position: fixed;
				padding: 8px 16px;
				background: transparent;
				color: white;
				border-radius: 0;
				font-size: ${isMobile ? '16px' : '25px'};
				font-weight: 600;
				font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
				pointer-events: none;
				z-index: 1000;
				white-space: nowrap;
				opacity: 0;
				transition: 0.2s;
				text-shadow: 0 0 10px rgba(0, 0, 0, 1), 0 0 20px rgba(67, 35, 119, 0.6);
			`;
		document.body.appendChild(tooltip);

		tooltipRef.current = tooltip;

		const updateTooltipPosition = (ball: Ball) => {
			if (!tooltip || !canvasRef.current) return;

			const canvasRect = canvasRef.current.getBoundingClientRect();

			// Получаем логические координаты шарика
			const ballLogicalX = ball.body.position.x;
			const ballLogicalY = ball.body.position.y;

			// Преобразуем в экранные координаты CSS
			// Так как canvas имеет размер в CSS пикселях, а физика в логических,
			// то координаты шарика напрямую соответствуют CSS пикселям
			const ballScreenX = canvasRect.left + ballLogicalX;
			const ballScreenY = canvasRect.top + ballLogicalY;

			// Для мобильных используем отступ над шариком
			const offset = isMobile ? ballRadius - 60 : ballRadius + - 125;

			tooltip.style.left = `${ballScreenX - tooltip.offsetWidth / 2}px`;
			tooltip.style.top = `${ballScreenY - offset}px`; // Показываем над шариком
			tooltip.textContent = ball.title;
		};

		// Функция для преобразования экранных координат в логические координаты физики
		const screenToPhysicsCoords = (clientX: number, clientY: number) => {
			if (!canvasRef.current) return { x: 0, y: 0 };
			const rect = canvasRef.current.getBoundingClientRect();
			const scaleX = canvasRef.current.width / rect.width;
			const scaleY = canvasRef.current.height / rect.height;
			const canvasX = (clientX - rect.left) * scaleX;
			const canvasY = (clientY - rect.top) * scaleY;
			// Возвращаем логические координаты (делим на pixelRatio)
			return { x: canvasX / pixelRatio, y: canvasY / pixelRatio };
		};

		// Кэш для загруженных изображений
		const imageCache = new Map<string, HTMLImageElement>();

		const drawIcons = () => {
			if (!canvasRef.current) return;
			const ctx = canvasRef.current.getContext('2d');
			if (!ctx) return;

			// Очищаем canvas с учетом pixel ratio
			ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

			// Масштабируем контекст для рисования в физических пикселях
			ctx.save();
			ctx.scale(pixelRatio, pixelRatio);

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

				// Рисуем иконку из кэша с высоким качеством
				let img = imageCache.get(ball.icon);
				if (img && img.complete && img.naturalWidth > 0) {
					// Включаем высокое качество сглаживания для изображений
					ctx.imageSmoothingEnabled = true;
					ctx.imageSmoothingQuality = 'high';
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

			ctx.restore();
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
					const physicsCoords = screenToPhysicsCoords(e.clientX, e.clientY);
					const mouseX = physicsCoords.x;
					const mouseY = physicsCoords.y;

					if (isDraggingRef.current && draggedBall) {
						const newX = Math.min(Math.max(mouseX, ballRadius + 5), width - ballRadius - 5);
						const newY = Math.min(Math.max(mouseY, ballRadius + 5), height - ballRadius - 5);
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
			const physicsCoords = screenToPhysicsCoords(e.clientX, e.clientY);
			const mouseX = physicsCoords.x;
			const mouseY = physicsCoords.y;

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
				const physicsCoords = screenToPhysicsCoords(e.clientX, e.clientY);
				const mouseX = physicsCoords.x;
				const mouseY = physicsCoords.y;
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

		// Обработчики для мобильных - исправлено с правильным преобразованием координат
		const handleTouchStartMobile = (e: TouchEvent) => {
			if (!canvasRef.current || !isMobile) return;

			const touch = e.touches[0];
			const physicsCoords = screenToPhysicsCoords(touch.clientX, touch.clientY);
			const touchX = physicsCoords.x;
			const touchY = physicsCoords.y;

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
			clearTimeout(timeoutTouchRef.current)
			if (!isMobile) return;
			// Убираем подсветку через 2 секунды
			timeoutTouchRef.current = setTimeout(() => {
				if (hoveredBallRef.current && tooltip) {
					hoveredBallRef.current = null;
					tooltip.style.opacity = '0';
				}
			}, 5000);
		};

		// Добавляем обработчики
		if (!isMobile) {
			canvasRef.current.addEventListener('mousedown', handleMouseDown);
			window.addEventListener('mousemove', handleMouseMove);
			window.addEventListener('mouseup', handleMouseUp);
			canvasRef.current.addEventListener('mouseleave', handleMouseLeave);
		} else {
			canvasRef.current.addEventListener('touchstart', handleTouchStartMobile);
			canvasRef.current.addEventListener('touchend', handleTouchEndMobile);
		}

		// Рендерер
		const render = Matter.Render.create({
			canvas: canvasRef.current,
			engine: engine,
			options: {
				width: canvasRef.current.width,
				height: canvasRef.current.height,
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
			const newPixelRatio = window.devicePixelRatio || 1;
			pixelRatioRef.current = newPixelRatio;

			// Обновляем размер canvas с учетом pixel ratio
			canvasRef.current.width = newWidth * newPixelRatio;
			canvasRef.current.height = newHeight * newPixelRatio;
			canvasRef.current.style.width = `${newWidth}px`;
			canvasRef.current.style.height = `${newHeight}px`;

			render.options.width = canvasRef.current.width;
			render.options.height = canvasRef.current.height;

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
				height: isMobile ? '500px' : '700px',
				overflow: 'hidden',
				touchAction: 'pan-y',
			}}
		>
			<canvas
				ref={canvasRef}
				style={{
					width: '100%',
					height: '100%',
					display: 'block',
					cursor: isMobile ? 'pointer' : 'grab',
					touchAction: isMobile ? 'pan-y' : 'none',
				}}
			/>
		</div>
	);
};

export default FloatingBalls;