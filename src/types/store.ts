import store from '@/store';

export type T_store = ReturnType<typeof store.getState>;
export type T_dispatch = typeof store.dispatch;


export type T_baseActions = {
	SET_DATA: (payload: any) => void,
}



export type T_actions = {
	baseAction: T_baseActions,
};








