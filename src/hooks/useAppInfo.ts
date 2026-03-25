import packageInfo from '&/../package.json';

interface AppInfo {
	version: string;
	mode: 'dev' | 'prod';
	isDev: boolean;
	isProd: boolean;
	os?: string;
	browser?: string;
	language?: string;
}

export const useAppInfo = (): AppInfo => {
	const isServer = typeof window === 'undefined';
	const isDev = process.env.NODE_ENV === 'development';
	const isProd = process.env.NODE_ENV === 'production';
	const mode = isDev ? 'dev' : 'prod';


	// Системная информация
	let os, browser, language;

	if (!isServer) {
		const userAgent = navigator.userAgent;

		if (userAgent.includes('Windows')) os = 'Windows';
		else if (userAgent.includes('Mac')) os = 'macOS';
		else if (userAgent.includes('Linux')) os = 'Linux';
		else if (userAgent.includes('Android')) os = 'Android';
		else if (userAgent.includes('iOS')) os = 'iOS';

		if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) browser = 'Chrome';
		else if (userAgent.includes('Firefox')) browser = 'Firefox';
		else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) browser = 'Safari';
		else if (userAgent.includes('Edg')) browser = 'Edge';

		language = navigator.language;
	}

	return {
		version: packageInfo.version,
		mode,
		isDev,
		isProd,
		os,
		browser,
		language,
	};
};