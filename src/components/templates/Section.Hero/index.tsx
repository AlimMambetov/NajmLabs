'use client'
import React from 'react';
import cls from './style.module.scss';
import { CirlceAnim } from '@/components/features';
import { scrollToElement } from '@/scripts';
import { Blob, Container } from '@/components/common';
import { fadeIn, scaleIn, sectionViewOps, slideIn } from '@/scripts/animation';
import { motion } from 'framer-motion'

export const SectionHero = (props: any) => {



	return (<>
		<Container as='section' id="hero" className={cls.wrap}>
			<Blob translate={'-40% -50%'} />
			<Blob colors={'orange'} translate={'40% 40%'} right bottom />
			<div className={cls.content}>
				<motion.h1 {...slideIn({ mode: "animate", delay: 0.5 })} className={cls.title}>NajmLabs - студия <br /> разработки IT-продуктов</motion.h1>
				<motion.p  {...slideIn({ mode: "animate", delay: 0.6 })} className={cls.desc}>Разработка корпоративных сайтов, бизнес-приложений, <br /> создание игровых проектов и профессиональный дизайн.</motion.p>
				<motion.p  {...slideIn({ mode: "animate", delay: 0.7 })} className={cls.subtitle}>Технологии, которые решают задачи.</motion.p>
				<motion.button  {...slideIn({ mode: "animate", delay: 0.8 })} onClick={(e) => scrollToElement('#contact')} className={cls.btn}>Написать нам</motion.button>
			</div>

			<motion.div {...scaleIn({ mode: "animate", delay: .4 })} className={cls.circlebox}>
				<CirlceAnim className={cls.circle} />
			</motion.div>
		</Container>
	</>)
}

export default SectionHero;