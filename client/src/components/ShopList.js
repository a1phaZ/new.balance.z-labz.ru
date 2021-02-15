import React from 'react';
import {Cell} from "@vkontakte/vkui";
import {SET_MODAL, SET_SUCCESS_MESSAGE} from "../state/actions";

function sortId(x, y) {
		if (x.id>y.id) return -1;
		if (x.id<y.id) return 1;
		return 0;
}
function sortDone(x, y) {
	// true values first
	// return (x.done === y.done)? 0 : x.done? -1 : 1;
	// false values first
	return (x.done === y.done)? 0 : x.done? 1 : -1;
}
export default ({list, deleteMode, dispatch, setShopListItemTitle, dispatchList, setShopList, shopListFromServer}) => {
	return list.sort(sortId).sort(sortDone).map((item, index) => {
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