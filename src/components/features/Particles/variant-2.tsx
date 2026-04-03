'use client'
import React from 'react';
import { useRef, useEffect } from 'react';


interface Star {
	x: number;
	y: number;
	size: number;
	speed: number;
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
	life: number;
	decay: number;
}

const STAR_COUNT = 200;
const SHOOTING_INTERVAL = 3000;

export const Variant_2 = (props: any) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		let stars: Star[] = [];
		let shootingStars: ShootingStar[] = [];
		let animationId: number;
		let lastShootingTime = 0;

		function resize() {
			canvas!.width = window.innerWidth;
			canvas!.height = window.innerHeight;
		}

		function createStar(): Star {
			return {
				x: Math.random() * canvas!.width,
				y: Math.random() * canvas!.height,
				size: Math.random() * 2 + 0.5,
				speed: Math.random() * 0.3 + 0.05,
				opacity: Math.random() * 0.7 + 0.3,
				twinkleSpeed: Math.random() * 0.02 + 0.005,
				twinklePhase: Math.random() * Math.PI * 2,
			};
		}

		function createShootingStar(): ShootingStar {
			const angle = (Math.random() * 30 + 15) * (Math.PI / 180);
			const speed = Math.random() * 8 + 6;
			return {
				x: Math.random() * canvas!.width * 0.7,
				y: Math.random() * canvas!.height * 0.3,
				length: Math.random() * 80 + 40,
				speed,
				angle,
				vx: Math.cos(angle) * speed,
				vy: Math.sin(angle) * speed,
				opacity: 1,
				life: 1,
				decay: Math.random() * 0.01 + 0.008,
			};
		}

		function drawStar(star: Star, time: number) {
			const twinkle =
				Math.sin(time * star.twinkleSpeed + star.twinklePhase) * 0.3 + 0.7;
			const alpha = star.opacity * twinkle;
			ctx!.beginPath();
			ctx!.arc(star.x, star.y, star.size, 0, Math.PI * 2);
			ctx!.fillStyle = `rgba(200, 190, 255, ${alpha})`;
			ctx!.fill();

			if (star.size > 1.5) {
				ctx!.beginPath();
				ctx!.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
				ctx!.fillStyle = `rgba(166, 153, 239, ${alpha * 0.15})`;
				ctx!.fill();
			}
		}

		function drawShootingStar(ss: ShootingStar) {
			const tailX = ss.x - Math.cos(ss.angle) * ss.length;
			const tailY = ss.y - Math.sin(ss.angle) * ss.length;

			const gradient = ctx!.createLinearGradient(tailX, tailY, ss.x, ss.y);
			gradient.addColorStop(0, `rgba(166, 153, 239, 0)`);
			gradient.addColorStop(
				0.7,
				`rgba(200, 190, 255, ${ss.opacity * 0.5})`
			);
			gradient.addColorStop(1, `rgba(255, 255, 255, ${ss.opacity})`);

			ctx!.beginPath();
			ctx!.moveTo(tailX, tailY);
			ctx!.lineTo(ss.x, ss.y);
			ctx!.strokeStyle = gradient;
			ctx!.lineWidth = 2;
			ctx!.stroke();

			ctx!.beginPath();
			ctx!.arc(ss.x, ss.y, 3, 0, Math.PI * 2);
			ctx!.fillStyle = `rgba(255, 255, 255, ${ss.opacity})`;
			ctx!.fill();
		}

		function animate(timestamp: number) {
			const time = timestamp * 0.001;
			ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

			for (const star of stars) {
				star.y -= star.speed;
				star.x += star.speed * 0.2;
				if (star.y < -10) {
					star.y = canvas!.height + 10;
					star.x = Math.random() * canvas!.width;
				}
				if (star.x > canvas!.width + 10) {
					star.x = -10;
				}
				drawStar(star, time);
			}

			if (timestamp - lastShootingTime > SHOOTING_INTERVAL) {
				shootingStars.push(createShootingStar());
				lastShootingTime = timestamp;
			}

			for (let i = shootingStars.length - 1; i >= 0; i--) {
				const ss = shootingStars[i];
				ss.x += ss.vx;
				ss.y += ss.vy;
				ss.life -= ss.decay;
				ss.opacity = Math.max(0, ss.life);

				drawShootingStar(ss);

				if (
					ss.life <= 0 ||
					ss.x > canvas!.width + 100 ||
					ss.y > canvas!.height + 100
				) {
					shootingStars.splice(i, 1);
				}
			}

			animationId = requestAnimationFrame(animate);
		}

		resize();
		stars = Array.from({ length: STAR_COUNT }, createStar);

		animationId = requestAnimationFrame(animate);
		window.addEventListener('resize', resize);

		return () => {
			cancelAnimationFrame(animationId);
			window.removeEventListener('resize', resize);
			stars = [];
			shootingStars = [];
		};
	}, []);

	return <canvas ref={canvasRef} style={{
		position: 'fixed',
		top: 0,
		left: 0,
		width: '100%',
		height: '100%',
		zIndex: -1,
		pointerEvents: 'none',
		background: '#18072e',
	}} />;
}

export default Variant_2;