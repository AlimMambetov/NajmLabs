'use client'
import React from 'react';
import cls from './style.module.scss';
import { Blob, Container } from '@/components/common';
import { Accordion } from '@/components/ui';
import FAQ from '&/data/FAQ.json'
import { motion } from 'framer-motion'
import { scaleIn, slideIn } from '@/scripts/animation';


export const SectionsFAQ = (props: any) => {


	const accordions = FAQ.map((item, index) => {
		return <div key={index}>
			<motion.div {...slideIn({ direction: 'up', delay: 0.5 + 0.2 * index })} >
				<Accordion defaultOpen={index == 0} label={item.question}>{item.answer}</Accordion>
			</motion.div>
		</div>
	})

	return (<>
		<Container id='FAQ' as='section' className={cls.wrap}>
			<Blob right bottom translate={'50% 30%'} />
			<Blob colors={'orange'} translate={'-60% 30%'} />
			<div className={cls.titles}>
				<motion.h2  {...slideIn({ direction: 'left', delay: 0.5 })} className={`${cls.title} title`}>Вопросы</motion.h2>
				<motion.h3 {...slideIn({ direction: 'up', delay: 0.6 })} className={cls.subtitle}>которые у вас могут возникнуть.</motion.h3>
				<motion.img {...scaleIn({ delay: 0.8 })} src="/images/space-4.svg" alt="decor" />
			</div>
			<div className={cls.accordion}>{accordions}</div>
		</Container>
	</>)
}

export default SectionsFAQ;