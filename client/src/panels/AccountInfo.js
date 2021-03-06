import React, {useEffect, useState} from 'react';
import useApi from "../handlers/useApi";
import {
	Alert,
	Cell,
	Div,
	Footer,
	Gallery,
	Header,
	List,
	Panel,
	PanelHeader,
	PanelHeaderButton,
	PanelHeaderContent,
	PanelHeaderContext,
	Title
} from "@vkontakte/vkui";
import currency from "../handlers/currency";
import Group from "@vkontakte/vkui/dist/components/Group/Group";
import {
	SET_ACCOUNTS,
	SET_BUDGETS,
	SET_EDITED_ITEM,
	SET_HISTORY_BACK,
	SET_MODAL,
	SET_POPOUT,
	SET_TOGGLE_CONTEXT
} from "../state/actions";
import Icon28MarketAddBadgeOutline from "@vkontakte/icons/dist/28/market_add_badge_outline";
import Icon16Dropdown from '@vkontakte/icons/dist/16/dropdown';
import Icon28DeleteOutline from '@vkontakte/icons/dist/28/delete_outline';
import Icon28EditOutline from "@vkontakte/icons/dist/28/edit_outline";
import mapRichCell from "../handlers/mapRichCell";
import InfoSnackbar from "../components/InfoSnackbar";
import sort from "../handlers/sort";
import MonthSwitch from "../components/MonthSwitch";
import SearchForm from "../components/SearchForm";
import Icon28MoneyTransfer from "@vkontakte/icons/dist/28/money_transfer";
import {ArrayToObjectWithDate, ObjectToArrayWithDate} from "../handlers/formatingArrayWithDate";
import BackButton from "../components/BackButton";

export default ({id, account, dispatch, onRefresh, context, date, scheme}) => {
	const [isOpened, setIsOpened] = useState(() => context);
	const [{response}, doApiFetch] = useApi(`/money-box/${account?._id}`);
	const [accountContext, setAccountContext] = useState(true);
	const [items, setItems] = useState(() => {
		if (!account) return [];
		return account?.operations;
	});
	const [searchStr, setSearchStr] = useState('');
	const [filteredItems, setFilteredItems] = useState(() => items || []);
	
	const indexAr = ArrayToObjectWithDate(filteredItems);
	
	const accountItemsListArray = ObjectToArrayWithDate(indexAr);
	
	const accountItemsList = accountItemsListArray.sort(sort).map(mapRichCell({dispatch}));
	
	const toggleContext = () => {
		dispatch({type: SET_TOGGLE_CONTEXT, payload: {context: !isOpened}});
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
							method: 'DELETE',
							params: {
								date: date
							}
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
	
	const accountContextView = (
		<PanelHeaderContext opened={isOpened} onClose={toggleContext}>
			<List>
				<Cell
					before={<Icon28EditOutline/>}
					onClick={() => {
						dispatch({type: SET_EDITED_ITEM, payload: {item: account}});
						dispatch({type: SET_MODAL, payload: {modal: 'add-account'}});
						toggleContext();
					}}
				>
					Редактировать счет
				</Cell>
				<Cell
					before={<Icon28DeleteOutline/>}
					onClick={() => {
						dispatch({type: SET_POPOUT, payload: {popout: alert, alert: true}})
					}}
				>
					Удалить счет {account?.title}
				</Cell>
			</List>
		</PanelHeaderContext>
	);
	const itemContextView = (
		<PanelHeaderContext opened={isOpened} onClose={toggleContext}>
			<List>
				<Cell
					before={<Icon28MarketAddBadgeOutline/>}
					onClick={() => {
						dispatch({type: SET_EDITED_ITEM, payload: {item: null}});
						dispatch({type: SET_MODAL, payload: {modal: 'add-money'}});
						toggleContext();
					}}
				>
					Добавить
				</Cell>
				<Cell
					before={<Icon28MoneyTransfer/>}
					onClick={() => {
						dispatch({type: SET_MODAL, payload: {modal: 'transfer-money'}});
						toggleContext();
					}}
				>
					Перевести
				</Cell>
			</List>
		</PanelHeaderContext>
	)
	
	const contextView = accountContext ? accountContextView : itemContextView;
	
	useEffect(() => {
		if (!account) return;
		setItems(account?.operations);
		setFilteredItems(account?.operations);
	}, [account]);
	
	useEffect(() => {
		if (!response) return;
		dispatch({type: SET_POPOUT, payload: {popout: null}});
		dispatch({type: SET_EDITED_ITEM, payload: {item: null}});
		dispatch({type: SET_ACCOUNTS, payload: {accounts: response?.accounts ? response?.accounts : []}});
		dispatch({type: SET_BUDGETS, payload: {budgets: response?.budgets ? response?.budgets : []}});
		dispatch({type: SET_HISTORY_BACK});
	}, [dispatch, response]);
	
	useEffect(() => {
		setIsOpened(context);
	}, [context]);
	
	useEffect(() => {
		if (searchStr === '') {
			setFilteredItems(items);
		} else {
			setFilteredItems(account?.operations.filter(({title}) => title.toLowerCase().indexOf(searchStr.toLowerCase()) > -1));
		}
	}, [searchStr, account, items]);
	
	const onSearch = (str) => {
		setSearchStr(str);
	}
	
	const incomeSum = account?.operations?.filter(item => !!item.income).reduce((acc, cur) => acc + cur.sum, 0);
	const outcomeSum = account?.operations?.filter(item => !item.income).reduce((acc, cur) => acc + cur.sum, 0);
	
	return (
		<Panel id={id}>
			<PanelHeader left={
				<>
					<BackButton dispatch={dispatch}/>
					<PanelHeaderButton
						onClick={() => {
							setAccountContext(false);
							toggleContext();
						}}
					>
						<Icon28MarketAddBadgeOutline/>
					</PanelHeaderButton>
				</>
			}
			>
				<PanelHeaderContent
					aside={account && <Icon16Dropdown style={{transform: `rotate(${isOpened ? '180deg' : '0'})`}}/>}
					onClick={() => {
						setAccountContext(true);
						toggleContext();
					}}
				>
					{account ? account?.title : 'Счет удалён'}
				</PanelHeaderContent>
			</PanelHeader>
			{
				account
				&&
				<>
					{contextView}
					<MonthSwitch onRefresh={onRefresh}/>
					
					<SearchForm onSearch={onSearch}/>
					
					<Group
						header={<Header mode="secondary">Информация по счету</Header>}
						separator="show"
					>
						<Gallery
							slideWidth={'100%'}
							bullets={scheme === 'client_light' || scheme === 'bright_light' ? 'dark' : 'light'}
							style={{height: 'auto'}}
						>
							<Div>
								<Title level={'3'} weight={'semibold'}>Остаток по счету</Title>
								<Title level="1" weight="bold" style={{marginBottom: 16}}>{currency(account?.sum)}</Title>
							
							</Div>
							<Div>
								<Title level="3" weight="semibold" style={{marginBottom: 16}}>Доход: {currency(incomeSum || 0)}</Title>
								<Title level="3" weight="semibold"
											 style={{marginBottom: 16}}>Расход: {currency(-1 * outcomeSum || 0)}</Title>
								<Title level="3" weight="semibold"
											 style={{marginBottom: 16}}>Баланс: {currency(incomeSum - outcomeSum)}</Title>
							</Div>
						</Gallery>
						
						
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