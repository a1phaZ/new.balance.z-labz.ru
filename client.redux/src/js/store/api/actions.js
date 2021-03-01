import axios from 'axios';
import queryString from 'query-string';
import {SET_ID, SET_IS_LOADING, SET_STATE_FROM_API} from "./actionTypes";

const apiBase = process.env.REACT_APP_PROXY;

let options = {
	headers: {
		'Content-Type': 'application/json'
	},
	baseURL: `${apiBase}/api/v2`,
	params: queryString.parse(window.location.search)
}

const getUrlText = (url) => {
	return url.match(/[a-z]+/)[0];
}

const apiFetch = (opt, dispatch) => {
	const urlText = getUrlText(opt.url);
	return axios(opt)
		.then(res => dispatch({type: SET_STATE_FROM_API, payload: {data: res.data, urlText: urlText}}))
		.catch(err => dispatch({type: SET_STATE_FROM_API, payload: {error: err.response.data, urlText: urlText}}));
}

export const postData = (url, payload) => {
	return async dispatch =>{
		const axiosOptions = {
			...options,
			method: 'POST',
			url,
			data: payload,
		}
		const urlText = getUrlText(url);
		dispatch({type: SET_IS_LOADING, payload: {[urlText]: true}});
		return await apiFetch(axiosOptions, dispatch);
	}
}

export const getData = (url, payload) => {
	return async dispatch => {
		const axiosOptions = {
			...options,
			method: 'GET',
			url,
			params: payload ? {...options.params, ...payload} : {...options.params},
		}
		const urlText = getUrlText(url);
		dispatch({type: SET_IS_LOADING, payload: {[urlText]: true}});
		return await apiFetch(axiosOptions, dispatch);
	}
}

export const setId = payload => {
	console.log(payload);
	return dispatch => {
		dispatch({type: SET_ID, payload});
	}
}