import axios from 'axios';
import queryString from 'query-string';
import {SET_STATE_FROM_API} from "./actionTypes";

const apiBase = process.env.REACT_APP_PROXY;

let options = {
	headers: {
		'Content-Type': 'application/json'
	},
	baseURL: `${apiBase}/api/v2`,
}

const apiFetch = (opt, dispatch) => {
	return axios(opt)
		.then(res => dispatch({type: SET_STATE_FROM_API, payload: res.data}))
		.catch(err => dispatch({type: SET_STATE_FROM_API, payload: err.response.data}));
}

export const postData = (url, payload) => {
	return dispatch => {
		const axiosOptions = {
			...options,
			method: 'POST',
			url,
			data: payload,
		}
		return apiFetch(axiosOptions, dispatch);
	}
}

export const getData = (url, payload) => {
	return dispatch => {
		const axiosOptions = {
			...options,
			method: 'GET',
			url,
			params: payload ? {...payload, ...queryString.parse(window.location.search)} : {...queryString.parse(window.location.search)},
		}
		return apiFetch(axiosOptions, dispatch);
	}
}