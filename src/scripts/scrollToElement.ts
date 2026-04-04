export const scrollToElement = (hash: string) => {
	const element = document.querySelector(hash) as HTMLElement;
	if (element) {
		// Временно добавляем scroll-margin-top
		const originalScrollMargin = element.style.scrollMarginTop;
		element.style.scrollMarginTop = '150px';

		element.scrollIntoView({
			behavior: 'smooth',
			block: 'start',
		});

		// Возвращаем оригинальное значение после прокрутки
		setTimeout(() => {
			element.style.scrollMarginTop = originalScrollMargin;
		}, 1000);

		window.history.pushState(null, '', hash);
	}
};