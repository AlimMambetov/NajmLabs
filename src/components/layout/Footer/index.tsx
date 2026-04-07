'use client'
import React from 'react';
import cls from './style.module.scss';
import { Container } from '@/components/common';
import { useAppInfo } from '@/hooks';
import { Icon, LiquidGlass } from '@/components/common';
import { useRouter } from 'next/navigation';

export const Footer = (props: any) => {
	const { version } = useAppInfo();
	const router = useRouter();

	return (<>
		<Container id='footer' className={`${cls.footer}`}>
			<LiquidGlass className={`${cls.footer__content} glass-box`}>
				<div className={cls.block}>
					<div className={cls.logo}>
						<img src="/images/full-logo.svg" alt="NajmLabs" />
					</div>
					<div className={cls.desc}>Версия № {version} / 29.03.2026 </div>
				</div>

				<div className={cls.block}>
					<div className={cls.desc}>ИП: «Мамбетов А. М.»</div>
					<div className={cls.desc}>ИНН: 070807345752</div>
					<div className={cls.desc}>ОГРН: 324070000035027</div>
				</div>
				<div className={`${cls.block} ${cls.pages}`}>
					<div className={cls.desc} onClick={() => router.push('/privacy-policy')}>Политика конфиденциальности</div>
					<div className={cls.desc} onClick={() => router.push('/personal-data')}>Условия обработки данных</div>
					{/* <div className={cls.desc}>Договор-оферта</div> */}
				</div>
				<div className={cls.block}>
					<a target='_blanck' href='mailto:najmlabs@gmail.com' className={cls.desc}><Icon as='mail' /> najmlabs@gmail.com</a>
					<a target='_blanck' href='tel:+79994921293' className={cls.desc}><Icon as='phone' /> +7 999 492 12-93</a>
					<a target='_blanck' href='https://t.me/najmlabs' className={cls.desc}><Icon as='telegram' /> @najmlabs</a>
				</div>
				<div className={`${cls.desc} ${cls.copyright}`}>© 2026 NajmLabs. Все права защищены.</div>
			</LiquidGlass>
		</Container>
	</>)
}

export default Footer;