'use client'
import React from 'react';
import cls from './style.module.scss';
import {
	SectionAbout,
	SectionContact,
	SectionHero,
	SectionProcess,
	SectionServices,
	SectionsFAQ,
	SectionsStack,

} from '@/components/templates';


export const MainPage = (props: any) => {
	return (<>
		<main className={cls.main}>
			<SectionHero />
			<SectionAbout />
			<SectionProcess />
			{/* <SectionServices /> */}
			<SectionsStack />
			<SectionContact />
			<SectionsFAQ />
		</main>
	</>)
}

export default MainPage;