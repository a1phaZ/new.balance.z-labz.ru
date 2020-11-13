import React, {useEffect, useState} from 'react';
import useApi from "../handlers/useApi";
import {
	Alert,
	Cell,
	Div,
	Footer,
	Header,
	List,
	Panel,
	PanelHeader,
	PanelHeaderBack,
	PanelHeaderButton,
	PanelHeaderContent,
	PanelHeaderContext,
	Search,
	Title
} from "@vkontakte/vkui";
import currency from "../handlers/currency";
import Group from "@vkontakte/vkui/dist/components/Group/Group";
import {SET_ACTIVE_VIEW, SET_EDITED_ITEM, SET_HISTORY_BACK, SET_MODAL, SET_POPOUT} from "../state/actions";
import Icon28MarketAddBadgeOutline from "@vkontakte/icons/dist/28/market_add_badge_outline";
import Icon16Dropdown from '@vkontakte/icons/dist/16/dropdown';

import Icon28DeleteOutline from '@vkontakte/icons/dist/28/delete_outline';
import mapRichCell from "../handlers/mapRichCell";
import InfoSnackbar from "../components/InfoSnackbar";
import sort from "../handlers/sort";
import reduce from "../handlers/reduce";
import MonthSwitch from "../components/MonthSwitch";

export default ({id, account, dispatch, onRefresh}) => {
	const [isOpened, setIsOpened] = useState(false);
	const [{response}, doApiFetch] = useApi(`/money-box/${account?._id}`);
	const [items, setItems] = useState(() => {
		if (!account) return [];
		return account?.operations;
	});
	const [filteredItems, setFilteredItems] = useState(() => items || []);

	const accountItemsList = filteredItems.sort(sort).reduce(reduce, []).map(mapRichCell(dispatch));

	const toggleContext = () => {
		setIsOpened(!isOpened);
	}
	const alert = (
		<Alert
			actions={[
				{
					title: 'Отмена',
					autoclose: true,
					mode: "cancel"
				},
				{
					title: 'Удалить',
					mode: 'destructive',
					autoclose: true,
					action: async () => {
						toggleContext();
						await doApiFetch({
							method: 'DELETE'
						});
					}
				}
			]}
			onClose={() => {
				toggleContext();
				dispatch({type: SET_POPOUT, payload: {popout: null}})
			}}
		>
			<h2>Удалить счет?</h2>
			<p>Удаление счета приведет к удалению всех данных по доходам и расходам, привязанным к данному счету. Суммы
				бюджетов могут отображаться некорректно.</p>
		</Alert>
	)

	useEffect(() => {
		if (!account) return;
		setItems(account?.operations);
		setFilteredItems(account?.operations);
	}, [account]);

	useEffect(() => {
		if (!response) return;
		dispatch({type: SET_ACTIVE_VIEW, payload: {view: 'home', panel: 'home'}});
		// dispatch({type: SET_HISTORY_BACK});
		dispatch({type: SET_EDITED_ITEM, payload: {item: null}});
		onRefresh();
	}, [dispatch, response, onRefresh]);

	const onSearch = (str) => {
		if (str === '') {
			setFilteredItems(items);
		} else {
			setFilteredItems(account?.operations.filter(({title}) => title.toLowerCase().indexOf(str.toLowerCase()) > -1));
		}
	}

	return (
		<Panel id={id}>
			<PanelHeader left={
				<>
					<PanelHeaderBack onClick={() => {
						// dispatch({type: SET_ACTIVE_VIEW, payload: {view: 'home', panel: 'home'}});
						dispatch({type: SET_HISTORY_BACK})
						dispatch({type: SET_EDITED_ITEM, payload: {item: null}});
					}}/>
					<PanelHeaderButton
						onClick={() => {
							dispatch({type: SET_EDITED_ITEM, payload: {item: null}});
							dispatch({type: SET_MODAL, payload: {modal: 'add-money'}});
						}}
					>
						<Icon28MarketAddBadgeOutline/>
					</PanelHeaderButton>
				</>
			}
			>
				<PanelHeaderContent
					aside={account && <Icon16Dropdown style={{transform: `rotate(${isOpened ? '180deg' : '0'})`}}/>}
					onClick={toggleContext}
				>
					{account ? account?.title : 'Счет удалён'}
				</PanelHeaderContent>
			</PanelHeader>
			{
				account
				&&
			<>
				<PanelHeaderContext opened={isOpened} onClose={toggleContext}>
					<List>
						<Cell
							before={<Icon28DeleteOutline/>}
							onClick={() => {
								dispatch({type: SET_POPOUT, payload: {popout: alert}})
							}}
						>
							Удалить счет {account?.title}
						</Cell>
					</List>
				</PanelHeaderContext>
				<MonthSwitch onRefresh={onRefresh}/>
				<Search onChange={(e) => {
					onSearch(e.currentTarget.value)
				}}/>
				<Group
					header={<Header mode="secondary">Информация по счету</Header>}
					separator="show"
				>
					<Div>
						<Title level="1" weight="semibold" style={{marginBottom: 16}}>{currency(account?.sum)}</Title>
					</Div>

					{account?.operations.length === 0 && <Footer>Операций по счету еще не было</Footer>}
					<Div>
						{accountItemsList}
						{accountItemsList.length === 0 && <Footer>Нет данных для отображения</Footer>}
					</Div>
				</Group>
				<InfoSnackbar/>
			</>
			}

		</Panel>
	)
}