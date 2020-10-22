import React, {useState, useEffect} from 'react';
import {format} from 'date-fns';
import ruLocale from 'date-fns/locale/ru';
import useApi from "../handlers/useApi";
import {
	Alert,
	Cell,
	Div,
	Footer,
	Header, List,
	Panel,
	PanelHeader,
	PanelHeaderBack,
	PanelHeaderButton, PanelHeaderContent, PanelHeaderContext,
	RichCell,
	Title
} from "@vkontakte/vkui";
import currency from "../handlers/currency";
import Group from "@vkontakte/vkui/dist/components/Group/Group";
import {SET_ACTIVE_VIEW, SET_EDITED_ITEM, SET_MODAL, SET_POPOUT} from "../state/actions";
import Icon28MarketAddBadgeOutline from "@vkontakte/icons/dist/28/market_add_badge_outline";
import Icon16Dropdown from '@vkontakte/icons/dist/16/dropdown';
import Icon28Delete from '@vkontakte/icons/dist/28/delete';

export default ({id, account, dispatch, onRefresh}) => {
	const [isOpened, setIsOpened] = useState(false);
	const [{response}, doApiFetch] = useApi(`/money-box/${account?._id}`);
	const accountItemsList = account?.operations.map((item, index) => {
		return (
			<RichCell
				key={index}
				multiline
				caption={format(new Date(item?.date), 'dd MMMM yyyy', {locale: ruLocale})}
				after={item?.income ? currency(item?.sum) : currency(-1 * item?.sum)}
				data-id={item?._id}
				onClick={() => {
					dispatch({type: SET_EDITED_ITEM, payload: {item: item}});
					dispatch({type: SET_MODAL, payload: {modal: 'add-money'}});
				}}
			>
				{item?.title}
			</RichCell>
		)
	});
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
			<h2>Удалить счет?</h2>
			<p>Удаление счета приведет к удалению всех данных по доходам и расходам, привязанным к данному счету. Суммы бюджетов могут отображаться некоректно.</p>
		</Alert>
	)

	useEffect(() => {
		if (!response) return;
		dispatch({type: SET_ACTIVE_VIEW, payload: {view: 'home', panel: 'home'}});
		dispatch({type: SET_EDITED_ITEM, payload: {item: null}});
		onRefresh();
	}, [dispatch, response, onRefresh]);

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
					{account?.title}
				</PanelHeaderContent>
			</PanelHeader>
			<PanelHeaderContext opened={isOpened} onClose={toggleContext}>
				<List>
					<Cell
						before={<Icon28Delete />}
						onClick={() => {dispatch({type: SET_POPOUT, payload: {popout: alert}})}}
					>
						Удалить счет
					</Cell>
				</List>
			</PanelHeaderContext>
			<Group
				header={<Header mode="secondary">Информация по счету</Header>}
				separator="show"
			>
				<Div>
					<Title level="1" weight="semibold" style={{marginBottom: 16}}>{currency(account?.sum)}</Title>
				</Div>
				{account?.operations.length === 0 && <Footer>Операций по счету еще не было</Footer>}
				{accountItemsList}
			</Group>
		</Panel>
	)
}