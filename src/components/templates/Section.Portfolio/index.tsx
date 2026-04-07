'use client'
import React, { useEffect, useRef, useState } from 'react'
import cls from './style.module.scss'
import { Blob, Container } from '@/components/common'
import portfolioJSON from '&/data/portfolio.json'
import { motion, useMotionValue, useSpring } from 'framer-motion'

type ItemProps = {
	item: any
	index: number
}

const PortfolioItem = ({ item, index }: ItemProps) => {
	const { title, subtitle, desc, stats, tags, preview } = item
	const isEven = index % 2 === 0;
	const isOdd = index % 2 !== 0;

	const imgRef = useRef<any>(null)
	const rectRef = useRef<DOMRect | null>(null)
	const rotateX = useMotionValue(0)
	const rotateY = useMotionValue(0)

	const smoothRotateX = useSpring(rotateX, { stiffness: 200, damping: 20 })
	const smoothRotateY = useSpring(rotateY, { stiffness: 200, damping: 20 })

	const handleMouseEnter = () => {
		if (imgRef.current) {
			rectRef.current = imgRef.current.getBoundingClientRect()
		}
	}

	const handleMouseMove = (e: any) => {
		if (!rectRef.current) return

		const rect = rectRef.current

		const centerX = rect.left + rect.width / 2
		const centerY = rect.top + rect.height / 2

		const moveX = (e.clientX - centerX) / (rect.width / 2)
		const moveY = (e.clientY - centerY) / (rect.height / 2)

		const maxRotate = 10

		rotateY.set(moveX * maxRotate)
		rotateX.set(-moveY * maxRotate)
	}
	const handleMouseLeave = () => {
		rotateX.set(0)
		rotateY.set(0)
	}

	useEffect(() => {
		rotateX.set(0.01)
		rotateY.set(0.01)

		setTimeout(() => {
			rotateX.set(0)
			rotateY.set(0)
		}, 0)
	}, [])



	return (
		<motion.div
			className={cls.item}
		>
			{isOdd && <Blob translate={'-50%'} />}
			{isEven && <Blob colors={'orange'} translate={'40% -20%'} right />}

			<div className={cls.info}>
				<h3 className={cls.info__title}>{title}</h3>
				<h5 className={cls.info__subtitle}>{subtitle}</h5>
				<p className={cls.info__desc}>{desc}</p>

				<ul className={cls.info__stats}>
					{stats.map((stat: any, i: number) => (
						<li className={cls.info__stat} key={i}>
							<b>{stat.value}</b>
							<span>{stat.label}</span>
						</li>
					))}
				</ul>

				<ul className={cls.info__tags}>
					{tags.map((tag: any, i: number) => (
						<li className={cls.info__tag} key={i}>
							{tag}
						</li>
					))}
				</ul>
			</div>

			<motion.div
				className={cls.preview}
				onMouseMove={handleMouseMove}
				onMouseLeave={handleMouseLeave}
				onMouseEnter={handleMouseEnter}
			>
				<motion.img
					ref={imgRef}
					src={preview}
					style={{
						rotateX: smoothRotateX,
						rotateY: smoothRotateY
					}}
				/>
			</motion.div>
		</motion.div>
	)
}

export const SectionPortfolio = () => {
	return (
		<Container as='section' className={cls.wrap} id='portfolio'>
			<h2 className={`${cls.title} title`}>Портфолио</h2>

			<div className={cls.portfolio}>
				{portfolioJSON.map((item, index) => (
					<PortfolioItem key={index} item={item} index={index} />
				))}
			</div>
		</Container>
	)
}

export default SectionPortfolio