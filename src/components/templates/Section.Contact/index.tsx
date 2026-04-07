'use client'
import React, { useRef, useState } from 'react';
import cls from './style.module.scss';
import { Blob, Container, LiquidGlass } from '@/components/common';
import { toast } from 'sonner';

export const SectionContact = (props: any) => {
	const [sendLoading, sendLoadingSetter] = useState(false)
	const formRef = useRef<HTMLFormElement>(null); // Создаем ref

	const sendReq = async (e: any) => {
		e.preventDefault();
		sendLoadingSetter(true);
		const formData = new FormData(e.currentTarget);
		const data = Object.fromEntries(formData.entries());

		try {
			const response = await fetch('/api/send', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});

			const result = await response.json();
			if (response.ok && result.success) {
				toast.success('Успешно сохранено!')
				if (formRef.current) {
					formRef.current.reset();
				}
			}
			else {
				console.error('Ошибка:', result.error);
				toast.error(result.error || 'Ошибка при отправке')
			}
		} catch (error) {
			console.error('Ошибка сети:', error);
			toast.warning('Ошибка соединения. Попробуйте позже.')
		} finally {
			sendLoadingSetter(false);
		}
	}

	return (<>
		<Container as='section' id="contact" className={`${cls.wrap}`}>
			<Blob right bottom colors={'orange'} translate={'50% 30%'} />
			<Blob translate={'-30% 30%'} />
			<h2 className={`${cls.title} title`}>Связаться с нами</h2>
			<LiquidGlass ref={formRef} as='form' className={`glass-box ${cls.form}`} onSubmit={sendReq}>
				<div className={cls.form__head}>
					<h3 className={cls.form__title}>Обсудим Ваши идеи<br /><span>Вместе.</span></h3>
				</div>
				<div className={cls.form__main}>
					<input required name='name' type="text" placeholder='Имя' />
					<input required name='phone' type="text" placeholder='Телефон' />
					<input required name='email' type="text" placeholder='Email' />
					<textarea required name='message' placeholder='Сообщение' />
					{/* <input name='file' type="file" /> */}
				</div>
				<div className={cls.form__foot}>
					<button type='reset' data-variant="second" className={cls.btn}>Сбросить</button>
					<button disabled={sendLoading} type='submit' className={cls.btn}>Отправить</button>
					<p className={cls.desc}>*Отправляя запрос, вы соглашаетесь с политикой конфиденциальности</p>
				</div>
				<img src="/images/space-3.svg" alt="decor" />
			</LiquidGlass>
		</Container>
	</>)
}

export default SectionContact;