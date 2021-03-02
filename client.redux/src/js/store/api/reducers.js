import {SET_ID, SET_IS_LOADING, SET_STATE_FROM_API} from './actionTypes';
export const initialState = {
	accounts: [],
	budgets: [],
	isLoading: {},
	id: {}
}

export const apiReducer = (state = initialState, action) => {
	switch (action.type) {
		case SET_STATE_FROM_API:
			return {
				...state,
				isLoading: {
					...state.isLoading,
					[action.payload.urlText]: false
				},
				...action.payload.data
			}
		case SET_IS_LOADING:
			return {
				...state,
				isLoading: {...state.isLoading, ...action.payload}
			}
		case SET_ID:
			return {
				...state,
				id: {...state.id, ...action.payload}
			}
		default:
			return state;
	}
}