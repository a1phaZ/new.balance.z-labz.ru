import React, {useState} from 'react';
import Cell from "@vkontakte/vkui/dist/components/Cell/Cell";
import {Footer, Text} from "@vkontakte/vkui";
import currency from "../handlers/currency";
import {SET_ACCOUNT, SET_ACTIVE_VIEW, SET_BUDGET} from "../state/actions";

export default ({data, showAll = false, dispatch, itemsName, needHide = true}) => {
	const [isShow, setIsShow] = useState(() => {
		return showAll;
	});

	if (data.length === 0) {
		if (itemsName === 'accounts') {
			return <Footer>Нет счетов для отображения</Footer>
		}
		if (itemsName === 'budgets') {
			return <Footer>Нет бюджетов для отображения</Footer>
		}
	}

	let list = data
		.sort((a, b) => {
			return b.sum - a.sum;
		})
		.map((account, index) => {
			if (index === 3 && !isShow) {
				return <Cell
					key={'showAll'}
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
					if (itemsName === 'accounts') {
						await dispatch({type: SET_ACCOUNT, payload: {id: e.currentTarget.dataset.id}});
						await dispatch({type: SET_ACTIVE_VIEW, payload: {view: 'info', panel: 'account'}});
					}
					if (itemsName === 'budgets') {
						await dispatch({type: SET_BUDGET, payload: {id: e.currentTarget.dataset.id}});
						await dispatch({type: SET_ACTIVE_VIEW, payload: {view: 'info', panel: 'budget'}});
					}
				}}
			>
				{account.title}
			</Cell>
		});
	if (needHide) {
		if (isShow) list.push(<Cell
			key={data.length}
			expandable
			onClick={() => {
				setIsShow(false);
			}}
		>
			<Text weight="semibold" style={{marginBottom: 16}}>
				{itemsName === 'accounts' ? 'Скрыть счета' : 'Скрыть бюджеты'}
			</Text>
		</Cell>);
	}


	return list;
}