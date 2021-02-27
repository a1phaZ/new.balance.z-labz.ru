import React from 'react';
import {Cell} from "@vkontakte/vkui";

export default ({data}) => {
	return data.map(account => {
		return (
			<Cell
				key={account._id}
				indicator={account.sum}
				expandable
				data-id={account._id}
			>
				{account.title}
			</Cell>
		)
	})
}