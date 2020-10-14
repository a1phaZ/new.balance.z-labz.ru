import React from 'react';
import {Panel, PanelHeader} from "@vkontakte/vkui";
import ListOfItems from "../components/ListOfItems";

export default ({id, budgets, dispatch}) => {
	return (
		<Panel id={id}>
			<PanelHeader>Budgets</PanelHeader>
			<ListOfItems data={budgets} dispatch={dispatch} showAll={true} itemsName={'budgets'}/>

		</Panel>
	)
}