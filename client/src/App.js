import React, {useContext, useEffect, useState} from 'react';
import View from '@vkontakte/vkui/dist/components/View/View';
import '@vkontakte/vkui/dist/vkui.css';
import Home from './panels/Home';
import useApi from "./handlers/useApi";
import {State} from './state';
import {SET_ACCOUNT, SET_ACCOUNTS, SET_MODAL} from "./state/actions";
import {
	ANDROID,
	IOS,
	ModalPage,
	ModalPageHeader,
	ModalRoot,
	PanelHeaderButton,
	platform,
	PopoutWrapper,
	Root
} from "@vkontakte/vkui";
import Icon24Cancel from '@vkontakte/icons/dist/24/cancel';
import Icon24Done from '@vkontakte/icons/dist/24/done';
import AddAccount from "./components/modals/AddAccount";
import AddMoney from "./components/modals/AddMoney";
import InfoSnackbar from "./components/InfoSnackbar";
import AccountInfo from "./panels/AccountInfo";

const App = () => {
	const os = platform();
	const [popout] = useState(null);
	const [{response, isLoading}, doApiFetch] = useApi('/money-box');
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
		dispatch({type: SET_ACCOUNTS, payload: {accounts: response}});
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
					Добавить запись
				</ModalPageHeader>
			}>
				<AddMoney accounts={state.accounts} id={state.account?._id} setAccount={setAccount}
									editedItem={state.editedItem}/>
			</ModalPage>
		</ModalRoot>
	)

	return (
		<InfoSnackbar>
			<PopoutWrapper alignY="center" alignX="center">
				<Root activeView={state.activeView} modal={modal} popout={state.popout}>
					<View id={'home'} activePanel={state.activePanel} popout={popout}>
						<Home id='home' data={state.accounts} dispatch={dispatch} isLoading={isLoading}/>
					</View>
					<View id={'info'} activePanel={state.activePanel}>
						<AccountInfo id={'account'} account={state.account} dispatch={dispatch}/>
					</View>
				</Root>
			</PopoutWrapper>
		</InfoSnackbar>
	);
}

export default App;

