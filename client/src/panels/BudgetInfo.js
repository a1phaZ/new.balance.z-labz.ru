import React, {useEffect, useState} from 'react';
import {
	Alert,
	Cell,
	List,
	Panel,
	PanelHeader,
	PanelHeaderBack,
	PanelHeaderButton,
	PanelHeaderContent,
	PanelHeaderContext,
	Search
} from "@vkontakte/vkui";
import {SET_ACTIVE_VIEW, SET_EDITED_ITEM, SET_MODAL, SET_POPOUT} from "../state/actions";
import Icon28MarketAddBadgeOutline from "@vkontakte/icons/dist/28/market_add_badge_outline";
import useApi from "../handlers/useApi";
import Icon16Dropdown from "@vkontakte/icons/dist/16/dropdown";
import Icon28Delete from "@vkontakte/icons/dist/28/delete";
import mapRichCell from "../handlers/mapRichCell";

export default ({id, budget, dispatch}) => {
	const [isOpened, setIsOpened] = useState(false);
	const [{response}, doApiFetch] = useApi(`/budget/${budget._id}`);
	const [needFetch, setNeedFetch] = useState(true);
	const [filteredItems, setFilteredItems] = useState([]);

	useEffect(() => {
		if (!needFetch) return;
		doApiFetch({
			method: 'GET'
		});
		setNeedFetch(false);
	}, [doApiFetch, needFetch])

	useEffect(() => {
		if (!response) return;
		setFilteredItems(response);
	}, [response]);

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

	const itemsList = filteredItems.map(mapRichCell(dispatch));

	const onSearch = (str) => {
		setFilteredItems(response.filter(({title}) => title.toLowerCase().indexOf(str) > -1));
	}

	return (
		<Panel id={id}>
			<PanelHeader left={
				<>
					<PanelHeaderBack onClick={() => {
						dispatch({type: SET_ACTIVE_VIEW, payload: {view: 'home', panel: 'home'}});
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
					aside={<Icon16Dropdown style={{ transform: `rotate(${isOpened ? '180deg' : '0'})` }} />}
					onClick={toggleContext}
				>
					{budget?.title}
				</PanelHeaderContent>
			</PanelHeader>
			<PanelHeaderContext opened={isOpened} onClose={toggleContext}>
				<List>
					<Cell
						before={<Icon28Delete />}
						onClick={() => {dispatch({type: SET_POPOUT, payload: {popout: alert}})}}
					>
						Удалить бюджет {budget?.title}
					</Cell>
				</List>
			</PanelHeaderContext>
			<Search onChange={(e) => {onSearch(e.currentTarget.value)}}/>
			{itemsList}
		</Panel>
	)
}