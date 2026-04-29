'use client'
import React from 'react';
import cls from './style.module.scss';
import { Blob, Container } from '@/components/common';
import { scaleIn, sectionViewOps, slideIn } from '@/scripts/animation';
import { motion } from 'framer-motion'

export const SectionAbout = (props: any) => {

	const data = [
		{
			title: 'Сила команды.',
			subtitle: "Глубина экспертизы.",
			desc: "Топовые специалисты из России, за плечами которых — многолетний опыт в международных IT-гигантах.Это наша основа для решения амбициозных задач.",
			icon: "group.svg",
			image: "space-1.png"
		},
		{
			title: 'Полный цикл.',
			subtitle: "Digital разработки.",
			desc: "От концепции до релиза. Мы ведем проект на всех этапах, обеспечивая целостность и качество конечного решения.",
			icon: "dev.svg",
			image: "func.png",
			type: 'func'
		},
		{
			title: 'Работаем быстро.',
			subtitle: "AI-first подход.",
			desc: "Для нас искусственный интеллект — это встроенный процесс, который делает разработку умнее, быстрее и надежнее.  Мы автоматизируем рутину, чтобы фокусироваться на том, что важно: качестве и архитектуре вашего решения.",
			icon: "AI.svg",
			image: "space-2.png"
		},
	]


	return (<>
		<Container {...sectionViewOps({ delayChildren: 1 })} as='section' id='about' className={cls.wrap}>
			<motion.h2  {...slideIn({ asVariant: true, direction: 'left' })} className={`${cls.title} title`}>О нас</motion.h2>

			<Blob top='30%' translate={'-40%'} />
			<Blob translate={'40%'} right bottom />

			<ul className={cls.list}>
				{
					data.map((el, i) => (
						<li key={i} className={cls.item}>
							<motion.div {...sectionViewOps({ delayChildren: 1 })} className={cls.content}>
								<motion.div {...slideIn({ delay: 0.5, direction: 'right' })} className={`${cls.icon} icon-box`}>
									<img src={`/images/${el.icon}`} alt={el.title} data-icon={el.icon} />
								</motion.div>
								<motion.h3  {...slideIn({ delay: 0.6, direction: 'left' })} className={cls.subtitle}>{el.title}<br /><span>{el.subtitle}</span></motion.h3>
								<motion.p   {...slideIn({ delay: 0.7, direction: 'left' })} className={cls.desc}>{el.desc}</motion.p>
							</motion.div>
							<motion.div {...scaleIn({ delay: 0.5 })} className={cls.image} data-img={el.image}>
								<img src={`/images/${el.image}`} alt={el.image} />
								{el.type === 'func' && <>
									<span data-border />
									<span data-line='1' />
									<span data-line='2' />
								</>}
							</motion.div>
						</li>
					))
				}
			</ul>
		</Container>
	</>)
}

export default SectionAbout;