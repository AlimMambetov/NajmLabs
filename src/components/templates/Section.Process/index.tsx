'use client'
import React from 'react';
import cls from './style.module.scss';
import { Blob, Container } from '@/components/common';
import { motion } from 'framer-motion'
import { scaleIn, slideIn } from '@/scripts/animation';


export const SectionProcess = (props: any) => {

	const data = [
		{
			title: 'Анализ и планирование',
			desc: "Погружаемся в ваш бизнес, изучаем аудиторию и конкурентов. Создаём детальный план, чтобы каждый следующий шаг был осознанным и эффективным.",
			subtitle: "Вы получаете:",
			result: "Чёткое ТЗ, roadmap проекта и понимание, как будет выглядеть результат.",
			image: "analys.svg",
			vector: "vector-1.svg",
		},
		{
			title: 'Дизайн и прототипирование',
			desc: "Создаём интерактивный прототип, который показывает логику сайта. Затем — уникальный дизайн, отражающий ценности вашего бренда  и удобный для пользователей.",
			subtitle: "Вы получаете:",
			result: "Готовый дизайн всех экранов в Figma, который можно «пощупать» до начала разработки.",
			image: "design.svg",
			vector: "vector-2.svg",
		},
		{
			title: 'Разработка',
			desc: "Пишем чистый код, настраиваем сервер, интегрируем CMS и платежные системы. Создаём быстрый, безопасный и адаптивный продукт.",
			subtitle: "Вы получаете:",
			result: "Рабочую версию сайта на тестовом домене с возможностью вносить правки.",
			image: "dev.svg",
			vector: "vector-3.svg",
		},
		{
			title: 'Тестирование',
			desc: "Проверяем сайт на 20+ устройствах, тестируем скорость, безопасность и удобство. Исправляем мелкие недочёты, чтобы всё работало идеально.",
			subtitle: "Вы получаете:",
			result: "Отчёт по тестированию и полностью готовый к запуску проект.",
			image: "test.svg",
			vector: "vector-4.svg",
		},
		{
			title: 'Запуск и поддержка',
			desc: "Переносим сайт на ваш хостинг, подключаем аналитику и домен. Обучаем вашу команду и остаёмся на связи для оперативной поддержки.",
			subtitle: "Вы получаете:",
			result: "Работающий сайт, доступ в админку и уверенность, что мы всегда поможем.",
			image: "start.svg",
		},

	]


	return (<>
		<Container as='section' id="process" className={cls.wrap}>
			<Blob colors={'orange'} translate={'-80% 20%'} />
			<Blob translate={'-40%'} left bottom />
			<Blob colors={'orange'} translate={'80%'} right bottom='30%' />

			<motion.h2 {...slideIn({ asVariant: true, direction: 'left' })} className={`${cls.title} title`}>Процесс работы</motion.h2>
			<ul className={cls.list}>
				{data.map((item: any, index) => (
					<li key={index} className={cls.item}>
						<motion.div {...slideIn({ delay: 0.5, direction: 'right' })} className={`${cls.index} icon-box`}> <span>{index + 1}</span>	</motion.div>
						<motion.div className={cls.content}>
							<motion.h3 {...slideIn({ delay: 0.6, direction: 'left' })} className={cls.itemTitle}>{item.title}</motion.h3>
							<motion.p {...slideIn({ delay: 0.7, direction: 'left' })} className={cls.desc}>{item.desc}</motion.p>
							<motion.p {...slideIn({ delay: 0.8, direction: 'left' })} className={cls.subtitle}>{item.subtitle}</motion.p>
							<motion.p {...slideIn({ delay: 0.9, direction: 'left' })} className={cls.result}>{item.result}</motion.p>
						</motion.div>
						<motion.div {...scaleIn({ delay: 0.5 })} className={cls.image}>
							<img src={`/images/process/${item.image}`} alt={item.image} />
						</motion.div>
						{index !== data.length - 1 && (
							<div className={cls.vector} data-vector={index + 1}>
								<img src={`/images/${item.vector}`} alt="vector" />
							</div>
						)}
					</li>
				))}
			</ul>
		</Container>
	</>)
}

export default SectionProcess;