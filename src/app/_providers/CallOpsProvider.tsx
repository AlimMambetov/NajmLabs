'use client'
import { disableDevLogs } from '@/scripts';
import React, { ReactNode, useEffect } from 'react';

export const callOpsProvider = ({ children }: { children?: ReactNode }) => {

	useEffect(() => {
		disableDevLogs(); // отключить лишние логи
	}, [])

	return (<>{children}</>)
}

export default callOpsProvider;