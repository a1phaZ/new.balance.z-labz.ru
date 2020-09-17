import React from 'react';
import PropTypes from 'prop-types';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import {Header, PanelHeaderButton, Title} from "@vkontakte/vkui";
import currency from "../handlers/currency";
import ListOfAccount from "../components/ListOfAccount";
import {SET_MODAL} from "../state/actions";
import Icon28MarketAddBadgeOutline from '@vkontakte/icons/dist/28/market_add_badge_outline';
import Icon28ListAddOutline from '@vkontakte/icons/dist/28/list_add_outline';

const Home = ({id, data, dispatch}) => {
	const sumOfAll = data.map(el => el.sum).reduce((acc, cur) => acc + cur, 0);
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
						{data.length !== 0 && <PanelHeaderButton
							onClick={() => {
								dispatch({type: SET_MODAL, payload: {modal: 'add-money'}});
							}}
						>
							<Icon28MarketAddBadgeOutline/>
						</PanelHeaderButton>}
					</>
				}
			>Balance</PanelHeader>
			<Group
				header={<Header mode="secondary">Ваши счета</Header>}
				separator="show"
			>
				<Div>
					<Title level="1" weight="semibold" style={{marginBottom: 16}}>{currency(sumOfAll)}</Title>
					<ListOfAccount data={data} dispatch={dispatch} showAll={false}/>
				</Div>
			</Group>
		</Panel>
	)
};

Home.propTypes = {
	id: PropTypes.string.isRequired,
};

export default Home;
