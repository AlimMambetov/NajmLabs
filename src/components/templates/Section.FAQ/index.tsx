'use client'
import React from 'react';
import cls from './style.module.scss';
import { Container } from '@/components/common';
import { Accordion } from '@/components/ui';
import FAQ from '&/data/FAQ.json'

export const SectionsFAQ = (props: any) => {


	const accordions = FAQ.map((item, index) => {
		return <Accordion key={index} label={item.question}>{item.answer}</Accordion>
	})

	return (<>
		<Container id='FAQ' as='section' className={cls.wrap}>
			<div className={cls.titles}>
				<h2 className={`${cls.title} title`}>Вопросы</h2>
				<h3 className={cls.subtitle}>которые у вас могут возникнуть.</h3>
				<img src="/images/space-4.svg" alt="decor" />
			</div>
			<div className={cls.accordion}>{accordions}</div>
		</Container>
	</>)
}

export default SectionsFAQ;