

export const scrollToElement = (hash: string) => {
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