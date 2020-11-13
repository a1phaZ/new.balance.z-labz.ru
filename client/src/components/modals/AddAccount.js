import React, {useEffect, useReducer} from 'react';
import {Button, FormLayout, Input} from "@vkontakte/vkui";
import currency from "../../handlers/currency";
import useApi from "../../handlers/useApi";
import validate from "../../handlers/validate";

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
			return {
				...state,
				...payload
			}
		default:
			return state;
	}
}

export default ({onRefresh}) => {
	const [stateForm, dispatchForm] = useReducer(reducer, initialState);
	const [{response}, doApiFetch] = useApi('/money-box');

	useEffect(() => {
		if (!response) return;
		onRefresh();
	}, [response, onRefresh]);

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
						 onChange={e => dispatchForm({type: 'CHANGE_STATE', payload: {title: e.currentTarget.value, titleValidation: validate(e)}})}/>
			<Input type={'number'} placeholder={currency(0)} top={'Остаток в рублях'} value={stateForm.sum}
						 required={true}
						 status={stateForm.sumValidation.status}
						 max={999999999}
						 min={0}
						 step={0.01}
						 bottom={stateForm.sumValidation.message ? stateForm.sumValidation.message : 'Денежные средства, находящиеся на счете в данный момент'}
						 onChange={e => dispatchForm({type: 'CHANGE_STATE', payload: {sum: e.currentTarget.value, sumValidation: validate(e)}})}/>
			<Button size={'xl'}>Сохранить</Button>
		</FormLayout>
	)
}