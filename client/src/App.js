import React, {useCallback, useContext, useEffect, useState} from 'react';
import View from '@vkontakte/vkui/dist/components/View/View';
import '@vkontakte/vkui/dist/vkui.css';
import Home from './panels/Home';
import useApi from "./handlers/useApi";
import {State} from './state';
import {SET_ACCOUNT, SET_ACCOUNTS, SET_ACTIVE_VIEW, SET_BUDGETS, SET_MODAL} from "./state/actions";
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
import AddAccount from "./components/modals/AddAccount";
import AddMoney from "./components/modals/AddMoney";
import AccountInfo from "./panels/AccountInfo";
import Budgets from "./panels/Budgets";
import AddBudget from "./components/modals/AddBudget";
import BudgetInfo from "./panels/BudgetInfo";

const App = () => {
	const os = platform();
	const [{response, isLoading}, doApiFetch] = useApi('/state');
	const [needFetch, setNeedFetch] = useState(true);
	const [state, dispatch] = useContext(State);
	const [account, setAccount] = useState(null);

	useEffect(() => {
		if (!needFetch) return;
		doApiFetch();
		setNeedFetch(false);
	}, [needFetch, doApiFetch]);

	useEffect(() => {
		if (!response) return;
		dispatch({type: SET_ACCOUNTS, payload: {accounts: response?.accounts ? response?.accounts : []}});
		dispatch({type: SET_BUDGETS, payload: {budgets: response?.budgets ? response?.budgets : []}});
	}, [response, dispatch]);

	useEffect(() => {
		if (!account) return;
		const isAccountExist = state.accounts.findIndex(item => {
			return item._id === account._id
		});

		if (isAccountExist === -1) {
			const accounts = [...state.accounts, account];
			dispatch({type: SET_ACCOUNTS, payload: {accounts: accounts}});
		} else {
			const accounts = [...state.accounts];
			accounts.splice(isAccountExist, 1, account);
			dispatch({type: SET_ACCOUNTS, payload: {accounts: accounts}});
			if (state.activeView === 'info' && state.activePanel === 'account') {
				dispatch({type: SET_ACCOUNT, payload: {id: account._id}});
			}
		}

		setAccount(null);
	}, [account, dispatch, state.accounts, setAccount, state.activePanel, state.activeView]);

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
				<AddAccount setAccount={setAccount}/>
			</ModalPage>

			<ModalPage id={'add-money'} header={
				<ModalPageHeader
					left={os === ANDROID && <PanelHeaderButton onClick={modalBack}><Icon24Cancel/></PanelHeaderButton>}
					right={<PanelHeaderButton onClick={modalBack}>{os === IOS ? 'Готово' : <Icon24Done/>}</PanelHeaderButton>}
				>
					{state.editedItem ? 'Редактировать' : 'Добавить запись'}
				</ModalPageHeader>
			}>
				<AddMoney accounts={state.accounts} id={state.account?._id} setAccount={setAccount}
									editedItem={state.editedItem}/>
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
		</Tabbar>
	)

	return (
		<Epic activeStory={state.activeView} tabbar={tabBar}>
			<View id={'home'} activePanel={state.activePanel} popout={state.popout} modal={modal}>
				<Home id='home' accounts={state.accounts} budgets={state.budgets} dispatch={dispatch} isLoading={isLoading}
							onRefresh={onRefresh} isFetching={isLoading}/>
			</View>
			<View id={'info'} activePanel={state.activePanel} popout={state.popout} modal={modal}>
				<AccountInfo id={'account'} account={state.account} dispatch={dispatch} onRefresh={onRefresh}/>
				<BudgetInfo id={'budget'} budget={state.budget} dispatch={dispatch} onRefresh={onRefresh}/>
				<Budgets id={'budgets'} budgets={state.budgets} dispatch={dispatch}/>
			</View>
		</Epic>
	);
}

export default App;

