'use client'
import React from 'react';
import cls from './style.module.scss';
import { CirlceAnim } from '@/components/common';
import Container from '@/components/layout/Container';

export const MainPage = (props: any) => {

	return (<>
		<div className={cls.mainPage}>

			<Container><h1>Hello World</h1></Container>
			<Container full className={cls.a}><h1>Hello World</h1></Container>

			<CirlceAnim />
		</div>
	</>)
}

export default MainPage;