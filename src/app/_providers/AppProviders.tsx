'use client';
import { ReactNode } from 'react';
import { reduxProvider } from './index';
import callOpsProvider from './CallOpsProvider';

const providers = [
	callOpsProvider,
	reduxProvider,
];

export const AppProviders = ({ children }: { children?: ReactNode }) => {
	return providers.reduce((acc, Provider) => {
		return <Provider>{acc}</Provider>;
	}, children);
};

export default AppProviders;