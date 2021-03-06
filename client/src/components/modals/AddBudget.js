import React, {useEffect, useReducer, useState} from 'react';
import {Button, FormLayout, Input} from "@vkontakte/vkui";
import useApi from "../../handlers/useApi";
import validate from "../../handlers/validate";
import currency from "../../handlers/currency";
import regexp from "../../handlers/regexp";
import {SET_ACCOUNTS, SET_BUDGETS, SET_EDITED_ITEM} from "../../state/actions";

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

export default ({dispatch, editedItem = null, date}) => {
	const [stateForm, dispatchForm] = useReducer(reducer, initialState);
	const [apiStr] = useState(() => {
		return !editedItem ? '/budget' : `/budget/${editedItem._id}`;
	})
	const [{response}, doApiFetch] = useApi(apiStr);

	useEffect(() => {
		if (!editedItem) return;
		if (!response) dispatchForm({type: 'CHANGE_STATE', payload: {...editedItem}});
	}, [editedItem, dispatchForm, response]);

	useEffect(() => {
		if (!response) return;
		dispatch({type: SET_ACCOUNTS, payload: {accounts: response?.accounts ? response?.accounts : []}});
		dispatch({type: SET_BUDGETS, payload: {budgets: response?.budgets ? response?.budgets : []}});
		dispatch({type: SET_EDITED_ITEM, payload: {item: null}});
	}, [response, dispatch]);

	return (
		<FormLayout
			onSubmit={async e => {
				e.preventDefault();
				await doApiFetch({
					method: !editedItem ? 'POST' : 'PATCH',
					title: stateForm.title,
					sum: stateForm.startSum,
					params: {
						date: new Date(date)
					}
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
							 payload: {title: regexp(e.currentTarget.value), validateForm: {title: validate(e)}}
						 })}/>
			<Input type={'number'} placeholder={currency(0)} top={'Бюджет в рублях'} value={stateForm.startSum}
						 pattern={'[0-9]+([,\\.][0-9]+)?'}
						 inputMode="decimal"
						 required={true}
						 status={stateForm.validate?.startSum?.status}
						 min={0}
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