import React from 'react';
import PropTypes from 'prop-types';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import {Header, List, PanelHeaderButton, PullToRefresh, Title} from "@vkontakte/vkui";
import currency from "../handlers/currency";
import ListOfItems from "../components/ListOfItems";
import {SET_ACCOUNT, SET_MODAL} from "../state/actions";
import Icon28MarketAddBadgeOutline from '@vkontakte/icons/dist/28/market_add_badge_outline';
import Icon28ListAddOutline from '@vkontakte/icons/dist/28/list_add_outline';
import InfoSnackbar from "../components/InfoSnackbar";
import MonthSwitch from "../components/MonthSwitch";

const Home = ({id, accounts, budgets, dispatch, onRefresh, isFetching}) => {
	const sumOfAll = accounts.map(el => el.sum).reduce((acc, cur) => acc + cur, 0);
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
			>Balance</PanelHeader>
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
