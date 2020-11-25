import React, {useEffect, useReducer} from 'react';
import {Button, FormLayout, Input} from "@vkontakte/vkui";
import currency from "../../handlers/currency";
import useApi from "../../handlers/useApi";
import validate from "../../handlers/validate";
import regexp from "../../handlers/regexp";
import {SET_ACCOUNTS, SET_BUDGETS} from "../../state/actions";

const initialState = {
	title: '',
	sum: '',
	titleValidation: {},
	sumValidation: {}
}

const reducer = (state, action) => {
	switch (action.type) {
		case 'CHANGE_STATE':
			const {payload} = action;
			// if (payload.title === ' ' && state.title === '') {
			// 	console.log(payload.title);
			// 	return {
			// 		...state,
			// 		title: payload.title,
			// 		titleValidation: payload.titleValidation
			// 	}
			// }
			return {
				...state,
				...payload
			}
		default:
			return state;
	}
}

export default ({onRefresh, dispatch}) => {
	const [stateForm, dispatchForm] = useReducer(reducer, initialState);
	const [{response}, doApiFetch] = useApi('/money-box');

	useEffect(() => {
		if (!response) return;
		dispatch({type: SET_ACCOUNTS, payload: {accounts: response?.accounts ? response?.accounts : []}});
		dispatch({type: SET_BUDGETS, payload: {budgets: response?.budgets ? response?.budgets : []}});
	}, [response, dispatch]);

	return (
		<FormLayout
			onSubmit={async e => {
				e.preventDefault();
				await doApiFetch({
					method: 'POST',
					title: stateForm.title,
					sum: stateForm.sum
				});
			}}
		>
			<Input type={'text'} placeholder={'Карта, наличные, счет в банке'} top={'Название'} value={stateForm.title}
						 required={true}
						 maxLength={'20'}
						 status={stateForm.titleValidation.status}
						 bottom={stateForm.titleValidation.message ? stateForm.titleValidation.message : `${stateForm.title.length} из 20`}
						 onChange={e => dispatchForm({type: 'CHANGE_STATE', payload: {title: regexp(e.currentTarget.value), titleValidation: validate(e)}})}/>
			<Input type={'number'} placeholder={currency(0)} top={'Баланс счета'} value={stateForm.sum}
						 pattern={'[0-9]+([,\\.][0-9]+)?'}
						 required={true}
						 status={stateForm.sumValidation.status}
						 inputMode="decimal"
						 max={999999999}
						 min={0}
						 step={0.01}
						 bottom={stateForm.sumValidation.message ? stateForm.sumValidation.message : 'Денежные средства, находящиеся на счете в данный момент'}
						 onChange={e => dispatchForm({type: 'CHANGE_STATE', payload: {sum: e.currentTarget.value.replace(/[^\d.]*/, ''), sumValidation: validate(e)}})}/>
			<Button size={'xl'}>Сохранить</Button>
		</FormLayout>
	)
}