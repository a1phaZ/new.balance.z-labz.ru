import React, {useEffect, useState} from 'react';
import {
	Alert,
	Cell,
	Div, Footer,
	List,
	Panel,
	PanelHeader,
	PanelHeaderBack,
	PanelHeaderButton,
	PanelHeaderContent,
	PanelHeaderContext,
	Search
} from "@vkontakte/vkui";
import {SET_ACTIVE_VIEW, SET_BUDGET, SET_EDITED_ITEM, SET_HISTORY_BACK, SET_MODAL, SET_POPOUT} from "../state/actions";
import Icon28MarketAddBadgeOutline from "@vkontakte/icons/dist/28/market_add_badge_outline";
import useApi from "../handlers/useApi";
import Icon16Dropdown from "@vkontakte/icons/dist/16/dropdown";
import Icon28DeleteOutline from '@vkontakte/icons/dist/28/delete_outline';
import Icon28EditOutline from '@vkontakte/icons/dist/28/edit_outline';
import mapRichCell from "../handlers/mapRichCell";
import InfoSnackbar from "../components/InfoSnackbar";
import sort from "../handlers/sort";
import reduce from "../handlers/reduce";

export default ({id, budget, dispatch, onRefresh}) => {
	const [isOpened, setIsOpened] = useState(false);
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
			dispatch({type: SET_ACTIVE_VIEW, payload: {view: 'home', panel: 'home'}});
			dispatch({type: SET_EDITED_ITEM, payload: {item: null}});
			onRefresh();
		}
	}, [response, dispatch, onRefresh]);

	const toggleContext = () => {
		setIsOpened(!isOpened);
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
						// dispatch({type: SET_ACTIVE_VIEW, payload: {view: 'home', panel: 'home'}});
						dispatch({type: SET_HISTORY_BACK});
						dispatch({type: SET_EDITED_ITEM, payload: {item: null}});
						dispatch({type: SET_BUDGET, payload: {id: null}});
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
									dispatch({type: SET_MODAL, payload: {modal: 'add-budget'}})
									toggleContext();
								}}
							>
								Изменить бюджет {budget?.title}
							</Cell>
							<Cell
								before={<Icon28DeleteOutline/>}
								onClick={() => {
									dispatch({type: SET_POPOUT, payload: {popout: alertDelete}})
								}}
							>
								Удалить бюджет {budget?.title}
							</Cell>
						</List>
					</PanelHeaderContext>
					<Search onChange={(e) => {
						onSearch(e.currentTarget.value)
					}}/>
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