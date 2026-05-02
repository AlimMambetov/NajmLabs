'use client'
import React, { useRef, useState } from 'react';
import cls from './style.module.scss';
import { Blob, Container, LiquidGlass } from '@/components/common';
import { toast } from 'sonner';
import { motion } from 'framer-motion'
import { fadeIn, scaleIn, slideIn } from '@/scripts/animation';

// Функция для форматирования номера телефона
const formatPhoneNumber = (value: string) => {
	// Удаляем все не-цифры
	let numbers = value.replace(/\D/g, '');

	// Если номер начинается с 8, меняем на 7
	if (numbers.startsWith('8')) {
		numbers = '7' + numbers.slice(1);
	}

	// Если номер не начинается с 7 и не пустой, добавляем 7
	if (numbers.length > 0 && !numbers.startsWith('7')) {
		numbers = '7' + numbers;
	}

	// Ограничиваем длину 11 цифрами
	const trimmed = numbers.slice(0, 11);

	if (trimmed.length === 0) return '';
	if (trimmed.length === 1) return `+7`;
	if (trimmed.length <= 4) return `+7 (${trimmed.slice(1)}`;
	if (trimmed.length <= 7) return `+7 (${trimmed.slice(1, 4)}) ${trimmed.slice(4)}`;
	if (trimmed.length <= 9) return `+7 (${trimmed.slice(1, 4)}) ${trimmed.slice(4, 7)}-${trimmed.slice(7)}`;
	return `+7 (${trimmed.slice(1, 4)}) ${trimmed.slice(4, 7)}-${trimmed.slice(7, 9)}-${trimmed.slice(9, 11)}`;
};

// Функции валидации
const validateName = (name: string) => {
	if (!name.trim()) return 'Имя обязательно для заполнения';
	if (name.trim().length < 2) return 'Имя должно содержать минимум 2 символа';
	if (!/^[а-яА-Яa-zA-Z\s-]+$/.test(name.trim())) return 'Имя может содержать только буквы, пробелы и дефисы';
	return null;
};

const validatePhone = (phone: string) => {
	const cleanPhone = phone.replace(/\D/g, '');
	if (!cleanPhone) return 'Телефон обязателен для заполнения';
	if (cleanPhone.length !== 11) return 'Введите полный номер телефона (11 цифр)';
	if (!cleanPhone.startsWith('7')) return 'Номер должен начинаться с 7 или 8';
	return null;
};

const validateEmail = (email: string) => {
	if (!email.trim()) return 'Email обязателен для заполнения';
	const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
	if (!emailRegex.test(email)) return 'Введите корректный email адрес';
	return null;
};

const validateMessage = (message: string) => {
	if (!message.trim()) return 'Сообщение обязательно для заполнения';
	if (message.trim().length < 10) return 'Сообщение должно содержать минимум 10 символов';
	if (message.trim().length > 1000) return 'Сообщение не должно превышать 1000 символов';
	return null;
};

