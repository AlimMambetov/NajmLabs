'use client'
import React from 'react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Container } from '@/components/layout';
import cls from './style.module.scss';
import { Icon } from '@/components/ui';

export const SectionServices = (props: any) => {
	const [activeIndex, setActiveIndex] = useState(0);
	const [targetIndex, setTargetIndex] = useState(null);
	const items = [
		{
			title: "Mobile",
			icon: "mobile",
			desc: "Превращаем идеи в мобильные хиты: от MVP до enterprise-решений, которыми пользуются ежедневно",
			list: ["Разработка под iOS/Android с упором на производительность", "Кроссплатформенные решения (Flutter, React Native) для быстрого запуска", "Полный цикл: от идеи и прототипа до публикации в Store", "Интеграция с любыми API, CRM и эквайрингом", "Глубокая проработка UX/UI для удержания пользователей"]
		},
		{
			title: "DESKTOP",
			icon: "pc",
			desc: "Тяжелая артиллерия для вашего бизнеса: создаем ПО, которое управляет процессами, оборудованием и данными.",
			list: ["Высоконагруженные приложения для Windows и macOS", "Реализация сложной бизнес-логики и парсинг данных", "Интеграция с профильным оборудованием (кассы, станки, сканеры)", "Кроссплатформенные десктоп-решения (C++, C#, Electron)", "Тонкая настройка под требования конкретных индустрий"]
		},
		{
			title: "Геймдев",
			icon: "keyboard",
			desc: "Создаем миры, в которые хочется возвращаться. От гиперказуальных хитов до сложных RPG и бизнес-симуляторов.",
			list: ["Разработка мобильных игр (iOS, Android) с высоким retention", "Браузерные игры и проекты для PC (Unity, Unreal Engine)", "Создание бизнес-симуляторов и serious games для обучения сотрудников", "Качественная 2D/3D графика, персонажная анимация и VFX", "Внедрение систем монетизации и аналитики (AppsFlyer, Firebase)"]
		},
		{
			title: "WEB",
			icon: "laptop",
			desc: "Строим цифровые экосистемы, которые автоматизируют продажи и экономят ресурсы.",
			list: ["Промо-сайты и лендинги с высоким коэффициентом конверсии", "Сложные веб-сервисы, порталы и кабинеты для партнеров", "Интернет-магазины с безупречной логистикой и юзабилити", "Микросервисная архитектура и работа с высокими нагрузками (HighLoad)", "Внутренняя SEO-оптимизация для быстрого роста в поиске"]
		},
		{
			title: "UI/UX-дизайн",
			icon: "figma",
			desc: "Проектируем интерфейсы, которые не нужно объяснять. Дизайн, ведущий пользователя за руку к целевому действию.",
			list: ["Прототипирование и CJM (Customer Journey Map) для снижения рисков", "Адаптивный UI-дизайн для сайтов, мобильных и десктоп-приложений", "Разработка дизайн-систем и гайдлайнов для масштабирования продукта", "Брендинг и создание визуальной айдентики с нуля", "Дизайн лендингов с фокусом на конверсию (CRO)"]
		},
	];

	useEffect(() => {
		if (targetIndex !== null && targetIndex !== activeIndex) {
			const totalItems = items.length;
			let diff = targetIndex - activeIndex;

			if (Math.abs(diff) > totalItems / 2) {
				diff = diff > 0 ? diff - totalItems : diff + totalItems;
			}

			const direction = diff > 0 ? 1 : -1;

			const timer = setTimeout(() => {
				setActiveIndex((activeIndex + direction + totalItems) % totalItems);
			}, 100);

			return () => clearTimeout(timer);
		}
	}, [activeIndex, targetIndex, items.length]);

	const handleItemClick = (clickedIndex: any) => {
		if (clickedIndex === activeIndex) return;
		setTargetIndex(clickedIndex);
	};

	const getEllipticalPosition = (itemIndex: any, currentIndex: any) => {
		const totalItems = items.length;
		const angle = ((itemIndex - currentIndex) / totalItems) * Math.PI * 2;

		const radiusX = 300;
		const radiusY = -150;

		const x = Math.sin(angle) * radiusX;
		const y = Math.cos(angle) * radiusY;
		const scale = 0.3 + (Math.cos(angle) + 1) * 0.2;
		const zIndex = Math.floor((Math.cos(angle) + 1) * 50) + 10;

		return { x, y, scale, zIndex };
	};

	return (
		<Container id='services' className={cls.wrap}>

			<div className={cls.orbit} >
				{items.map((item: any, i) => {
					const { x, y, scale, zIndex } = getEllipticalPosition(i, activeIndex);

					return (
						<motion.div
							key={i}
							style={{
								position: 'absolute',
								zIndex: zIndex,
								cursor: 'pointer',
							}}
							animate={{ x, y, scale }}
							transition={{ type: 'spring', stiffness: 300, damping: 30 }}
							onClick={() => handleItemClick(i)}
							className={cls.planet}
						>
							<div className={cls.planet__content}>
								<Icon as={item.icon} />
							</div>
						</motion.div>
					);
				})}

				<button onClick={() => handleItemClick((activeIndex + 1) % items.length)}>Вперед</button>
				<button onClick={() => handleItemClick((activeIndex - 1 + items.length) % items.length)}>Назад</button>
			</div>
		</Container>
	);
}

export default SectionServices;