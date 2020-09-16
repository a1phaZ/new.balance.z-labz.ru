import {useState, useEffect, useCallback, useContext} from 'react';
import queryString from 'query-string';
import axios from 'axios';
import {SET_ERROR, SET_SUCCESS_MESSAGE} from "../state/actions";
import {State} from "../state";

export default url => {
	const [isLoading, setLoading] = useState(false);
	const [response, setResponse] = useState(null);
	const [error, setError] = useState(null);
	const [options, setOptions] = useState({});
	const [, dispatch] = useContext(State);

	const apiBase = process.env.NODE_ENV !== 'development' ? process.env.REACT_APP_BASEURL : process.env.REACT_APP_BASEURL_DEV;

	const doApiFetch = useCallback((options = {}) => {
		setOptions(options);
		setResponse(null);
		setError(null);
		setLoading(true);
	}, []);

	const {method = 'GET', params, ...bodyFields} = options;
	const headers = {
		'Content-Type': 'application/json',
	}
	const axiosOptions = {
		method: method,
		baseURL: apiBase,
		url,
		headers,
		params: params ? {...params, ...queryString.parse(window.location.search)} : {...queryString.parse(window.location.search)},
		data: method !== 'GET' ? bodyFields : null,
	}

	useEffect(() => {

		if (!isLoading) return;

		const fetchData = async () => {
			return await axios(axiosOptions)
				.then(async (response) => {
					setLoading(false);
					setResponse(response.data.data);
					dispatch({type: SET_SUCCESS_MESSAGE, payload: {message: response.data.message}});
				})
				.catch((error) => {
					let e = error?.response ? error.response.data.error : new Error('Проблемы с подключением к API');
					setError(e);
					setLoading(false);
					dispatch({type: SET_ERROR, payload: {error: e}});
				});
		}

		fetchData();

	}, [isLoading, axiosOptions, dispatch]);
	return [{isLoading, response, error}, doApiFetch];
}