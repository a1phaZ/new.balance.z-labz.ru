import React, {useCallback, useContext, useEffect, useState} from 'react';
import View from '@vkontakte/vkui/dist/components/View/View';
import '@vkontakte/vkui/dist/vkui.css';
import Home from './panels/Home';
import useApi from "./handlers/useApi";
import {State} from './state';
import {SET_ACCOUNTS, SET_ACTIVE_VIEW, SET_BUDGETS, SET_HISTORY_BACK, SET_MODAL} from "./state/actions";
import {
	ANDROID,
	Epic,
	IOS,
	ModalPage,
	ModalPageHeader,
	ModalRoot,
	PanelHeaderButton,
	platform,
	Tabbar,
	TabbarItem
} from "@vkontakte/vkui";
import Icon24Cancel from '@vkontakte/icons/dist/24/cancel';
import Icon24Done from '@vkontakte/icons/dist/24/done';
import Icon28HomeOutline from '@vkontakte/icons/dist/28/home_outline';
import Icon28CoinsOutline from '@vkontakte/icons/dist/28/coins_outline';
import Icon28StatisticsOutline from '@vkontakte/icons/dist/28/statistics_outline';
import AddAccount from "./components/modals/AddAccount";
import AddMoney from "./components/modals/AddMoney";
import AccountInfo from "./panels/AccountInfo";
import Budgets from "./panels/Budgets";
import AddBudget from "./components/modals/AddBudget";
import BudgetInfo from "./panels/BudgetInfo";
import Stats from "./panels/Stats";

const App = () => {
	const os = platform();
	const [{response, isLoading}, doApiFetch] = useApi('/state');
	const [needFetch, setNeedFetch] = useState(true);
	const [state, dispatch] = useContext(State);

	useEffect(() => {
		if (!needFetch) return;
		doApiFetch({
			params: {
				date: new Date(state.currentDate)
			}
		});
		setNeedFetch(false);
	}, [needFetch, doApiFetch, state.currentDate]);

	useEffect(() => {
		if (!response) return;
		dispatch({type: SET_ACCOUNTS, payload: {accounts: response?.accounts ? response?.accounts : []}});
		dispatch({type: SET_BUDGETS, payload: {budgets: response?.budgets ? response?.budgets : []}});
	}, [response, dispatch]);

	useEffect(() => {
		window.onpopstate = (e) => {
			if (state.history.length !== 0) {
				return dispatch({type: SET_HISTORY_BACK, payload: {state: e.state}});
			}
		}
	}, [dispatch, state.history]);

	const onRefresh = useCallback(() => {
		setNeedFetch(true);
	}, []);

	const modalBack = () => {
		dispatch({type: SET_MODAL, payload: {modal: null}});
	}

	const modal = (
		<ModalRoot
			activeModal={state.modal}
			onClose={modalBack}
		>
			<ModalPage id={'add-account'} header={
				<ModalPageHeader
					left={os === ANDROID && <PanelHeaderButton onClick={modalBack}><Icon24Cancel/></PanelHeaderButton>}
					right={<PanelHeaderButton onClick={modalBack}>{os === IOS ? 'Готово' : <Icon24Done/>}</PanelHeaderButton>}
				>
					Добавить счет
				</ModalPageHeader>
			}>
				<AddAccount onRefresh={onRefresh}/>
			</ModalPage>

			<ModalPage id={'add-money'} header={
				<ModalPageHeader
					left={os === ANDROID && <PanelHeaderButton onClick={modalBack}><Icon24Cancel/></PanelHeaderButton>}
					right={<PanelHeaderButton onClick={modalBack}>{os === IOS ? 'Готово' : <Icon24Done/>}</PanelHeaderButton>}
				>
					{state.editedItem ? 'Редактировать' : 'Добавить запись'}
				</ModalPageHeader>
			}>
				<AddMoney accounts={state.accounts} id={state.account?._id}
									editedItem={state.editedItem} onRefresh={onRefresh}/>
			</ModalPage>

			<ModalPage id={'add-budget'} header={
				<ModalPageHeader
					left={os === ANDROID && <PanelHeaderButton onClick={modalBack}><Icon24Cancel/></PanelHeaderButton>}
					right={<PanelHeaderButton onClick={modalBack}>{os === IOS ? 'Готово' : <Icon24Done/>}</PanelHeaderButton>}
				>
					Добавить бюджет
				</ModalPageHeader>
			}>
				<AddBudget editedItem={state.budget} onRefresh={onRefresh} dispatch={dispatch}/>
			</ModalPage>
		</ModalRoot>
	)

	const onStoryChange = (e) => {
		dispatch({
			type: SET_ACTIVE_VIEW,
			payload: {view: e.currentTarget.dataset.story, panel: e.currentTarget.dataset.panel}
		})
	}

	const tabBar = (
		<Tabbar>
			<TabbarItem
				onClick={onStoryChange}
				selected={state.activeView === 'home'}
				data-story={'home'}
				data-panel={'home'}
				text={'Баланс'}
			>
				<Icon28HomeOutline/>
			</TabbarItem>
			<TabbarItem
				onClick={onStoryChange}
				selected={state.activeView === 'info' && state.activePanel === 'budgets'}
				data-story={'info'}
				data-panel={'budgets'}
				text={'Бюджеты'}
			>
				<Icon28CoinsOutline/>
			</TabbarItem>
			<TabbarItem
				onClick={onStoryChange}
				selected={state.activeView === 'info' && state.activePanel === 'stats'}
				data-story={'info'}
				data-panel={'stats'}
				text={'Сводка'}
			>
				<Icon28StatisticsOutline/>
			</TabbarItem>
		</Tabbar>
	)

	return (
		<Epic activeStory={state.activeView} tabbar={tabBar}>
			<View id={'home'} activePanel={state.activePanel} popout={state.popout} modal={modal}>
				<Home id='home' accounts={state.accounts} budgets={state.budgets} dispatch={dispatch} isLoading={isLoading}
							onRefresh={onRefresh} isFetching={isLoading}/>
			</View>
			<View id={'info'} activePanel={state.activePanel} popout={state.popout} modal={modal}>
				<AccountInfo id={'account'} account={state.accounts.find(item => item._id === state.account?._id)}
										 dispatch={dispatch} onRefresh={onRefresh}/>
				<BudgetInfo id={'budget'} budget={state.budgets.find(item => item._id === state.budget?._id)}
										dispatch={dispatch} onRefresh={onRefresh}/>
				<Budgets id={'budgets'} budgets={state.budgets} dispatch={dispatch} onRefresh={onRefresh} date={state.currentDate}/>
				<Stats id={'stats'} accounts={state.accounts} onRefresh={onRefresh} dispatch={dispatch}/>
			</View>
		</Epic>
	);
}

export default App;

