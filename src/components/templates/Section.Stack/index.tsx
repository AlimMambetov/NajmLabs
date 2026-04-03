'use client'
import React from 'react';
import cls from './style.module.scss';
import { Container } from '@/components/common';
import FloatingBalls from '@/components/features/SpaceComponent';

export const SectionsStack = (props: any) => {


	return (<>
		<Container id='steck' as='section' className={cls.wrap}>
			<h2 className={`title ${cls.title}`}>Стек технологий</h2>
			<FloatingBalls />
		</Container>
	</>)
}

export default SectionsStack;