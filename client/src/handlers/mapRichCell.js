import React from 'react';
import {RichCell} from "@vkontakte/vkui";
import {format} from "date-fns";
import ruLocale from "date-fns/locale/ru";
import currency from "./currency";
import {SET_EDITED_ITEM, SET_MODAL} from "../state/actions";

export default function mapRichCell(dispatch) {
	return (item, index) => {
		return (
			<RichCell
				key={index}
				multiline
				caption={format(new Date(item?.date), 'dd MMMM yyyy', {locale: ruLocale})}
				after={item?.income ? currency(item?.sum) : currency(-1 * item?.sum)}
				data-id={item?._id}
				onClick={() => {
					dispatch({type: SET_EDITED_ITEM, payload: {item: item}});
					dispatch({type: SET_MODAL, payload: {modal: 'add-money'}});
				}}
			>
				{item?.title}
			</RichCell>
		)
	};
}