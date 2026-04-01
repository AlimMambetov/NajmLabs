'use client'
import React from 'react';
import cls from './style.module.scss';
import { Container } from '@/components/layout';

export const SectionPortfolio = (props: any) => {


	return (<>
		<Container as='section' className={cls.wrap} id='portfolio'>
			<h2 className={`${cls.title} title`}>Портфолио</h2>
		</Container>
	</>)
}

export default SectionPortfolio;