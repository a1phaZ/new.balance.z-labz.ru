import React from 'react';
import {RichCell} from "@vkontakte/vkui";
import currency from "./currency";
import {SET_ACTIVE_VIEW} from "../state/actions";

export default ({dispatch, setSelectedItemTitle}) => {
	return (item, index) => {
		return (
			<RichCell
				disabled
				key={index}
				multiline
				caption={`Кол-во: ${(item?.quantity).toFixed(3)} | Ср. цена: ${currency((item?.sum/item?.quantity).toFixed(2))}`}
				after={currency(item?.sum)}
				data-title={item?.title}
				onClick={
					() => {
						setSelectedItemTitle(item?.title);
						dispatch({type: SET_ACTIVE_VIEW, payload: {view: 'stats', panel: 'details-items'}});
					}
				}
			>
				{item?.title}
			</RichCell>
		)
	}
}