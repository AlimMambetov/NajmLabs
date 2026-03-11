'use client'
import { configureStore } from '@reduxjs/toolkit';

// slices
import * as base from './base.slice';


const createStoreConfig = <T extends Record<string, any>>(slices: T) => {
	const reducers = {} as any;
	const actions = {} as any;

	Object.keys(slices).forEach(key => {
		reducers[key] = slices[key].default;
		actions[key + 'Action'] = slices[key];
	});

	return { reducers, actions };
};


const { reducers, actions } = createStoreConfig({
	base,
});

const store = configureStore({
	reducer: reducers
});


export default store;

export {
	reducers,
	actions
};