import {SET_IS_LOADING, SET_STATE_FROM_API, UNSET_MESSAGE} from './actionTypes';
export const initialState = {
	accounts: [],
	account: {
		operations: [],
	},
	budgets: [],
	isLoading: {},
	id: {},
	error: null
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
		case UNSET_MESSAGE:
			return {
				...state,
				error: null
			}
		default:
			return state;
	}
}