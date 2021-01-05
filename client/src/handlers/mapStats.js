import React from 'react';
import {RichCell} from "@vkontakte/vkui";
import currency from "./currency";

export default () => {
	return (item, index) => {
		return (
			<RichCell
				disabled
				key={index}
				multiline
				caption={`Кол-во: ${item?.quantity} | Ср. цена ${currency(item?.sum/item?.quantity)}`}
				after={currency(item?.sum)}
				data-title={item?.title}
			>
				{item?.title}
			</RichCell>
		)
	}
}