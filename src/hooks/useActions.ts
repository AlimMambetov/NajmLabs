'use client'
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions } from '@/store';
import { T_actions } from '@/types';

export const useActions = () => {
	const dispatch = useDispatch();
	const allActions: { [key: string]: any } = {};

	Object.keys(actions).forEach(key => {
		const boundActions = bindActionCreators(actions[key], dispatch);
		delete boundActions.default;
		allActions[key] = boundActions;
	});


	return allActions as T_actions;
};