'use client'
import React from 'react';
import cls from './style.module.scss';
import { Container } from '@/components/layout';

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
		<Container id="process" className={cls.wrap}>
			<h2 className={`${cls.title} title`}>Процесс работы</h2>
			<ul className={cls.list}>
				{data.map((item: any, index) => (
					<li key={index} className={cls.item}>
						<div className={`${cls.index} icon-box`}> <span>{index + 1}</span>	</div>
						<div className={cls.content}>
							<h3 className={cls.itemTitle}>{item.title}</h3>
							<p className={cls.desc}>{item.desc}</p>
							<p className={cls.subtitle}>{item.subtitle}</p>
							<p className={cls.result}>{item.result}</p>
						</div>
						<div className={cls.image}>
							<img src={`/images/process/${item.image}`} alt={item.image} />
						</div>
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