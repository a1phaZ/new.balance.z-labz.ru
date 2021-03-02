import {SET_ID} from "./actionTypes";

export const setId = payload => {
	return dispatch => {
		dispatch({type: SET_ID, payload});
	}
}