'use client'
import React from 'react';
import cls from './style.module.scss';
import { Container } from '@/components/layout';
import { CirlceAnim } from '@/components/common';

export const SectionHero = (props: any) => {


	return (<>
		<Container id="hero" className={cls.wrap}>
			<div className={cls.content}>
				<h1 className={cls.title}>NajmLabs - студия <br /> разработки IT-продуктов</h1>
				<p className={cls.desc}>Разработка корпоративных сайтов, бизнес-приложений, <br /> создание игровых проектов и профессиональный дизайн.</p>
				<p className={cls.subtitle}>Технологии, которые решают задачи.</p>
				<button className={cls.btn}>Написать нам</button>
			</div>

			<CirlceAnim className={cls.circle} />
		</Container>
	</>)
}

export default SectionHero;