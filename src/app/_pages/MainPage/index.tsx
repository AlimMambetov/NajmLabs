'use client'
import React from 'react';
import cls from './style.module.scss';
import { SectionAbout, SectionHero, SectionProcess, SectionServices } from '@/components/templates';


export const MainPage = (props: any) => {
	return (<>
		<main className={cls.main}>
			<SectionHero />
			<SectionAbout />
			<SectionProcess />
			{/* <SectionServices /> */}
		</main>
	</>)
}

export default MainPage;