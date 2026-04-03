'use client'
import React from 'react';
import cls from './style.module.scss';
import { Container, LiquidGlass } from '@/components/common';

export const SectionContact = (props: any) => {


	const sendReq = async (e: any) => {
		e.preventDefault();
		console.log('test')
	}

	return (<>
		<Container as='section' id="contact" className={`${cls.wrap}`}>
			<h2 className={`${cls.title} title`}>Связаться с нами</h2>
			<LiquidGlass as='form' className={`glass-box ${cls.form}`} onSubmit={sendReq}>
				<div className={cls.form__head}>
					<h3 className={cls.form__title}>Обсудим Ваши идеи<br /><span>Вместе.</span></h3>
				</div>
				<div className={cls.form__main}>
					<input name='person-name' type="text" placeholder='Имя' />
					<input name='phone' type="text" placeholder='Телефон' />
					<input name='email' type="text" placeholder='Email' />
					<textarea name='message' placeholder='Сообщение' />
					{/* <input name='file' type="file" /> */}
				</div>
				<div className={cls.form__foot}>
					<button data-variant="second" className={cls.btn}>Сбросить</button>
					<button className={cls.btn}>Отправить</button>
					<p className={cls.desc}>*Отправляя запрос, вы соглашаетесь с политикой конфиденциальности</p>
				</div>
				<img src="/images/space-3.svg" alt="decor" />
			</LiquidGlass>
		</Container>
	</>)
}

export default SectionContact;