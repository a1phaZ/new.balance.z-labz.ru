import React, {useReducer, useEffect} from 'react';
import {Button, FormLayout, Input} from "@vkontakte/vkui";
import useApi from "../../handlers/useApi";
import validate from "../../handlers/validate";
import currency from "../../handlers/currency";

const initialState = {
	title: '',
	sum: '',
	validate: {
		title: {},
		sum: {}
	}
}

const reducer = (state, action) => {
	switch (action.type) {
		case 'CHANGE_STATE':
			const {payload: {validateForm, ...payload}} = action;
			return {
				...state,
				...payload,
				validate: {...state.validate, ...validateForm}
			}
		default:
			return state;
	}
}

export default ({onRefresh}) => {
	const [stateForm, dispatchForm] = useReducer(reducer, initialState);
	const [{response}, doApiFetch] = useApi('/budget');

	useEffect(() => {
		if (!response) return;
		onRefresh();
	}, [onRefresh, response]);

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
			<Input type={'text'} placeholder={'Название бюджета'} top={'Название'} value={stateForm.title}
						 required={true}
						 maxLength={'20'}
						 status={stateForm.validate?.title?.status}
						 bottom={stateForm.validate?.title?.message ? stateForm.validate?.title?.message : `${stateForm.title.length} из 20`}
						 onChange={e => dispatchForm({
							 type: 'CHANGE_STATE',
							 payload: {title: e.currentTarget.value, validateForm: {title: validate(e)}}
						 })}/>
			<Input type={'number'} placeholder={currency(0)} top={'Бюджет в рублях'} value={stateForm.sum}
						 required={true}
						 status={stateForm.validate?.sum?.status}
						 max={999999999}
						 bottom={stateForm.validate?.sum?.message ? stateForm.validate?.sum?.message : 'Сколько вы готовы на это потратить?'}
						 onChange={e => dispatchForm({
							 type: 'CHANGE_STATE',
							 payload: {sum: e.currentTarget.value, validateForm: {sum: validate(e)}}
						 })}/>
			<Button size={'xl'}>Сохранить</Button>
		</FormLayout>
	)
}