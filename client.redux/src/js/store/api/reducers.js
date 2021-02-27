import {SET_STATE_FROM_API} from './actionTypes';
export const initialState = {
	accounts: []
}

export const apiReducer = (state = initialState, action) => {
	switch (action.type) {
		case SET_STATE_FROM_API:
			return {
				...state,
				...action.payload
			}
		default:
			return state;
	}
}