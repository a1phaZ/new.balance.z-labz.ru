import {ONSEARCH, SET_DATE, SET_ID} from "./actionTypes";

export const initialState = {
	id: {},
	search: {},
	date: new Date()
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
		case SET_DATE: {
			return {
				...state,
				date: new Date(action.payload.date)
			}
		}
		default:
			return state;
	}
}