export function disableDevLogs() {
	if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
		// Сохраняем оригинальные методы
		const original = {
			log: console.log,
			info: console.info,
			debug: console.debug,
			warn: console.warn
		};

		// Регулярки для блокировки
		const blockedPatterns = [
			/forward-logs-shared/,
			/\[Fast Refresh\]/,
			/\[HMR\]/,
			/Document already loaded/,
			/Attempting to initialize/,
			/AdUnit initialized/,
			/content-script\.js/,
			/running initialization/
		];

		const shouldBlock = (message: string) => {
			return blockedPatterns.some(pattern => pattern.test(message));
		};

		// Перехватываем все console методы
		const methods = ['log', 'info', 'debug', 'warn'] as const;

		methods.forEach(method => {
			console[method] = (...args: any[]) => {
				const message = args.map(arg =>
					typeof arg === 'string' ? arg : JSON.stringify(arg)
				).join(' ');

				if (!shouldBlock(message)) {
					original[method].apply(console, args);
				}
			};
		});

		console.log('🚀 Dev logs filter activated - unwanted messages are hidden');
	}
}