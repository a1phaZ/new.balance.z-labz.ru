import React from 'react';
import PropTypes from 'prop-types';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import {Button, Footer, Header, List, PanelHeaderButton, PullToRefresh, Title} from "@vkontakte/vkui";
import currency from "../handlers/currency";
import ListOfItems from "../components/ListOfItems";
import {SET_ACCOUNT, SET_ACTIVE_VIEW, SET_MODAL} from "../state/actions";
import Icon28MarketAddBadgeOutline from '@vkontakte/icons/dist/28/market_add_badge_outline';
import Icon28ListAddOutline from '@vkontakte/icons/dist/28/list_add_outline';
import InfoSnackbar from "../components/InfoSnackbar";
import MonthSwitch from "../components/MonthSwitch";
import ShopList from "../components/ShopList";

const Home = ({id, accounts, budgets, dispatch, onRefresh, isFetching, shopList}) => {
	const sumOfAll = accounts.map(el => el.sum).reduce((acc, cur) => acc + cur, 0);
	const shopListDone = shopList.reduce((acc, curr) => curr.done ? acc + 1 : acc, 0);
	const shopListButton = (
		<Button
			mode={'tertiary'}
			onClick={() => {
				dispatch({type: SET_ACTIVE_VIEW, payload: {view: 'more', panel: 'shop-list'}})
			}}
		>
			Сформировать список покупок
		</Button>
	)
	return (
		<Panel id={id}>
			<PanelHeader
				left={
					<>
						<PanelHeaderButton
							onClick={() => {
								dispatch({type: SET_MODAL, payload: {modal: 'add-account'}});
							}}
						>
							<Icon28ListAddOutline/>
						</PanelHeaderButton>
						{accounts.length !== 0 && <PanelHeaderButton
							onClick={() => {
								dispatch({type: SET_ACCOUNT, payload: {id: null}});
								dispatch({type: SET_MODAL, payload: {modal: 'add-money'}});
							}}
						>
							<Icon28MarketAddBadgeOutline/>
						</PanelHeaderButton>}
					</>
				}
			>Баланс</PanelHeader>
			<MonthSwitch onRefresh={onRefresh} />
			<PullToRefresh onRefresh={onRefresh} isFetching={isFetching}>
				<List>
					<Group
						header={<Header mode="secondary">Ваши счета</Header>}
						separator="show"
					>
						<Div>
							<Title level="1" weight="semibold" style={{marginBottom: 16}}>{currency(sumOfAll)}</Title>
							<ListOfItems data={accounts} dispatch={dispatch} showAll={false} itemsName={'accounts'}/>
						</Div>
					</Group>
					<Group
						header={<Header mode={'secondary'}>Ваши бюджеты</Header>}
						separator={'show'}
					>
						<Div>
							<ListOfItems data={budgets} dispatch={dispatch} showAll={false} itemsName={'budgets'}/>
						</Div>
					</Group>
					<Group
						header={<Header mode={'secondary'}>Список покупок</Header>}
					>
						<ShopList list={shopList} dispatch={dispatch}/>
						<Footer>
							{
								shopList.length === 0 ?
									<>
										{
											`Ваш список покупок пуст`
										}
										{shopListButton}
									</>:
									`В Вашем списке покупок ${shopList.length} элементов. ${shopListDone} выполнено.`
							}
						</Footer>
					</Group>
				</List>
			</PullToRefresh>
			<InfoSnackbar/>
		</Panel>
	)
};

Home.propTypes = {
	id: PropTypes.string.isRequired,
};

export default Home;