export const SectionContact = (props: any) => {
	const [sendLoading, sendLoadingSetter] = useState(false);
	const [errors, setErrors] = useState<{
		name?: string;
		phone?: string;
		email?: string;
		message?: string;
	}>({});

	const [touched, setTouched] = useState<{
		name?: boolean;
		phone?: boolean;
		email?: boolean;
		message?: boolean;
	}>({});

	const formRef = useRef<HTMLFormElement>(null);

	// Обработчик изменения номера телефона с форматированием
	const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const rawValue = e.target.value;
		const cursorPosition = e.target.selectionStart || 0;
		const oldLength = rawValue.length;

		const formatted = formatPhoneNumber(rawValue);
		e.target.value = formatted;

		// Корректируем позицию курсора
		const newLength = formatted.length;
		const diff = newLength - oldLength;
		const newCursorPosition = Math.max(0, cursorPosition + diff);
		e.target.setSelectionRange(newCursorPosition, newCursorPosition);

		// Валидируем при изменении, если поле было touched
		if (touched.phone) {
			const phoneError = validatePhone(formatted);
			setErrors(prev => ({ ...prev, phone: phoneError || undefined }));
		}
	};

	// Обработчики blur для валидации
	const handleBlur = (field: 'name' | 'phone' | 'email' | 'message') => {
		setTouched(prev => ({ ...prev, [field]: true }));

		const formData = new FormData(formRef.current!);
		let error: string | null = null;

		switch (field) {
			case 'name':
				error = validateName(formData.get('name') as string || '');
				break;
			case 'phone':
				const phone = formData.get('phone') as string || '';
				error = validatePhone(phone);
				break;
			case 'email':
				error = validateEmail(formData.get('email') as string || '');
				break;
			case 'message':
				error = validateMessage(formData.get('message') as string || '');
				break;
		}

		setErrors(prev => ({ ...prev, [field]: error || undefined }));
	};

	// Валидация всей формы
	const validateForm = (formData: FormData): boolean => {
		const name = formData.get('name') as string || '';
		const phone = formData.get('phone') as string || '';
		const email = formData.get('email') as string || '';
		const message = formData.get('message') as string || '';

		const nameError = validateName(name);
		const phoneError = validatePhone(phone);
		const emailError = validateEmail(email);
		const messageError = validateMessage(message);

		setErrors({
			name: nameError || undefined,
			phone: phoneError || undefined,
			email: emailError || undefined,
			message: messageError || undefined,
		});

		setTouched({
			name: true,
			phone: true,
			email: true,
			message: true,
		});

		return !(nameError || phoneError || emailError || messageError);
	};

	const sendReq = async (e: any) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);

		// Валидируем форму перед отправкой
		if (!validateForm(formData)) {
			toast.error('Пожалуйста, исправьте ошибки в форме');
			return;
		}

		sendLoadingSetter(true);

		// Очищаем телефон от форматирования перед отправкой
		const phoneRaw = (formData.get('phone') as string || '').replace(/\D/g, '');
		const data = {
			name: formData.get('name'),
			phone: phoneRaw,
			email: formData.get('email'),
			message: formData.get('message'),
		};

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
				toast.success('Успешно сохранено!');
				if (formRef.current) {
					formRef.current.reset();
					setErrors({});
					setTouched({});
				}
			} else {
				console.error('Ошибка:', result.error);
				toast.error(result.error || 'Ошибка при отправке');
			}
		} catch (error) {
			console.error('Ошибка сети:', error);
			toast.warning('Ошибка соединения. Попробуйте позже.');
		} finally {
			sendLoadingSetter(false);
		}
	};

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
					<div data-inp="name" className={cls.inputWrapper}>
						<motion.input {...slideIn({ delay: 0.7 })}
							required
							name='name'
							type="text"
							placeholder='Имя'
							onBlur={() => handleBlur('name')}
							className={errors.name && touched.name ? cls.error : ''}
						/>
						{errors.name && touched.name && <span className={cls.errorMessage}>{errors.name}</span>}
					</div>

					<div data-inp="phone" className={cls.inputWrapper}>
						<motion.input {...slideIn({ delay: 0.8 })}
							required
							name='phone'
							type="tel"
							placeholder='+7 (___) ___-__-__'
							onChange={handlePhoneChange}
							onBlur={() => handleBlur('phone')}
							className={errors.phone && touched.phone ? cls.error : ''}
						/>
						{errors.phone && touched.phone && <span className={cls.errorMessage}>{errors.phone}</span>}
					</div>

					<div data-inp="mail" className={cls.inputWrapper}>
						<motion.input {...slideIn({ delay: 0.9 })}
							required
							name='email'
							type="email"
							placeholder='Email'
							onBlur={() => handleBlur('email')}
							className={errors.email && touched.email ? cls.error : ''}
						/>
						{errors.email && touched.email && <span className={cls.errorMessage}>{errors.email}</span>}
					</div>

					<div data-inp="message" className={cls.inputWrapper}>
						<motion.textarea {...slideIn({ delay: 0.8, direction: 'left' })}
							required
							name='message'
							placeholder='Сообщение'
							onBlur={() => handleBlur('message')}
							className={errors.message && touched.message ? cls.error : ''}
						/>
						{errors.message && touched.message && <span className={cls.errorMessage}>{errors.message}</span>}
					</div>
				</div>
				<motion.div {...slideIn({ direction: 'up', delay: 1 })} className={cls.form__foot}>
					<button type='reset' data-variant="second" className={cls.btn}>Сбросить</button>
					<button disabled={sendLoading} type='submit' className={cls.btn}>
						{sendLoading ? 'Отправка...' : 'Отправить'}
					</button>
					<p className={cls.desc}>*Отправляя запрос, вы соглашаетесь с политикой конфиденциальности</p>
				</motion.div>
				<motion.img {...fadeIn({ delay: 0.5, duration: 1.5 })} src="/images/space-3.png" alt="decor" />
			</LiquidGlass>
		</Container>
	</>)
}

export default SectionContact;