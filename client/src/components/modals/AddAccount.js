import React, {useEffect, useReducer} from 'react';
import {Button, FormLayout, Input} from "@vkontakte/vkui";
import currency from "../../handlers/currency";
import useApi from "../../handlers/useApi";

const initialState = {
	title: '',
	sum: ''
}

const reducer = (state, action) => {
	switch (action.type) {
		case 'CHANGE_STATE':
			const {payload} = action;
			return {
				...state,
				...payload
			}
		default:
			return state;
	}
}

export default ({setAccount}) => {
	const [stateForm, dispatchForm] = useReducer(reducer, initialState);
	const [{response}, doApiFetch] = useApi('/money-box');

	useEffect(() => {
		if (!response) return;
		setAccount(response);
	}, [response, setAccount]);

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
						 onChange={e => dispatchForm({type: 'CHANGE_STATE', payload: {title: e.currentTarget.value}})}/>
			<Input type={'number'} placeholder={currency(0)} top={'Остаток в рублях'} value={stateForm.sum}
						 bottom={'Денежные средства, находящиеся на счете в данный момент'}
						 onChange={e => dispatchForm({type: 'CHANGE_STATE', payload: {sum: e.currentTarget.value}})}/>
			<Button size={'xl'}>Сохранить</Button>
		</FormLayout>
	)
}