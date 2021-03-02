import {SET_ID} from "./actionTypes";
export const initialState = {
	id: {}
}

export const backgroundReducer = (state = initialState, action) => {
	switch (action.type) {
		case SET_ID:
			return {
				...state,
				id: {...state.id, ...action.payload}
			}
		default:
			return state;
	}
}