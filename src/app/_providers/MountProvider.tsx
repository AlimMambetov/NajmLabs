'use client'
import React, { ReactNode, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Particles } from '@/components/layout';

const Loader = () => {
	const styles = {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		height: '100vh',
		width: '100vw',
		backgroundColor: '#18072e',
		color: 'white',
		position: 'fixed',
		top: 0,
		left: 0,
		zIndex: 9999,
		gap: '20px'
	} as React.CSSProperties;

	const LoadingComplex = () => (
		<div style={{ textAlign: 'center' }}>
			<motion.div
				style={{
					width: '60px',
					height: '60px',
					margin: '0 auto',
					position: 'relative',
				}}
			>
				<motion.div
					style={{
						position: 'absolute',
						width: '100%',
						height: '100%',
						border: '3px solid rgba(255, 255, 255, 0.2)',
						borderRadius: '50%',
					}}
				/>
				<motion.div
					style={{
						position: 'absolute',
						width: '100%',
						height: '100%',
						border: '3px solid transparent',
						borderTop: '3px solid white',
						borderRadius: '50%',
					}}
					animate={{ rotate: 360 }}
					transition={{
						duration: 0.8,
						repeat: Infinity,
						ease: "linear"
					}}
				/>
				<motion.div
					style={{
						position: 'absolute',
						width: '100%',
						height: '100%',
						border: '3px solid transparent',
						borderRight: '3px solid rgba(255, 255, 255, 0.8)',
						borderRadius: '50%',
					}}
					animate={{ rotate: -360 }}
					transition={{
						duration: 1.2,
						repeat: Infinity,
						ease: "linear"
					}}
				/>
			</motion.div>
			<motion.p
				style={{
					marginTop: '20px',
					fontSize: '14px',
					letterSpacing: '2px',
					color: 'rgba(255, 255, 255, 0.8)',
				}}
				animate={{
					opacity: [0.5, 1, 0.5],
				}}
				transition={{
					duration: 1.5,
					repeat: Infinity,
					ease: "easeInOut"
				}}
			>
				ЗАГРУЗКА...
			</motion.p>
		</div>
	);

	return (
		<motion.div
			style={styles}
			initial={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.5, ease: "easeInOut" }}
		>
			{/* <LoadingComplex /> */}
			<Particles variant={1} />
			<img style={{ width: 'min(50vw, 50vh)' }} src={'/images/logo.svg'} />
			<h2 style={{ fontSize: 'min(10vw, 10vh)', color: '#a699ef' }} >NajmLabs</h2>
		</motion.div>
	);
}

export const MountProvider = ({ children }: { children?: ReactNode }) => {
	const [showContent, setShowContent] = useState(false);
	const [renderContent, setRenderContent] = useState(false);
	const timeout = process.env.NODE_ENV === 'production' ? 500 : 10;

	useEffect(() => {
		setRenderContent(true)
		const timer = setTimeout(() => {
			setShowContent(true)
		}, timeout)

		return () => clearTimeout(timer)
	}, [])

	return (
		<>
			<AnimatePresence>
				{!showContent && <Loader />}
			</AnimatePresence>
			<AnimatePresence>
				{renderContent && (
					<motion.div
						style={{ display: 'contents' }}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.5, delay: timeout / 1000, ease: "easeOut" }}
					>
						{children}
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}

export default MountProvider;