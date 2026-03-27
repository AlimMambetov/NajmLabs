import React, { useRef, useEffect, useState, useCallback } from 'react';

// Настройки анимации
const CONFIG = {
	// Основные настройки
	BALL_COUNT: 15,              // Количество шариков
	BALL_RADIUS: 30,             // Радиус шарика (px)
	CANVAS_WIDTH: 900,           // Ширина canvas
	CANVAS_HEIGHT: 600,          // Высота canvas

	// Настройки скорости
	BASE_SPEED: 0.2,             // Базовая скорость шариков (меньше = медленнее)
	SPEED_VARIATION: 0.1,        // Разброс скорости (± от базовой)

	// Настройки замедления при hover
	HOVER_SLOWDOWN_FACTOR: 0.98, // Фактор замедления (1 = нет замедления, 0.95 = сильное)
	MIN_SPEED_WHILE_HOVER: 0.05, // Минимальная скорость при hover (0 = полная остановка)

	// Настройки восстановления скорости
	SPEED_RECOVERY_RATE: 0.03,   // Скорость восстановления исходной скорости (0.01-0.1)

	// Настройки отскока
	BOUNCE_DAMPING: 0.97,        // Потеря скорости при отскоке (1 = без потерь)

	// Настройки внешнего вида
	BALL_COLOR: '#4ecdc4',       // Цвет шарика
	BALL_HOVER_COLOR: '#ff6b6b', // Цвет шарика при наведении
	BALL_STROKE_COLOR: '#2c3e50', // Цвет обводки
	TEXT_COLOR: 'white',         // Цвет текста
	TEXT_FONT_WEIGHT: 'bold',    // Жирность текста

	// Настройки фона
	BACKGROUND_COLOR: '#0f0f1a', // Цвет фона canvas
	OUTER_BG_COLOR: '#1a1a2e',   // Цвет внешнего фона
	CANVAS_BORDER_COLOR: '#4ecdc4', // Цвет рамки
	CANVAS_BOX_SHADOW: '0 0 20px rgba(78, 205, 196, 0.3)', // Тень canvas
};

interface Ball {
	x: number;
	y: number;
	vx: number;
	vy: number;
	radius: number;
	number: number;
	originalVx: number;
	originalVy: number;
}

