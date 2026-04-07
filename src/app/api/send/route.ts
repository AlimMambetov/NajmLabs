import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend('re_AEwHRTcg_8HScYt2eintA3dduvWj4iEdf');

export async function POST(request: Request) {
	try {
		const { name, email, phone, message } = await request.json();

		console.log('Отправляем письмо:', { name, email, phone, message });

		// ВАЖНО: Добавляем await и обрабатываем результат
		const { data, error } = await resend.emails.send({
			from: 'onboarding@resend.dev', // Resend требует валидный from адрес
			to: 'najmlabs.spb@gmail.com',
			subject: `Новое сообщение от ${name}`,
			html: `
				<h2>Новое сообщение с сайта NajmLabs</h2>
				<p><strong>Имя:</strong> ${name}</p>
				<p><strong>Телефон:</strong> ${phone || 'не указан'}</p>
				<p><strong>Email:</strong> ${email}</p>
				<p><strong>Сообщение:</strong></p>
				<p>${message}</p>
			`,
		});

		// Проверяем на ошибки
		if (error) {
			console.error('Ошибка от Resend:', error);
			return NextResponse.json(
				{ error: error.message },
				{ status: 500 }
			);
		}

		console.log('Письмо отправлено! ID:', data?.id);
		return NextResponse.json({ success: true, id: data?.id });

	} catch (error) {
		console.error('Ошибка отправки:', error);
		return NextResponse.json(
			{ error: 'Ошибка отправки' },
			{ status: 500 }
		);
	}
}