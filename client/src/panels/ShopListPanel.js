import React, {useEffect, useReducer} from 'react';
import {Cell, Footer, FormLayout, Input, List, Panel, PanelHeader, PanelHeaderBack} from "@vkontakte/vkui";
import {SET_CLOSE_MODAL_WITHOUT_SAVING, SET_HISTORY_BACK, SET_MODAL} from "../state/actions";
import InfoSnackbar from "../components/InfoSnackbar";
import regexp from "../handlers/regexp";
import validate from "../handlers/validate";

const initialState = {
	list: [],
	item: {
		id: 1,
		title: '',
		done: false
	},
	id: null,
	validate: {
		title: {}
	}
}

const reducer = (state, action) => {
	switch (action.type) {
		case 'INITIAL_LIST': {
			const index = action.payload.list[action.payload.list.length - 1] ? action.payload.list[action.payload.list.length - 1].id : 1;
			return {
				...state,
				list: action.payload.list,
				item: {
					id: index + 1,
					title: '',
					done: false
				}
			}
		}
		case 'SET_TITLE': {
			const {payload: {validateForm, title}} = action;
			const item = {
				id: state.item.id,
				title: title,
				done: false
			}
			return {
				...state,
				item,
				validate: {...state.validate, ...validateForm}
			}
		}
		case 'SET_ID': {
			return {
				...state,
				id: action.payload.id
			}
		}
		case 'SET_ITEM_TO_LIST': {
			const newList = [...state.list, state.item];
			const index = newList[newList.length - 1] ? newList[newList.length - 1].id : 1;
			return {
				...state,
				list: newList,
				item: {title: '', done: false, id: index + 1}
			}
		}
		case 'SET_DONE': {
			const {list} = state;
			const {id} = action.payload;
			const index = list.findIndex((item) => item.id === id);
			if (index !== -1) {
				list[index].done = !list[index].done;
			}
			return {
				...state,
				list
			}
		}
		case 'DELETE_ITEM': {
			const {list} = state;
			const {id} = action.payload;
			const index = list.findIndex((item) => item.id === id);
			list.splice(index, 1);
			if (list.length === 0) {
				localStorage.removeItem('shopList');
			}
			return {
				...state,
				list
			}
		}
		default:
			return state;
	}
}

export default ({id, dispatch, closeModalWithoutSaving, shopListFromServer, setShopListItemTitle, setShopList}) => {

	const [state, dispatchList] = useReducer(reducer, initialState);
	const shopList =
		shopListFromServer.length
			?
			state.list.map((item) => {
				return (
					<Cell
						key={item.id}
						selectable={!item.done}
						removable={item.done}
						checked={item.done}
						// disabled={item.done}
						onChange={() => {
							setShopListItemTitle(shopListFromServer[shopListFromServer.findIndex(i => i.id === item.id)].title);
							dispatch({type: SET_CLOSE_MODAL_WITHOUT_SAVING, payload: {closeModalWithoutSaving: false}});
							dispatchList({type: 'SET_ID', payload: {id: item.id}});
							dispatchList({type: 'SET_DONE', payload: {id: item.id}});
							dispatch({type: SET_MODAL, payload: {modal: 'add-money'}});
						}}
						onRemove={() => {
							dispatchList({type: 'DELETE_ITEM', payload: {id: item.id}});
							setShopList(state.list);
						}}
					>
						{item.title}
					</Cell>
				)
			})
			:
			<Footer>Список покупок пуст</Footer>
	;

	useEffect(() => {
		dispatchList({type: 'INITIAL_LIST', payload: {list: shopListFromServer}});
	}, [shopListFromServer]);

	useEffect(() => {
		if (state.list.length === 0) return;
		setShopList(state.list);
	}, [state.list, setShopList]);

	useEffect(() => {
		if (!closeModalWithoutSaving) return;
		dispatchList({type: 'SET_DONE', payload: {id: state.id}});

		dispatch({type: SET_CLOSE_MODAL_WITHOUT_SAVING, payload: {closeModalWithoutSaving: false}});
	}, [closeModalWithoutSaving, dispatch, dispatchList, state, setShopList]);

	return (
		<Panel id={id}>
			<PanelHeader
				left={
					<PanelHeaderBack onClick={() => {
						dispatch({type: SET_HISTORY_BACK});
					}}/>
				}
			>
				Список покупок
			</PanelHeader>
			<FormLayout
				onSubmit={(e) => {
					e.preventDefault();
					dispatchList({type: 'SET_ITEM_TO_LIST'});
				}}
			>
				<Input type={'text'}
							 placeholder={'Продукт, услуга, товар'}
							 value={state.item.title}
							 top={'Название'}
							 required={true}
							 maxLength={20}
							 status={state.validate?.title?.status}
							 bottom={state.validate?.title?.message ? state.validate?.title?.message : `${state.item.title.length} из 20`}
							 onChange={(e) => {
								 dispatchList({
									 type: 'SET_TITLE',
									 payload: {
										 title: regexp(e.currentTarget.value),
										 validateForm: {title: validate(e)}
									 }
								 })
							 }}/>
			</FormLayout>
			<List>
				{shopList}
			</List>
			<InfoSnackbar/>
		</Panel>
	)
}