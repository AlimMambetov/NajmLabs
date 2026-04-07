'use client'
import React, { useState } from 'react';
import cls from './style.module.scss';
import { Container, Icon } from '@/components/common';
import portfolioJSON from '&/data/portfolio.json';
import { motion } from 'framer-motion';




const SliderGallery = ({ activeItem, data, activeIndexSetter, activeIndex, next, prev, isBegin, isEnd }: any) => {

	return <div className={cls.slider}>
		<motion.div
			className={cls.index}
			key={activeIndex}
			initial={{ scale: 0.5, opacity: 0 }}
			animate={{ scale: 1, opacity: 0.2 }}
			exit={{ scale: 1.5, opacity: 0 }}
			transition={{
				duration: 0.3,
				type: "spring",
				stiffness: 300,
				damping: 20
			}}
		>{activeIndex + 1}</motion.div>
		<div className={cls.preview}>
			<motion.img
				key={activeIndex}
				src={activeItem.preview}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				transition={{ duration: 0.5 }}
			/>
		</div>
		<div className={cls.pag}>
			{data.map((el: any, i: number) =>
				<div
					onClick={() => activeIndexSetter(i)}
					data-active={activeIndex == i || null}
					key={i}
					className={cls.pag__item}
				>
					{activeIndex == i && <motion.div layoutId='active-border' className={cls.activeBorder} />}
					<img src={el.preview} />
				</div>)}
		</div>
		<div className={cls.controlls}>
			<button disabled={isBegin} onClick={prev}><Icon whileTap={{ scale: 0.8, x: -5 }} as='arrow-L' /></button>
			<button disabled={isEnd} onClick={next}><Icon whileTap={{ scale: 0.8, x: 5 }} as='arrow-R' /></button>
		</div>
	</div>
}

const SliderInfo = ({ activeIndex, title, desc, tags, links }: any) => {

	const fadeUp = {
		hidden: { opacity: 0, y: 20 },
		visible: (i: number) => ({
			opacity: 1,
			y: 0,
			transition: { delay: i * 0.1, duration: 0.5 }
		})
	};

	const fadeLeft = {
		hidden: { opacity: 0, x: -20 },
		visible: (i: number) => ({
			opacity: 1,
			x: 0,
			transition: { delay: i * 0.1, duration: 0.5 }
		})
	};

	return (
		<motion.div
			className={`${cls.info} glass-box`}
			initial="hidden"
			animate="visible"
			key={activeIndex}
		>
			{tags && (
				<motion.div className={cls.tags} custom={0} variants={fadeUp}>
					{tags.map((tag: string, i: number) => (
						<motion.span
							key={i}
							className={cls.tags__item}
							custom={i + 1}
							variants={fadeUp}
						>
							{tag}
						</motion.span>
					))}
				</motion.div>
			)}

			{title && (
				<motion.div
					className={cls.title}
					custom={tags ? tags.length : 0}
					variants={fadeLeft}
				>
					{title}
				</motion.div>
			)}

			{desc && (
				<motion.div
					className={cls.desc}
					custom={tags ? tags.length + 1 : 1}
					variants={fadeUp}
				>
					{desc}
				</motion.div>
			)}

			{links && (
				<motion.div
					className={cls.links}
					custom={tags ? tags.length + 2 : 2}
					variants={fadeUp}
				>
					{links.map((link: any, i: number) => (
						<motion.a
							key={i}
							target='_blank'
							href={link.url}
							className={cls.links__item}
							custom={i + (tags ? tags.length + 3 : 3)}
							variants={fadeUp}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							{link.label}
						</motion.a>
					))}
				</motion.div>
			)}
		</motion.div>
	);
}


export const SectionPortfolioTest = (props: any) => {
	const [activeIndex, activeIndexSetter] = useState(0)
	const activeItem = portfolioJSON[activeIndex];
	const isBegin = activeIndex === 0;
	const isEnd = activeIndex === portfolioJSON.length - 1;

	const next = () => {
		activeIndexSetter((prev) =>
			prev === portfolioJSON.length - 1 ? 0 : prev + 1
		)
	}

	const prev = () => {
		activeIndexSetter((prev) =>
			prev === 0 ? portfolioJSON.length - 1 : prev - 1
		)
	}

	const galleryOps = {
		activeIndex,
		data: portfolioJSON,
		activeItem,
		next, prev,
		isBegin, isEnd,
		activeIndexSetter
	}

	const infoOps = {
		activeIndex,
		...activeItem
	}

	return (<>
		<Container as='section' className={cls.wrap} id='portfolio'>
			<h2 className={`${cls.title} title`}>Портфолио</h2>

			<div className={cls.portfolio}>
				<SliderGallery {...galleryOps} />
				<SliderInfo {...infoOps} />
			</div>
		</Container>
	</>)
}

export default SectionPortfolioTest;