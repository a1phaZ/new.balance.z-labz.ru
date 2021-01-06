import React, {useEffect, useReducer, useState} from 'react';
import {format} from 'date-fns';
import {
	Button,
	Checkbox,
	Counter,
	Div,
	FormLayout,
	FormLayoutGroup,
	Input,
	Radio,
	Select,
	Textarea
} from "@vkontakte/vkui";
import currency from "../../handlers/currency";
import useApi from "../../handlers/useApi";
import validate from "../../handlers/validate";
import regexp from "../../handlers/regexp";
import {SET_ACCOUNTS, SET_BUDGETS} from "../../state/actions";
import Icon24AddSquareOutline from '@vkontakte/icons/dist/24/add_square_outline';

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

export default ({accounts, id = null, editedItem = null, dispatch, budget, panel = '', shopListItemTitle, setShopListItemTitle, date}) => {
	const [apiStr] = useState(() => {
		return !editedItem ? '/item' : `/item/${editedItem._id}`;
	})
	const [{response}, doApiFetch] = useApi(apiStr);
	const [state, dispatchForm] = useReducer(reducer, initialState);
	const [descriptionShow, setDescriptionShow] = useState(() => !!state.description);
	const accountList = accounts.map(item => {
		return (<option key={item._id} value={item._id}>{item.title} ({currency(item.sum)})</option>)
	});

	useEffect(() => {
		if (!shopListItemTitle) return;
		dispatchForm({type: 'CHANGE_STATE', payload: {title: shopListItemTitle}})
	}, [shopListItemTitle]);

	useEffect(() => {
		if (!editedItem) return;
		editedItem.date = format(new Date(editedItem.date), 'yyyy-MM-dd');
		dispatchForm({type: 'CHANGE_STATE', payload: {...editedItem}});
	}, [editedItem]);

	useEffect(() => {
		if (!budget?.title) return;
		if (panel === 'home') return;
		dispatchForm({
			type: 'CHANGE_STATE',
			payload: {
				tags: editedItem?.tags || budget?.title.toLowerCase().split(' ')
			}
		})
	}, [budget, panel, editedItem]);

	useEffect(() => {
		if (!response) return;
		dispatch({type: SET_ACCOUNTS, payload: {accounts: response?.accounts ? response?.accounts : []}});
		dispatch({type: SET_BUDGETS, payload: {budgets: response?.budgets ? response?.budgets : []}});
	}, [response, dispatch]);

	const tags = state.tags.filter(tag => !!tag.length).map(
		(tag, index) =>
			<Counter
				style={{
					marginRight: '5px',
					marginBottom: '5px',
					maxWidth: '100%',
					overflow: 'hidden',
					overflowWrap: 'normal'
				}}
				key={index}
			>
				{tag}
			</Counter>
	);

	return (
		<FormLayout
			onSubmit={e => {
				e.preventDefault();
				doApiFetch({
					method: !editedItem ? 'POST' : 'PATCH',
					date: state.date,
					title: state.title,
					description: state.description,
					price: state.boxPrice ? (state.price / state.quantity).toFixed(4) : state.price,
					quantity: state.quantity,
					income: state.income,
					tags: state.tags.filter(tag => !!tag.length),
					itemFrom: state.account || editedItem?.itemFrom || id,
					params: {
						date: new Date(date)
					}
				});
				setShopListItemTitle('');
			}}
		>
			<Select top={'Счет'}
							placeholder={'Выберите счет'}
							onChange={(e) => {
								dispatchForm({
									type: 'CHANGE_STATE',
									payload: {account: e.currentTarget.value, validateForm: {account: validate(e)}}
								})
							}}
							defaultValue={state.account || editedItem?.itemFrom || id} required={true}
							status={state.validate?.account?.status}
							bottom={state.validate?.account?.message}
			>
				{accountList}
			</Select>
			<Input type={'date'}
						 top={'Дата'}
						 value={state.date}
						 required={true}
						 min={'2015-01-01'}
						 max={format(new Date(), 'yyyy-MM-dd')}
						 onChange={(e) => {
							 dispatchForm({
								 type: 'CHANGE_STATE',
								 payload: {date: e.currentTarget.value, validateForm: {date: validate(e)}}
							 })
						 }}
						 status={state.validate?.date?.status}
						 bottom={state.validate?.date?.message}
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
							 dispatchForm({
								 type: 'CHANGE_STATE',
								 payload: {
									 title: regexp(e.currentTarget.value),
									 validateForm: {title: validate(e)}
								 }
							 })
						 }}/>
			<Radio name={'income'}
						 value={false}
						 defaultChecked={state.income ? null : true}
						 onClick={() => {
							 dispatchForm({type: 'CHANGE_STATE', payload: {income: false}})
						 }}
			>
				Расход
			</Radio>
			<Radio name={'income'}
						 value={true}
						 defaultChecked={state.income ? true : null}
						 onClick={() => {
							 dispatchForm({type: 'CHANGE_STATE', payload: {income: true}})
							 setDescriptionShow(false);
						 }}
						 disabled={!!shopListItemTitle}
			>
				Доход
			</Radio>
			<FormLayoutGroup top={'Описание'}>
				{
					!state.income
					&&
					<Button
						type={'button'}
						mode="secondary"
						before={<Icon24AddSquareOutline/>}
						size="l"
						disabled={state.description || descriptionShow}
						// style={state.description ? {display: 'none'} : {}}
						onClick={() => {
							setDescriptionShow(true);
						}}
					>
						Добавить описание
					</Button>
				}
				{
					(descriptionShow || state.description) &&
					<Textarea top={'Описание'}
										placeholder={'Описание товара(продукта, услуги)'}
										value={state.description}
										maxLength={70}
										status={state.validate?.description?.status}
										bottom={state.validate?.description?.message ? state.validate?.description?.message : `${state.description.length} из 70`}
										onChange={(e) => {
											dispatchForm({
												type: 'CHANGE_STATE',
												payload: {
													description: regexp(e.currentTarget.value),
													validateForm: {description: validate(e)}
												}
											})
										}}
					/>
				}
			</FormLayoutGroup>
			<Input type={'text'}
						 top={'Теги'}
						 value={state.tags.join(' ')}
						 placeholder={'Теги через пробел'}
						 status={state.validate?.tags?.status}
						 maxLength={100}
						 bottom={state.validate?.tags?.message ? state.validate?.tags?.message : `${state.tags.join(' ').length} из 100 символов`}
						 onChange={(e) => {
							 dispatchForm({
								 type: 'CHANGE_STATE',
								 payload: {
									 tags: e.currentTarget.value !== '' ? regexp(e.currentTarget.value).toLowerCase().split(' ') : [],
									 validateForm: {tags: validate(e)}
								 }
							 })
						 }}
			/>
			{
				!!tags.length &&
				state.tags.length !== 0
				&&
				<Div style={{display: 'flex', flexWrap: 'wrap'}}>
					{tags}
				</Div>
			}
			<Input type={'number'}
						 placeholder={currency(0)}
						 pattern={'[0-9]+([,\\.][0-9]+)?'}
						 top={'Цена'}
						 inputMode="decimal"
						 max={99999999}
						 min={0}
						 step={0.0001}
						 status={state.validate?.price?.status}
						 bottom={state.validate?.price?.message}
						 value={state.price}
						 required={true}
						 onChange={(e) => {
							 dispatchForm({
								 type: 'CHANGE_STATE',
								 payload: {price: e.currentTarget.value.replace(/[^\d.]*/, ''), validateForm: {price: validate(e)}}
							 })
						 }}
			/>
			{
				!state.income
				&&
				<Checkbox value={state.boxPrice}
									onClick={() => {
										dispatchForm({type: 'CHANGE_STATE', payload: {boxPrice: !state.boxPrice}})
									}}
				>
					Цена за упаковку
				</Checkbox>
			}
			<Input type={'number'}
						 placeholder={'0'}
						 pattern={'[0-9]+([,\\.][0-9]+)?'}
						 top={'Кол-во'}
						 inputMode="decimal"
						 max={9999999}
						 min={0}
						 step={0.001}
						 status={state.validate?.quantity?.status}
						 bottom={state.validate?.quantity?.message}
						 value={state.quantity}
						 required={true}
						 onChange={(e) => {
							 dispatchForm({
								 type: 'CHANGE_STATE',
								 payload: {
									 quantity: e.currentTarget.value.replace(/[^\d.]*/, ''),
									 validateForm: {quantity: validate(e)}
								 }
							 })
						 }}
			/>
			<Button size={'xl'}>
				{`Сохранить ${state.boxPrice ? currency(state.price) : currency(state.price * state.quantity)}`}
			</Button>
		</FormLayout>
	)
}