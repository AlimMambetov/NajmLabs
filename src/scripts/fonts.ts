import localFont from 'next/font/local'

export const fontComfortaa = localFont({
	src: [
		{
			path: '../../public/fonts/Comfortaa-v.ttf',
			weight: '100 900',
			style: 'normal',
		},
	],
	display: 'swap',
	variable: '--font-Comfortaa',
})
