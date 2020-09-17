import React, {useEffect, useReducer} from 'react';
import {format} from 'date-fns';
import {Button, FormLayout, Input, Radio, Select, Textarea} from "@vkontakte/vkui";
import currency from "../../handlers/currency";
import useApi from "../../handlers/useApi";

const initialState = {
	account: '',
	title: '',
	date: format(new Date(), 'yyyy-MM-dd'),
	income: false,
	description: '',
	price: '',
	quantity: '',
	tags: []
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

export default ({accounts, id = null, setAccount}) => {
	const [{response}, doApiFetch] = useApi('/item');
	const [state, dispatch] = useReducer(reducer, initialState);
	const accountList = accounts.map(item => {
		return (<option key={item._id} value={item._id}>{item.title} ({currency(item.sum)})</option>)
	});

	useEffect(() => {
		if (!response) return;
		setAccount(response);
	}, [response, setAccount]);

	return (
		<FormLayout
			onSubmit={e => {
				e.preventDefault();
				doApiFetch({
					method: 'POST',
					date: state.date,
					title: state.title,
					description: state.description,
					price: state.price,
					quantity: state.quantity,
					income: state.income,
					tags: state.tags,
					itemFrom: state.account || id
				});
			}}
		>
			<Select top={'Счет'} placeholder={'Выберите счет'} onChange={(e) => {
				dispatch({type: 'CHANGE_STATE', payload: {account: e.currentTarget.value}})
			}} defaultValue={id || state.account} required={true}>
				{accountList}
			</Select>
			<Input type={'date'} top={'Дата'} value={state.date} required={true} onChange={(e) => {
				dispatch({type: 'CHANGE_STATE', payload: {date: e.currentTarget.value}})
			}}/>
			<Input type={'text'} placeholder={'Продукт, услуга, товар'} value={state.title} top={'Название'} required={true}
						 onChange={(e) => {
							 dispatch({type: 'CHANGE_STATE', payload: {title: e.currentTarget.value}})
						 }}/>
			<Radio name={'income'} value={false} defaultChecked={!state.income} onChange={(e) => {
				dispatch({type: 'CHANGE_STATE', payload: {income: e.currentTarget.value}})
			}}>Расход</Radio>
			<Radio name={'income'} value={true} defaultChecked={state.income} onChange={(e) => {
				dispatch({type: 'CHANGE_STATE', payload: {income: e.currentTarget.value}})
			}}>Доход</Radio>
			<Textarea top={'Описание'} placeholder={'Почему вы потратили деньги на этот товар(продукт, услугу)'}
								defaultValue={state.description} onChange={(e) => {
				dispatch({type: 'CHANGE_STATE', payload: {description: e.currentTarget.value}})
			}}/>
			<Input type={'number'} placeholder={currency(0)} top={'Цена'} value={state.price} required={true} onChange={(e) => {
				dispatch({type: 'CHANGE_STATE', payload: {price: e.currentTarget.value}})
			}}/>
			<Input type={'number'} placeholder={'0'} top={'Кол-во'} value={state.quantity} required={true} onChange={(e) => {
				dispatch({type: 'CHANGE_STATE', payload: {quantity: e.currentTarget.value}})
			}}/>
			<Button size={'xl'} onClick={() => {
			}}>Сохранить</Button>
		</FormLayout>
	)
}