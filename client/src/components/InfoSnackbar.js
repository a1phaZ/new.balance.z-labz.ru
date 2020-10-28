import React, {useContext, useEffect, useState} from 'react';
import {Snackbar} from "@vkontakte/vkui";
import {State} from "../state";
import {SET_ERROR, SET_SUCCESS_MESSAGE} from "../state/actions";
import Icon24ErrorCircle from '@vkontakte/icons/dist/24/error_circle';
import Icon24CheckCircleOn from '@vkontakte/icons/dist/24/check_circle_on';

const InfoSnackbar = () => {
	const [state, dispatch] = useContext(State);
	const [snackbar, setSnackbar] = useState(null);
	useEffect(() => {
		if (!state.error) return;
		setSnackbar(<Snackbar
			onClose={
				() => {
					dispatch({type: SET_ERROR, payload: {error: null}});
					setSnackbar(null);
				}}
			before={<Icon24ErrorCircle style={{color: 'var(--destructive)'}}/>}
		>
			{state.error.message}
		</Snackbar>)
	}, [setSnackbar, dispatch, state.error]);

	useEffect(() => {
		if (!state.successMessage) return;
		setSnackbar(<Snackbar
			onClose={
				() => {
					dispatch({type: SET_SUCCESS_MESSAGE, payload: {message: null}});
					setSnackbar(null);
				}}
			before={<Icon24CheckCircleOn style={{color: 'var(--accent)'}}/>}
		>
			{state.successMessage}
		</Snackbar>)
	}, [setSnackbar, dispatch, state.successMessage]);
	return (
		<>
			{snackbar}
		</>
	)
}

export default InfoSnackbar;