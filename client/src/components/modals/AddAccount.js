import React, {useReducer} from 'react';
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

export default ({close}) => {
	const [state, dispatch] = useReducer(reducer, initialState);
	const [, doApiFetch] = useApi('/money-box');
	return (
		<FormLayout
			onSubmit={e => {
				e.preventDefault();
				doApiFetch({
					method: 'POST',
					title: state.title,
					sum: state.sum
				});
				close();
			}}
		>
			<Input type={'text'} placeholder={'Карта, наличные, счет в банке'} top={'Название'} value={state.title}
						 onChange={e => dispatch({type: 'CHANGE_STATE', payload: {title: e.currentTarget.value}})}/>
			<Input type={'number'} placeholder={currency(0)} top={'Остаток в рублях'} value={state.sum}
						 bottom={'Денежные средства, находящиеся на счете в данный момент'}
						 onChange={e => dispatch({type: 'CHANGE_STATE', payload: {sum: e.currentTarget.value}})}/>
			<Button size={'xl'}>Сохранить</Button>
		</FormLayout>
	)
}