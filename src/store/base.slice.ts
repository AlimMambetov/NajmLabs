import { createSlice } from '@reduxjs/toolkit'


const initialState = {
	data: null,
	loading: false,
	error: null
}

const base = createSlice({
	name: 'base',
	initialState,
	reducers: {
		SET_DATA: (state, action) => {
			state.data = action.payload
		}
	}
})

const { actions, reducer } = base


export const { SET_DATA } = actions
export default reducer
