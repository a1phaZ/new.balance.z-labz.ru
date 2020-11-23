import React, {useEffect, useState} from 'react';
import {
	Alert,
	Cell,
	Div,
	Footer,
	Group,
	List,
	MiniInfoCell,
	Panel,
	PanelHeader,
	PanelHeaderBack,
	PanelHeaderButton,
	PanelHeaderContent,
	PanelHeaderContext
} from "@vkontakte/vkui";
import {SET_EDITED_ITEM, SET_HISTORY_BACK, SET_MODAL, SET_POPOUT, SET_TOGGLE_CONTEXT} from "../state/actions";
import Icon28MarketAddBadgeOutline from "@vkontakte/icons/dist/28/market_add_badge_outline";
import useApi from "../handlers/useApi";
import Icon16Dropdown from "@vkontakte/icons/dist/16/dropdown";
import Icon28DeleteOutline from '@vkontakte/icons/dist/28/delete_outline';
import Icon28EditOutline from '@vkontakte/icons/dist/28/edit_outline';
import Icon20PinOutline from '@vkontakte/icons/dist/20/pin_outline';
import Icon20Add from '@vkontakte/icons/dist/20/add';
import Icon20BombOutline from '@vkontakte/icons/dist/20/bomb_outline';
import mapRichCell from "../handlers/mapRichCell";
import InfoSnackbar from "../components/InfoSnackbar";
import sort from "../handlers/sort";
import reduce from "../handlers/reduce";
import currency from "../handlers/currency";
import SearchForm from "../components/SearchForm";

export default ({id, budget, dispatch, onRefresh, context}) => {
	const [isOpened, setIsOpened] = useState(() => context);
	const [{response}, doApiFetch] = useApi(`/budget/${budget?._id}`);
	const [items, setItems] = useState(() => budget?.items);
	const [filteredItems, setFilteredItems] = useState(() => items);

	useEffect(() => {
		setItems(budget?.items);
		setFilteredItems(budget?.items);
	}, [budget])

	useEffect(() => {
		if (!response) return;
		if (response?.deletedCount) {
			dispatch({type: SET_HISTORY_BACK});
			dispatch({type: SET_EDITED_ITEM, payload: {item: null}});
			onRefresh();
		}
	}, [response, dispatch, onRefresh]);

	useEffect(() => {
		setIsOpened(context);
	},[context]);

	const toggleContext = () => {
		dispatch({type: SET_TOGGLE_CONTEXT, payload: {context: !isOpened}});
	}

	const alertDelete = (
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
			<h2>Удалить бюджет?</h2>
			<p>Вы действительно хотите удалить бюджет?</p>
		</Alert>
	)

	const itemsList = filteredItems && filteredItems.sort(sort).reduce(reduce, []).map(mapRichCell(dispatch));

	const onSearch = (str) => {
		if (str === '') {
			setFilteredItems(items);
		} else {
			setFilteredItems(budget.items.filter(({title}) => title.toLowerCase().indexOf(str.toLowerCase()) > -1));
		}
	}

	return (
		<Panel id={id}>
			<PanelHeader left={
				<>
					<PanelHeaderBack onClick={() => {
						dispatch({type: SET_HISTORY_BACK});
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
					aside={budget && <Icon16Dropdown style={{transform: `rotate(${isOpened ? '180deg' : '0'})`}}/>}
					onClick={toggleContext}
				>
					{budget ? budget?.title : 'Бюджет удалён'}
				</PanelHeaderContent>
			</PanelHeader>
			{
				budget &&
				<>
					<PanelHeaderContext opened={isOpened} onClose={toggleContext}>
						<List>
							<Cell
								before={<Icon28EditOutline/>}
								onClick={() => {
									dispatch({type: SET_EDITED_ITEM, payload: {item: budget}})
									dispatch({type: SET_MODAL, payload: {modal: 'add-budget'}})
									toggleContext();
								}}
							>
								Изменить бюджет {budget?.title}
							</Cell>
							<Cell
								before={<Icon28DeleteOutline/>}
								onClick={() => {
									dispatch({type: SET_POPOUT, payload: {popout: alertDelete, alert: true}})
								}}
							>
								Удалить бюджет {budget?.title}
							</Cell>
						</List>
					</PanelHeaderContext>
					<SearchForm onSearch={onSearch}/>
					<Group>
						<MiniInfoCell
							before={<Icon20PinOutline/>}
							mode={'base'}
						>
							Первоначальная сумма {currency(budget.startSum)}
						</MiniInfoCell>
						<MiniInfoCell
							before={<Icon20Add/>}
							mode={'base'}
						>
							Добавлено в
							бюджет {currency(budget.items.map(item => item.income ? item.sum : 0).reduce((acc, cur) => acc + cur, 0))}
						</MiniInfoCell>
						<MiniInfoCell
							before={<Icon20BombOutline/>}
							mode={'base'}
						>
							Потрачено {currency(budget.items.map(item => !item.income ? item.sum : 0).reduce((acc, cur) => acc + cur, 0))}
						</MiniInfoCell>
					</Group>
					<Div>
						{itemsList}
						{itemsList?.length === 0 && <Footer>Нет данных для отображения</Footer>}
					</Div>
					<InfoSnackbar/>
				</>
			}
		</Panel>
	)
}