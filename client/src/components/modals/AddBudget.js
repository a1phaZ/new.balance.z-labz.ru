import React, {useEffect, useReducer, useState} from 'react';
import {Button, FormLayout, Input} from "@vkontakte/vkui";
import useApi from "../../handlers/useApi";
import validate from "../../handlers/validate";
import currency from "../../handlers/currency";
import {SET_BUDGET} from "../../state/actions";

const initialState = {
	title: '',
	startSum: '',
	validate: {
		title: {},
		startSum: {}
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

export default ({onRefresh, editedItem = null, dispatch}) => {

	const [stateForm, dispatchForm] = useReducer(reducer, initialState);
	const [apiStr] = useState(() => {
		return !editedItem ? '/budget' : `/budget/${editedItem._id}`;
	})
	const [{response}, doApiFetch] = useApi(apiStr);

	useEffect(() => {
		if (!editedItem) return;
		dispatchForm({type: 'CHANGE_STATE', payload: {...editedItem}});
	}, [editedItem, dispatchForm]);

	useEffect(() => {
		if (!response) return;
		onRefresh();
		dispatch({type: SET_BUDGET, payload: {id: response._id}});
		dispatchForm({type: 'CHANGE_STATE', payload: {...response}});
	}, [onRefresh, response, dispatch, editedItem]);

	return (
		<FormLayout
			onSubmit={async e => {
				e.preventDefault();
				await doApiFetch({
					method: !editedItem ? 'POST' : 'PATCH',
					title: stateForm.title,
					sum: stateForm.startSum
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
			<Input type={'number'} placeholder={currency(0)} top={'Бюджет в рублях'} value={stateForm.startSum}
						 required={true}
						 status={stateForm.validate?.startSum?.status}
						 max={999999999}
						 step={0.01}
						 bottom={stateForm.validate?.startSum?.message ? stateForm.validate?.startSum?.message : 'Сколько вы готовы на это потратить?'}
						 onChange={e => dispatchForm({
							 type: 'CHANGE_STATE',
							 payload: {startSum: e.currentTarget.value, validateForm: {startSum: validate(e)}}
						 })}/>
			<Button size={'xl'}>Сохранить</Button>
		</FormLayout>
	)
}