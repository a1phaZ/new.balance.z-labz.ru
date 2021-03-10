import React from 'react';
import {Cell} from "@vkontakte/vkui";
import currency from "../services/currency";

export default ({data, setId, type}) => {
	return data.map(item => {
		return (
			<Cell
				key={item._id}
				indicator={currency(item.sum)}
				expandable
				data-id={item._id}
				onClick={(e) => {
					setId({type: type, id: e.currentTarget.dataset.id});
				}}
			>
				{item.title}
			</Cell>
		)
	})
}