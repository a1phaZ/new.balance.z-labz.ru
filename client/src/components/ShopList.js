import React from 'react';
import {Cell} from "@vkontakte/vkui";
import {SET_MODAL, SET_SUCCESS_MESSAGE} from "../state/actions";

export default ({list, deleteMode, dispatch, setShopListItemTitle, dispatchList, setShopList, shopListFromServer}) => {
	return list.map((item, index) => {
		return (
			<Cell
				key={item.id || 1000+index}
				selectable={!deleteMode}
				removable={deleteMode}
				checked={item.done}
				disabled={deleteMode ? false : item.done}
				onChange={() => {
					setShopListItemTitle(shopListFromServer[shopListFromServer.findIndex(i => i.id === item?.id)].title);
					dispatchList({type: 'SET_ID', payload: {id: item?.id}});
					dispatch({type: SET_SUCCESS_MESSAGE, payload: {message: null}});
					dispatch({type: SET_MODAL, payload: {modal: 'add-money'}});
				}}
				onRemove={() => {
					dispatchList({type: 'DELETE_ITEM', payload: {id: item?.id}});
					setShopList(list);
				}}
			>
				{item.title}
			</Cell>
		)
	})
}