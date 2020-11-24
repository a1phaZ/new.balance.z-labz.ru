import React from 'react';
import {format} from 'date-fns';
import ruLocale from 'date-fns/locale/ru';
import {Footer, Group, Header, Panel, PanelHeader, PanelHeaderButton} from "@vkontakte/vkui";
import ListOfItems from "../components/ListOfItems";
import {SET_MODAL} from "../state/actions";
import Icon28ListAddOutline from "@vkontakte/icons/dist/28/list_add_outline";
import InfoSnackbar from "../components/InfoSnackbar";
import MonthSwitch from "../components/MonthSwitch";

export default ({id, budgets, dispatch, date = new Date(), onRefresh}) => {
	// let budgetsStartSum = budgets.map(el => el.startSum).reduce((acc, cur) => acc + cur, 0);
	// let incomeBudgetSum = budgets.map(el => el.items).flat().map(item => item.income ? item.sum : 0).reduce((acc, cur) => acc + cur, 0);
	// let outcomeBudgetsSum = budgets.map(el => el.items).flat().map(item => !item.income ? item.sum : 0).reduce((acc, cur) => acc + cur, 0);

	return (
		<Panel id={id}>
			<PanelHeader
				left={
					<PanelHeaderButton onClick={() => dispatch({type: SET_MODAL, payload: {modal: 'add-budget'}})}>
						<Icon28ListAddOutline/>
					</PanelHeaderButton>
				}
			>
				Бюджеты
			</PanelHeader>
			<MonthSwitch onRefresh={onRefresh} />
			<Group
				header={<Header mode="secondary">Ваши бюджеты
					на {format(new Date(date), 'dd MMMM yyyy', {locale: ruLocale})}</Header>}
				// separator="show"
			>
				<ListOfItems data={budgets} dispatch={dispatch} showAll={true} itemsName={'budgets'} needHide={false}/>
				<Footer>Цифры напротив бюджета отображают сколько Вы можете еще потратить, но помните, что могут быть смежные траты, которые относятся к нескольким бюджетам. Проверяйте внимательно.</Footer>
			</Group>
			<InfoSnackbar/>
		</Panel>
	)
}