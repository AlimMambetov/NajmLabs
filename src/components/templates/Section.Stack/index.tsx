'use client'
import React from 'react';
import cls from './style.module.scss';
import { Blob, Container } from '@/components/common';
import FloatingBalls from '@/components/features/SpaceComponent';
import { slideIn } from '@/scripts/animation';
import { motion } from 'framer-motion'


export const SectionsStack = (props: any) => {


	return (<>
		<Container id='steck' as='section' className={cls.wrap}>
			<Blob right bottom colors={'orange'} translate={'50% 30%'} />
			<Blob translate={'-30% 30%'} />
			<motion.h2 {...slideIn({ direction: 'left', delay: 0.5 })} className={`title ${cls.title}`}>Стек технологий</motion.h2>
			<FloatingBalls />
		</Container>
	</>)
}

export default SectionsStack;