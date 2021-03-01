import React from 'react';
import {Cell} from "@vkontakte/vkui";

export default ({data, setAccount}) => {
	return data.map(account => {
		return (
			<Cell
				key={account._id}
				indicator={account.sum}
				expandable
				data-id={account._id}
				onClick={(e) => {
					setAccount({type: 'account', id: e.currentTarget.dataset.id});
				}}
			>
				{account.title}
			</Cell>
		)
	})
}