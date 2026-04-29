'use client'
import React, { useRef, useState } from 'react';
import cls from './style.module.scss';
import { Blob, Container, LiquidGlass } from '@/components/common';
import { toast } from 'sonner';
import { motion } from 'framer-motion'
import { fadeIn, scaleIn, slideIn } from '@/scripts/animation';


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
			<motion.h2  {...slideIn({ direction: 'left', delay: 0.5 })} className={`${cls.title} title`}>Связаться с нами</motion.h2>
			<LiquidGlass ref={formRef} as='form' className={`glass-box ${cls.form}`} onSubmit={sendReq}>
				<div className={cls.form__head}>
					<motion.h3 {...slideIn({ direction: 'left', delay: 0.6 })} className={cls.form__title}>Обсудим Ваши идеи<br /><span>Вместе.</span></motion.h3>
				</div>
				<div className={cls.form__main}>
					<motion.input  {...slideIn({ delay: 0.7 })} required name='name' type="text" placeholder='Имя' />
					<motion.input  {...slideIn({ delay: 0.8 })} required name='phone' type="text" placeholder='Телефон' />
					<motion.input  {...slideIn({ delay: 0.9 })} required name='email' type="text" placeholder='Email' />
					<motion.textarea  {...slideIn({ delay: 0.8, direction: 'left' })} required name='message' placeholder='Сообщение' />
					{/* <input name='file' type="file" /> */}
				</div>
				<motion.div {...slideIn({ direction: 'up', delay: 1 })} className={cls.form__foot}>
					<button type='reset' data-variant="second" className={cls.btn}>Сбросить</button>
					<button disabled={sendLoading} type='submit' className={cls.btn}>Отправить</button>
					<p className={cls.desc}>*Отправляя запрос, вы соглашаетесь с политикой конфиденциальности</p>
				</motion.div>
				<motion.img {...fadeIn({ delay: 0.5, duration: 1.5 })} src="/images/space-3.png" alt="decor" />
			</LiquidGlass>
		</Container>
	</>)
}

export default SectionContact;