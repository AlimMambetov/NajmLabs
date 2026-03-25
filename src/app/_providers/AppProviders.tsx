import { ReactNode } from 'react';
import { reduxProvider, callOpsProvider, MountProvider } from './index';

const providers = [
	callOpsProvider,
	reduxProvider,
	MountProvider,
];

export const AppProviders = ({ children }: { children?: ReactNode }) => {
	return providers.reduce((acc, Provider) => {
		return <Provider>{acc}</Provider>;
	}, children);
};

export default AppProviders;