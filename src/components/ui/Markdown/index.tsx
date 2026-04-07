'use client'
import React from 'react';
import cls from './style.module.scss';
import { marked } from 'marked';
import { Container } from '@/components/common';

export const Markdown = ({ data }: any) => {


	return (<>
		<Container className={cls.md} dangerouslySetInnerHTML={{ __html: marked.parse(data) }} />
	</>)
}

export default Markdown;