'use client'
import React, { useState } from 'react';
import cls from './style.module.scss';
import { Container } from '@/components/common';
import { scrollToElement, setId } from '@/scripts';
import { Icon, LiquidGlass } from '@/components/common';
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
		link: '#FAQ'
	},
	{
		id: setId(),
		title: 'Контакты',
		link: '#contact'
	},
];


export const Header = (props: any) => {
	const { isTouch } = useScreen();
	const [menuIsOpen, menuIsOpenSetter] = useState(false);

	const toggleMenu = () => menuIsOpenSetter(prev => !prev);


	return (
		<Container as='header' className={`${cls.header}`}>
			<LiquidGlass className={`${cls.header__content} glass-box`}>
				<div className={cls.logo} onClick={() => window.location.reload()}>
					<img src="/images/full-logo.svg" alt="NajmLabs" />
				</div>


				{
					isTouch ?
						<LiquidGlass data-open={menuIsOpen} className={`${cls.menu} glass-box`}>
							{nav.map((item) => (
								<a
									key={item.id}
									href={item.link}
									onClick={(e) => { e.preventDefault(); scrollToElement(item.link); menuIsOpenSetter(false); }}
								>
									{item.title}
								</a>
							))}
						</LiquidGlass>
						:
						<nav className={cls.menu}>
							{nav.map((item) => (
								<a
									key={item.id}
									href={item.link}
									onClick={(e) => { e.preventDefault(); scrollToElement(item.link); menuIsOpenSetter(false); }}
								>
									{item.title}
								</a>
							))}
						</nav>
				}



				{isTouch && <Icon
					as={menuIsOpen ? 'cross' : 'menu'}
					onClick={toggleMenu}
					className={cls.menuBtn}
				/>}
			</LiquidGlass>
		</Container>
	);
};

export default Header;