const FloatingBalls: React.FC = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [balls, setBalls] = useState<Ball[]>([]);
	const [hoveredBall, setHoveredBall] = useState<{ number: number; x: number; y: number } | null>(null);
	const animationRef = useRef<any>(null);
	const ballsRef = useRef<Ball[]>([]);

	// Инициализация шариков
	useEffect(() => {
		const initialBalls: Ball[] = [];
		for (let i = 1; i <= CONFIG.BALL_COUNT; i++) {
			// Скорость с разбросом
			const vx = (Math.random() - 0.5) * CONFIG.SPEED_VARIATION * 2 +
				(Math.random() > 0.5 ? CONFIG.BASE_SPEED : -CONFIG.BASE_SPEED);
			const vy = (Math.random() - 0.5) * CONFIG.SPEED_VARIATION * 2 +
				(Math.random() > 0.5 ? CONFIG.BASE_SPEED : -CONFIG.BASE_SPEED);

			initialBalls.push({
				x: Math.random() * CONFIG.CANVAS_WIDTH,
				y: Math.random() * CONFIG.CANVAS_HEIGHT,
				vx: vx,
				vy: vy,
				originalVx: vx,
				originalVy: vy,
				radius: CONFIG.BALL_RADIUS,
				number: i,
			});
		}
		setBalls(initialBalls);
		ballsRef.current = initialBalls;
	}, []);

	// Проверка позиции мыши для hover
	const checkHover = useCallback((mouseX: number, mouseY: number) => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const rect = canvas.getBoundingClientRect();
		const scaleX = canvas.width / rect.width;
		const scaleY = canvas.height / rect.height;

		const canvasX = (mouseX - rect.left) * scaleX;
		const canvasY = (mouseY - rect.top) * scaleY;

		const hovered = ballsRef.current.find(ball => {
			const dx = ball.x - canvasX;
			const dy = ball.y - canvasY;
			return Math.sqrt(dx * dx + dy * dy) <= ball.radius;
		});

		if (hovered) {
			setHoveredBall({ number: hovered.number, x: mouseX, y: mouseY });
		} else {
			setHoveredBall(null);
		}
	}, []);

	// Обновление позиций шариков
	const updateBalls = useCallback(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const newBalls = ballsRef.current.map(ball => {
			let newBall = { ...ball };

			// Замедление при hover
			if (hoveredBall && hoveredBall.number === ball.number) {
				newBall.vx *= CONFIG.HOVER_SLOWDOWN_FACTOR;
				newBall.vy *= CONFIG.HOVER_SLOWDOWN_FACTOR;

				// Минимальная скорость при hover
				if (Math.abs(newBall.vx) < CONFIG.MIN_SPEED_WHILE_HOVER && newBall.vx !== 0) {
					newBall.vx = newBall.vx > 0 ? CONFIG.MIN_SPEED_WHILE_HOVER : -CONFIG.MIN_SPEED_WHILE_HOVER;
				}
				if (Math.abs(newBall.vy) < CONFIG.MIN_SPEED_WHILE_HOVER && newBall.vy !== 0) {
					newBall.vy = newBall.vy > 0 ? CONFIG.MIN_SPEED_WHILE_HOVER : -CONFIG.MIN_SPEED_WHILE_HOVER;
				}
			} else {
				// Восстановление исходной скорости
				newBall.vx += (ball.originalVx - ball.vx) * CONFIG.SPEED_RECOVERY_RATE;
				newBall.vy += (ball.originalVy - ball.vy) * CONFIG.SPEED_RECOVERY_RATE;
			}

			// Движение
			newBall.x += newBall.vx;
			newBall.y += newBall.vy;

			// Отскок от стен
			if (newBall.x + newBall.radius > canvas.width) {
				newBall.x = canvas.width - newBall.radius;
				newBall.vx = -newBall.vx * CONFIG.BOUNCE_DAMPING;
				if (hoveredBall?.number !== ball.number) newBall.originalVx = -newBall.originalVx;
			}
			if (newBall.x - newBall.radius < 0) {
				newBall.x = newBall.radius;
				newBall.vx = -newBall.vx * CONFIG.BOUNCE_DAMPING;
				if (hoveredBall?.number !== ball.number) newBall.originalVx = -newBall.originalVx;
			}
			if (newBall.y + newBall.radius > canvas.height) {
				newBall.y = canvas.height - newBall.radius;
				newBall.vy = -newBall.vy * CONFIG.BOUNCE_DAMPING;
				if (hoveredBall?.number !== ball.number) newBall.originalVy = -newBall.originalVy;
			}
			if (newBall.y - newBall.radius < 0) {
				newBall.y = newBall.radius;
				newBall.vy = -newBall.vy * CONFIG.BOUNCE_DAMPING;
				if (hoveredBall?.number !== ball.number) newBall.originalVy = -newBall.originalVy;
			}

			return newBall;
		});

		ballsRef.current = newBalls;
		setBalls(newBalls);
	}, [hoveredBall]);

	// Рисование на canvas
	const draw = useCallback(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		ballsRef.current.forEach(ball => {
			ctx.beginPath();
			ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);

			// Цвет при hover
			if (hoveredBall && hoveredBall.number === ball.number) {
				ctx.fillStyle = CONFIG.BALL_HOVER_COLOR;
			} else {
				ctx.fillStyle = CONFIG.BALL_COLOR;
			}

			ctx.fill();
			ctx.strokeStyle = CONFIG.BALL_STROKE_COLOR;
			ctx.lineWidth = 2;
			ctx.stroke();

			// Номер внутри шарика
			ctx.font = `${CONFIG.TEXT_FONT_WEIGHT} ${ball.radius}px Arial`;
			ctx.fillStyle = CONFIG.TEXT_COLOR;
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.fillText(ball.number.toString(), ball.x, ball.y);
		});
	}, [hoveredBall]);

	// Анимационный цикл
	useEffect(() => {
		const animate = () => {
			updateBalls();
			draw();
			animationRef.current = requestAnimationFrame(animate);
		};

		animate();

		return () => {
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
			}
		};
	}, [updateBalls, draw]);

	return (
		<div style={{
			padding: '20px',
			background: CONFIG.OUTER_BG_COLOR,
			minHeight: '100vh',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			position: 'relative'
		}}>
			<canvas
				ref={canvasRef}
				width={CONFIG.CANVAS_WIDTH}
				height={CONFIG.CANVAS_HEIGHT}
				style={{
					border: `2px solid ${CONFIG.CANVAS_BORDER_COLOR}`,
					borderRadius: '10px',
					background: CONFIG.BACKGROUND_COLOR,
					display: 'block',
					cursor: 'pointer',
					boxShadow: CONFIG.CANVAS_BOX_SHADOW,
				}}
				onMouseMove={(e) => {
					checkHover(e.clientX, e.clientY);
				}}
				onMouseLeave={() => setHoveredBall(null)}
			/>

			{/* Подсказка рядом с курсором */}
			{hoveredBall && (
				<div
					style={{
						position: 'fixed',
						left: hoveredBall.x + 20,
						top: hoveredBall.y - 30,
						padding: '8px 16px',
						background: CONFIG.BALL_HOVER_COLOR,
						color: 'white',
						borderRadius: '20px',
						fontWeight: 'bold',
						fontSize: '14px',
						boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
						pointerEvents: 'none',
						zIndex: 1000,
						whiteSpace: 'nowrap',
						animation: 'fadeIn 0.2s ease',
					}}
				>
					title-{hoveredBall.number}
				</div>
			)}

			<style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
		</div>
	);
};

export default FloatingBalls;