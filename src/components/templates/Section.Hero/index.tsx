'use client'
import React from 'react';
import cls from './style.module.scss';
import { CirlceAnim } from '@/components/features';
import { scrollToElement } from '@/scripts';
import { Blob, Container } from '@/components/common';

export const SectionHero = (props: any) => {



	return (<>
		<Container as='section' id="hero" className={cls.wrap}>
			<Blob translate={'-40% -50%'} animate />
			<Blob colors={'orange'} translate={'40% 40%'} right bottom animate />
			<div className={cls.content}>
				<h1 className={cls.title}>NajmLabs - студия <br /> разработки IT-продуктов</h1>
				<p className={cls.desc}>Разработка корпоративных сайтов, бизнес-приложений, <br /> создание игровых проектов и профессиональный дизайн.</p>
				<p className={cls.subtitle}>Технологии, которые решают задачи.</p>
				<button onClick={(e) => scrollToElement('#contact')} className={cls.btn}>Написать нам</button>
			</div>

			<CirlceAnim className={cls.circle} />
		</Container>
	</>)
}

export default SectionHero;