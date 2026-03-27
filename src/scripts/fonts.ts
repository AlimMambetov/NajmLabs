import localFont from 'next/font/local'

export const fontInter = localFont({
	src: [
		{
			path: '../../public/fonts/Inter/Inter-V.ttf',
			weight: '100 900',
			style: 'normal',
		},
	],
	display: 'swap',
	variable: '--font-Inter',
})
export const fontGolosText = localFont({
	src: [
		{
			path: '../../public/fonts/Golos-Text/Golos-Text_VF.ttf',
			weight: '100 900',
			style: 'normal',
		},
	],
	display: 'swap',
	variable: '--font-Golos-Text',
})



export const fonts = [
	fontInter.variable,
	fontGolosText.variable,
]