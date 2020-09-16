import React, {useState} from 'react';
import Cell from "@vkontakte/vkui/dist/components/Cell/Cell";
import {Text} from "@vkontakte/vkui";
import currency from "../handlers/currency";
import {SET_ACCOUNT, SET_ACTIVE_VIEW} from "../state/actions";

export default ({data, showAll = false, dispatch}) => {
	const [isShow, setIsShow] = useState(() => {
		return showAll;
	});

	let list = data
		.sort((a, b) => {
			return b.sum - a.sum;
		})
		.map((account, index) => {
			if (index === 3 && !isShow) {
				return <Cell
					key={index}
					expandable
					onClick={() => {
						setIsShow(true);
					}}
				>
					<Text weight="semibold" style={{marginBottom: 16}}>
						Показать все
					</Text>
				</Cell>
			}
			if (index > 3 && !isShow) {
				return null
			}
			return <Cell
				key={index}
				indicator={currency(account.sum)}
				expandable
				data-id={account._id}
				onClick={async (e) => {
					await dispatch({type: SET_ACCOUNT, payload: {id: e.currentTarget.dataset.id}});
					await dispatch({type: SET_ACTIVE_VIEW, payload: {view: 'info', panel: 'account'}});
				}}
			>
				{account.title}
			</Cell>
		});
	if (isShow) list.push(<Cell
		key={data.length}
		expandable
		onClick={() => {
			setIsShow(false);
		}}
	>
		<Text weight="semibold" style={{marginBottom: 16}}>
			Скрыть счета
		</Text>
	</Cell>);

	return list;
}