import React, {useCallback, useContext, useEffect, useState} from 'react';
import View from '@vkontakte/vkui/dist/components/View/View';
import '@vkontakte/vkui/dist/vkui.css';
import Home from './panels/Home';
import useApi from "./handlers/useApi";
import {State} from './state';
import {
	SET_ACCOUNTS,
	SET_ACTIVE_VIEW,
	SET_BUDGETS,
	SET_COLOR_SCHEME,
	SET_HISTORY_BACK,
	SET_MODAL,
	SET_POPOUT
} from "./state/actions";
import {
	Alert,
	ANDROID,
	ConfigProvider,
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
import bridge from "@vkontakte/vk-bridge";
import Icon24Cancel from '@vkontakte/icons/dist/24/cancel';
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
import InitialScreen from "./panels/InitialScreen";

const App = () => {
	const os = platform();
	const [{response, isLoading}, doApiFetch] = useApi('/state');
	const [needFetch, setNeedFetch] = useState(true);
	const [state, dispatch] = useContext(State);
	const [lastBackAction, setLastBackAction] = useState(0);

	useEffect(() => {
		bridge.subscribe(({detail: {type, data}}) => {
			if (type === 'VKWebAppUpdateConfig') {
				// const schemeAttribute = document.createAttribute('scheme');
				// schemeAttribute.value = data.scheme ? data.scheme : 'client_light';
				// console.log(data);
				// document.body.attributes.setNamedItem(schemeAttribute);
				dispatch({type: SET_COLOR_SCHEME, payload: {scheme: data.scheme}})
			}
		});

// Init VK  Mini App
		bridge.send("VKWebAppInit", {});
		// dispatch({type: SET_ACTIVE_VIEW, payload: {view: 'home', panel: 'home'}});
	}, [dispatch]);

	const alert = (
		<Alert
			actions={[
				{
					title: 'Отмена',
					autoclose: true,
					mode: "cancel"
				},
				{
					title: 'Выйти',
					mode: 'destructive',
					autoclose: true,
					action: async () => {
						await bridge.send('VKWebAppClose', {status: 'success'});
					}
				}
			]}
			onClose={() => {
				dispatch({type: SET_POPOUT, payload: {popout: null}})
			}}
		>
			<h2>Выйти из приложения?</h2>
			<p>Вы действительно хотите выйти?</p>
		</Alert>
	)

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
			window.onpopstate = () => {
				let timeNow = +new Date();
				if (state.canClose) {
					dispatch({type: SET_POPOUT, payload: {popout: alert}});
				} else {
					if (timeNow - lastBackAction > 500) {
						setLastBackAction(timeNow);
						dispatch({type: SET_HISTORY_BACK});
					} else {
						window.history.pushState(null, null);
					}
				}
			}
		}, [dispatch, state.history, state.modal, lastBackAction, state.canClose, alert]
	);

	const onRefresh = useCallback(() => {
		setNeedFetch(true);
	}, []);

	const modalBack = (() => {
		dispatch({type: SET_MODAL, payload: {modal: null}});
	})

	const modal = (
		<ModalRoot
			activeModal={state.modal}
			onClose={modalBack}
		>
			<ModalPage id={'add-account'} header={
				<ModalPageHeader
					left={os === ANDROID && <PanelHeaderButton onClick={modalBack}><Icon24Cancel/></PanelHeaderButton>}
					right={<PanelHeaderButton onClick={modalBack}>{os === IOS ? 'Закрыть' : null}</PanelHeaderButton>}
				>
					Добавить счет
				</ModalPageHeader>
			}>
				<AddAccount onRefresh={onRefresh}/>
			</ModalPage>

			<ModalPage id={'add-money'} header={
				<ModalPageHeader
					left={os === ANDROID && <PanelHeaderButton onClick={modalBack}><Icon24Cancel/></PanelHeaderButton>}
					right={<PanelHeaderButton onClick={modalBack}>{os === IOS ? 'Закрыть' : null}</PanelHeaderButton>}
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
					right={<PanelHeaderButton onClick={modalBack}>{os === IOS ? 'Закрыть' : null}</PanelHeaderButton>}
				>
					{state.editedItem ? 'Редактировать' : 'Добавить бюджет'}
				</ModalPageHeader>
			}>
				<AddBudget editedItem={state.editedItem} onRefresh={onRefresh} dispatch={dispatch}/>
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
				selected={state.activeView === 'info' && (state.activePanel === 'budgets' || state.activePanel === 'budget')}
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
		<ConfigProvider scheme={state.scheme}>
			<Epic activeStory={state.activeView} tabbar={state.activeView !== 'init' && state.activePanel !== 'init' && tabBar}>
				<View id={'init'} activePanel={state.activePanel}>
					<InitialScreen id={'init'} dispatch={dispatch} loading={state.popout}/>
				</View>
				<View id={'home'} activePanel={state.activePanel} popout={state.popout} modal={modal}>
					<Home id='home' accounts={state.accounts} budgets={state.budgets} dispatch={dispatch} isLoading={isLoading}
								onRefresh={onRefresh} isFetching={isLoading}/>
				</View>
				<View id={'info'} activePanel={state.activePanel} popout={state.popout} modal={modal}>
					<AccountInfo id={'account'} account={state.accounts.find(item => item._id === state.account?._id)}
											 dispatch={dispatch} onRefresh={onRefresh}/>
					<BudgetInfo id={'budget'} budget={state.budgets.find(item => item._id === state.budget?._id)}
											dispatch={dispatch} onRefresh={onRefresh}/>
					<Budgets id={'budgets'} budgets={state.budgets} dispatch={dispatch} onRefresh={onRefresh}
									 date={state.currentDate}/>
					<Stats id={'stats'} accounts={state.accounts} onRefresh={onRefresh} dispatch={dispatch}/>
				</View>
			</Epic>
		</ConfigProvider>
	);
}

export default App;

