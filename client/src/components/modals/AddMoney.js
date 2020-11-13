import React, {useEffect, useReducer, useState} from 'react';
import {format} from 'date-fns';
import {Button, Checkbox, Counter, Div, FormLayout, Input, Radio, Select, Textarea} from "@vkontakte/vkui";
import currency from "../../handlers/currency";
import useApi from "../../handlers/useApi";
import validate from "../../handlers/validate";

const initialState = {
	account: '',
	title: '',
	date: format(new Date(), 'yyyy-MM-dd'),
	income: false,
	description: '',
	price: '',
	quantity: '',
	tags: [],
	boxPrice: false,
	validate: {
		account: {},
		title: {},
		description: {},
		price: {},
		quantity: {},
		tags: {},
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

export default ({accounts, id = null, editedItem = null, onRefresh}) => {
	const [apiStr] = useState(() => {
		return !editedItem ? '/item' : `/item/${editedItem._id}`;
	})
	const [{response}, doApiFetch] = useApi(apiStr);
	const [state, dispatch] = useReducer(reducer, initialState);
	const accountList = accounts.map(item => {
		return (<option key={item._id} value={item._id}>{item.title} ({currency(item.sum)})</option>)
	});

	useEffect(() => {
		if (!editedItem) return;
		editedItem.date = format(new Date(editedItem.date), 'yyyy-MM-dd');
		dispatch({type: 'CHANGE_STATE', payload: {...editedItem}});
	}, [editedItem, dispatch]);

	useEffect(() => {
		if (!response) return;
		onRefresh();
	}, [response, onRefresh]);

	const tags = state.tags.map((tag, index) => <Counter style={{marginRight: '5px'}} key={index}>{tag}</Counter>);

	return (
		<FormLayout
			onSubmit={e => {
				e.preventDefault();
				doApiFetch({
					method: !editedItem ? 'POST' : 'PATCH',
					date: state.date,
					title: state.title,
					description: state.description,
					price: state.boxPrice ? state.price / state.quantity : state.price,
					quantity: state.quantity,
					income: state.income,
					tags: state.tags,
					itemFrom: state.account || id
				});
			}}
		>
			<Select top={'Счет'}
							placeholder={'Выберите счет'}
							onChange={(e) => {
								dispatch({
									type: 'CHANGE_STATE',
									payload: {account: e.currentTarget.value, validateForm: {account: validate(e)}}
								})
							}}
							defaultValue={editedItem?.itemFrom || id || state.account} required={true}
							status={state.validate?.account?.status}
							bottom={state.validate?.account?.message}
			>
				{accountList}
			</Select>
			<Input type={'date'}
						 top={'Дата'}
						 value={state.date}
						 required={true}
						 onChange={(e) => {
							 dispatch({type: 'CHANGE_STATE', payload: {date: e.currentTarget.value}})
						 }}
			/>
			<Input type={'text'}
						 placeholder={'Продукт, услуга, товар'}
						 value={state.title}
						 top={'Название'}
						 required={true}
						 maxLength={20}
						 status={state.validate?.title?.status}
						 bottom={state.validate?.title?.message ? state.validate?.title?.message : `${state.title.length} из 20`}
						 onChange={(e) => {
							 dispatch({
								 type: 'CHANGE_STATE',
								 payload: {title: e.currentTarget.value, validateForm: {title: validate(e)}}
							 })
						 }}/>
			<Radio name={'income'}
						 value={false}
						 defaultChecked={state.income ? null : true}
						 onClick={() => {
							 dispatch({type: 'CHANGE_STATE', payload: {income: false}})
						 }}
			>
				Расход
			</Radio>
			<Radio name={'income'}
						 value={true}
						 defaultChecked={state.income ? true : null}
						 onClick={() => {
							 dispatch({type: 'CHANGE_STATE', payload: {income: true}})
						 }}
			>
				Доход
			</Radio>
			{
				!state.income
				&&
				<Textarea top={'Описание'}
									placeholder={'Описание товара(продукта, услуги)'}
									value={state.description}
									maxLength={70}
									status={state.validate?.description?.status}
									bottom={state.validate?.description?.message ? state.validate?.description?.message : `${state.description.length} из 70`}
									onChange={(e) => {
										dispatch({
											type: 'CHANGE_STATE',
											payload: {
												description: e.currentTarget.value,
												validateForm: {description: validate(e)}
											}
										})
									}}
				/>
			}
			<Input type={'text'}
						 top={'Теги'}
						 value={state.tags.join(' ')}
						 placeholder={'Теги через пробел'}
						 status={state.validate?.tags?.status}
						 maxLength={100}
						 bottom={state.validate?.tags?.message ? state.validate?.tags?.message : `${state.tags.join(' ').length} из 100 символов`}
						 onChange={(e) => {
							 dispatch({
								 type: 'CHANGE_STATE',
								 payload: {tags: e.currentTarget.value !== '' ? e.currentTarget.value.toLowerCase().split(' ') : [], validateForm: {tags: validate(e)}}
							 })
						 }}
			/>
			{
				state.tags.length !== 0
				&&
				<Div style={{display: 'flex'}}>
					{tags}
				</Div>
			}
			<Input type={'number'}
						 placeholder={currency(0)}
						 top={'Цена'}
						 max={99999999}
						 step={0.01}
						 status={state.validate?.price?.status}
						 bottom={state.validate?.price?.message}
						 value={state.price}
						 required={true}
						 onChange={(e) => {
							 dispatch({
								 type: 'CHANGE_STATE',
								 payload: {price: e.currentTarget.value, validateForm: {price: validate(e)}}
							 })
						 }}
			/>
			<Checkbox value={state.boxPrice}
								onClick={() => {
									dispatch({type: 'CHANGE_STATE', payload: {boxPrice: !state.boxPrice}})
								}}
			>
				Цена за упаковку
			</Checkbox>
			<Input type={'number'}
						 placeholder={'0'}
						 top={'Кол-во'}
						 max={9999999}
						 step={0.001}
						 status={state.validate?.quantity?.status}
						 bottom={state.validate?.quantity?.message}
						 value={state.quantity}
						 required={true}
						 onChange={(e) => {
							 dispatch({
								 type: 'CHANGE_STATE',
								 payload: {quantity: e.currentTarget.value, validateForm: {quantity: validate(e)}}
							 })
						 }}
			/>
			<Button size={'xl'}>
				{`Сохранить ${state.boxPrice ? currency(state.price) : currency(state.price * state.quantity)}`}
			</Button>
		</FormLayout>
	)
}