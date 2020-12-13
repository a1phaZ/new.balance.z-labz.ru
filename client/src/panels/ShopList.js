import React, { useReducer, useEffect, useState } from 'react';
import {Cell, List, Panel, PanelHeader, WriteBar, WriteBarIcon} from "@vkontakte/vkui";
import {SET_CLOSE_MODAL_WITHOUT_SAVING, SET_MODAL} from "../state/actions";
import InfoSnackbar from "../components/InfoSnackbar";

const initialState = {
	list: [],
	item: {
		id: 1,
		title: '',
		done: false
	},
	id: null
}

const reducer = (state, action) => {
	switch (action.type) {
		case 'INITIAL_LIST': {
			return {
				...state,
				list: action.payload.list,
				item: {
					id: action.payload.list.length+1,
					title: '',
					done: false
				}
			}
		}
		case 'SET_TITLE': {
			const item = {
				id: state.item.id,
				title: action.payload.title,
				done: false
			}
			return {
				...state,
				item
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
			return {
				...state,
				list: newList,
				item: { title: '', done: false, id: newList.length+1 }
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
		default:
			return state;
	}
}

export default ({ id, dispatch, closeModalWithoutSaving, shopListFromServer, setShopListItemTitle }) => {

	const [state, dispatchList] = useReducer(reducer, initialState);
	const [list, setList] = useState(state.list);
	const shopList = list.map((item) => {
		return (
			<Cell
				key={item._id}
				selectable
				checked={item.done}
				disabled={item.done}
				onChange={() => {
					setShopListItemTitle(state.list[list.findIndex(i => i.id === item.id)].title);
					dispatch({type: SET_CLOSE_MODAL_WITHOUT_SAVING, payload: {closeModalWithoutSaving: false}});
					dispatchList({type: 'SET_ID', payload: {id: item.id}})
					dispatchList({type: 'SET_DONE', payload: {id: item.id}})
					dispatch({type: SET_MODAL, payload: {modal: 'add-money'}});
				}}
			>
				{item.title}
			</Cell>
		)
	});

	useEffect(() => {
		dispatchList({type: 'INITIAL_LIST', payload: {list: shopListFromServer}});
	}, [shopListFromServer]);

	useEffect(() => {
		if (!closeModalWithoutSaving) return;
		dispatchList({type: 'SET_DONE', payload: {id: state.id}});
		dispatch({type: SET_CLOSE_MODAL_WITHOUT_SAVING, payload: {closeModalWithoutSaving: false}});
	}, [closeModalWithoutSaving, dispatch, dispatchList, state]);

	useEffect(() => {
		setList(state.list);
	}, [state.list]);

	return (
		<Panel id={id} >
			<PanelHeader >
				Список покупок
			</PanelHeader>
			<WriteBar
				value={state.item.title}
				onSubmit={(e) => {
					e.preventDefault();
					console.log('submit');
				}}
				onChange={(e) => dispatchList({type: 'SET_TITLE', payload: {title: e.currentTarget.value}})}
				after={
					<WriteBarIcon
						mode="send"
						onClick={() => {
							dispatchList({type: 'SET_ITEM_TO_LIST'});

						}}
						disabled={state.item.title.length === 0}
					/>
				}
				placeholder={'Название'}
			/>
			<List>
				{shopList}
			</List>
			{/*<FixedLayout vertical={'bottom'}>*/}
			{/*	*/}
			{/*</FixedLayout>*/}
			<InfoSnackbar/>
		</Panel>
	)
}