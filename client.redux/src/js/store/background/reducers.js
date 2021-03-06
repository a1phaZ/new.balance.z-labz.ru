import {ONSEARCH, SET_ID} from "./actionTypes";
export const initialState = {
	id: {},
	search: {}
}

export const backgroundReducer = (state = initialState, action) => {
	switch (action.type) {
		case SET_ID:
			return {
				...state,
				id: {...state.id, ...action.payload}
			}
		case ONSEARCH: {
			return {
				...state,
				search: {...state.search, ...action.payload}
			}
		}
		default:
			return state;
	}
}