'use client'
import React, { useEffect, useRef, useState } from 'react';
import cls from './style.module.scss';
import { Container } from '@/components/common';
import { scrollToElement, setId } from '@/scripts';
import { Icon, LiquidGlass } from '@/components/common';
// import { useScreen } from '@/hooks';
import { useMotionValueEvent, useScroll } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';


export const nav = [
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
		title: 'Контакты',
		link: '#contact'
	},
	{
		id: setId(),
		title: 'Вопросы',
		link: '/FAQ'
	},
];


export const Header = (props: any) => {
	// const { isTouch } = useScreen();
	const isTouch = false;
	const router = useRouter();
	const pathname = usePathname();
	const isHome = pathname == '/';
	const [menuIsOpen, menuIsOpenSetter] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);
	const bodyRef = useRef<HTMLElement | null>(null);

	useEffect(() => {
		bodyRef.current = document.body;
	}, []);

	const { scrollY } = useScroll({
		container: bodyRef
	});

	const toggleMenu = () => menuIsOpenSetter(prev => !prev);


	useMotionValueEvent(scrollY, "change", (latest) => {
		if (latest > 20 && !isScrolled) setIsScrolled(true);
		if (latest <= 20 && isScrolled) setIsScrolled(false);
	});



	const clickItem = (e: React.MouseEvent, item: typeof nav[0]) => {
		e.preventDefault();

		if (item.link.startsWith('#')) {
			scrollToElement(item.link);
			menuIsOpenSetter(false);
		}
		else if (item.link.startsWith('/')) {
			router.push(item.link);
			menuIsOpenSetter(false);
		}
		else if (item.link.startsWith('http')) {
			window.open(item.link, '_blank');
			menuIsOpenSetter(false);
		}
	};



	return (
		<Container data-scrolled={isScrolled || null} as='header' className={`${cls.header}`}>
			<LiquidGlass className={`${cls.header__content} glass-box`}>
				<div className={cls.logo} onClick={() => window.location.reload()}>
					<img src="/images/full-logo.svg" alt="NajmLabs" />
				</div>


				{
					!isHome && (<>
						<Link className={cls.link} href={'/'}>Назад</Link>
					</>)
				}

				{
					isHome && (<>
						<nav data-open={menuIsOpen || null} className={cls.menu}>
							{nav.map((item) => (
								<a
									key={item.id}
									href={item.link}
									onClick={e => clickItem(e, item)}
								>
									{item.title}
								</a>
							))}
						</nav>


						<Icon
							as={menuIsOpen ? 'cross' : 'menu'}
							onClick={toggleMenu}
							className={cls.menuBtn}
						/>

					</>)
				}

			</LiquidGlass>
		</Container>
	);
};

export default Header;