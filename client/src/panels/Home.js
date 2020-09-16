import React from 'react';
import PropTypes from 'prop-types';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import {Header, PanelHeaderButton, PanelSpinner, Title} from "@vkontakte/vkui";
import currency from "../handlers/currency";
import ListOfAccount from "../components/ListOfAccount";
import Icon28AddOutline from '@vkontakte/icons/dist/28/add_outline';
import {SET_MODAL} from "../state/actions";

const Home = ({id, data, dispatch, isLoading}) => {
	const sumOfAll = data.map(el => el.sum).reduce((acc, cur) => acc + cur, 0);
	return (
		<Panel id={id}>
			<PanelHeader
				left={
					<PanelHeaderButton
						onClick={() => {
							if (data.length !== 0){
								dispatch({type: SET_MODAL, payload: {modal: 'add'}});
							} else {
								dispatch({type: SET_MODAL, payload: {modal: 'add-account'}});
							}
						}}
					>
						<Icon28AddOutline/>
					</PanelHeaderButton>
				}
			>Example</PanelHeader>
			<Group
				header={<Header mode="secondary">Ваши счета</Header>}
				separator="show"
			>
				<Div>
					<Title level="1" weight="semibold" style={{marginBottom: 16}}>{!isLoading ? currency(sumOfAll) : <PanelSpinner />}</Title>
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