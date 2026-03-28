'use client'
import React from 'react';
import cls from './style.module.scss';
import { Container } from '@/components/layout';

export const SectionAbout = (props: any) => {

	const data = [
		{
			title: 'Сила команды.',
			subtitle: "Глубина экспертизы.",
			desc: "Топовые специалисты из России, за плечами которых — многолетний опыт в международных IT гигантах.Это наша основа для решения амбициозных задач.",
			icon: "group.svg",
			image: "space-1.svg"
		},
		{
			title: 'Полный цикл.',
			subtitle: "Digital разработки.",
			desc: "От концепции до релиза. Мы ведем проект на всех этапах, обеспечивая целостность и качество конечного решения.",
			icon: "dev.svg",
			image: "func.svg",
			type: 'func'
		},
		{
			title: 'Работаем быстро.',
			subtitle: "AI-first подход.",
			desc: "Для нас искусственный интеллект — это embedded процесс, который делает разработку умнее, быстрее и надежнее.  Мы автоматизируем рутину, чтобы фокусироваться на том, что важно: качестве и архитектуре вашего решения.",
			icon: "AI.svg",
			image: "space-2.svg"
		},
	]


	return (<>
		<Container id='about' className={cls.wrap}>
			<h2 className={`${cls.title} title`}>О нас</h2>

			<ul className={cls.list}>
				{
					data.map((el, i) => (
						<li key={i} className={cls.item}>
							<div className={cls.content}>
								<div className={`${cls.icon} icon-box`}>
									<img src={`/images/${el.icon}`} alt={el.title} data-icon={el.icon} />
								</div>
								<h3 className={cls.subtitle}>{el.title}<br /><span>{el.subtitle}</span></h3>
								<p className={cls.desc}>{el.desc}</p>
							</div>
							<div className={cls.image} data-img={el.image}>
								<img src={`/images/${el.image}`} alt={el.image} />
								{el.type === 'func' && <>
									<span data-border />
									<span data-line='1' />
									<span data-line='2' />
								</>}
							</div>
						</li>
					))
				}
			</ul>
		</Container>
	</>)
}

export default SectionAbout;