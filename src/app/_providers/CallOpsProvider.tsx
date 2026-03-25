'use client'
import React, { ReactNode, useInsertionEffect } from 'react';

export const callOpsProvider = ({ children }: { children?: ReactNode }) => {

	useInsertionEffect(() => {
		// console.log('test')
	}, [])

	return (<>{children}</>)
}

export default callOpsProvider; 