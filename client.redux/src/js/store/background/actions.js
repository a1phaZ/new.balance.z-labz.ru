import {ONSEARCH, SET_DATE, SET_ID} from "./actionTypes";

export const setId = payload => {
	return dispatch => {
		dispatch({type: SET_ID, payload});
	}
}

export const onSearch = payload => {
	return dispatch => {
		dispatch({type: ONSEARCH, payload});
	}
}

export const setDate = payload => {
	return dispatch => {
		dispatch({type: SET_DATE, payload});
	}
}