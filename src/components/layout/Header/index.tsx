'use client'
import React, { useState } from 'react';
import cls from './style.module.scss';
import { Container } from '@/components/layout';
import { setId } from '@/scripts';
import { Icon } from '@/components/ui';
import { useScreen } from '@/hooks';


const nav = [
	{
		id: setId(),
		title: 'О нас',
		link: '#about'
	},
	{
		id: setId(),
		title: 'Услуги',
		link: '#services'
	},
	{
		id: setId(),
		title: 'Портфолио',
		link: '#portfolio'
	},
	{
		id: setId(),
		title: 'Стек',
		link: '#steck'
	},
	{
		id: setId(),
		title: 'Вопросы',
		link: '#faq'
	},
	{
		id: setId(),
		title: 'Контакты',
		link: '#contacts'
	},
];


export const Header = (props: any) => {
	const { isTouch } = useScreen();
	const [menuIsOpen, menuIsOpenSetter] = useState(false);

	const toggleMenu = () => menuIsOpenSetter(prev => !prev);

	const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
		e.preventDefault();
		menuIsOpenSetter(false);
		const element = document.querySelector(hash);
		if (element) {
			element.scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			});
			// Обновляем URL без перезагрузки
			window.history.pushState(null, '', hash);
		}
	};

	return (
		<Container as='header' className={`glass-box ${cls.header}`}>
			<div className={cls.logo} onClick={() => window.location.reload()}>
				<img src="/images/full-logo.svg" alt="NajmLabs" />
			</div>

			<nav data-open={isTouch ? menuIsOpen : null} className={`${cls.menu} ${isTouch && 'glass-box'}`}>
				{nav.map((item) => (
					<a
						key={item.id}
						href={item.link}
						onClick={(e) => handleScroll(e, item.link)}
					>
						{item.title}
					</a>
				))}
			</nav>

			{isTouch && <Icon
				as={menuIsOpen ? 'cross' : 'menu'}
				onClick={toggleMenu}
				className={cls.menuBtn}
			/>}
		</Container>
	);
};

export default Header;