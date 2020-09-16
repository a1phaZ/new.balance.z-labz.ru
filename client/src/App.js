import React, {useContext, useEffect, useState} from 'react';
import View from '@vkontakte/vkui/dist/components/View/View';
import '@vkontakte/vkui/dist/vkui.css';
import Home from './panels/Home';
import useApi from "./handlers/useApi";
import {State} from './state';
import {SET_ACCOUNTS, SET_MODAL} from "./state/actions";
import {
	ANDROID,
	Button,
	FormLayout,
	FormLayoutGroup,
	IOS,
	ModalPage,
	ModalPageHeader,
	ModalRoot,
	PanelHeaderButton,
	platform, Root
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

	useEffect(() => {
		if (!needFetch) return;
		doApiFetch();
		setNeedFetch(false);
	}, [needFetch, doApiFetch]);

	useEffect(() => {
		if (!response) return;
		dispatch({type: SET_ACCOUNTS, payload: {accounts: response}});
	}, [response, dispatch]);

	const modalBack = () => {
		dispatch({type: SET_MODAL, payload: {modal: null}})
	}

	const modal = (
		<ModalRoot
			activeModal={state.modal}
			onClose={modalBack}
		>
			<ModalPage id={'add'} header={
				<ModalPageHeader
					left={os === ANDROID && <PanelHeaderButton onClick={modalBack}><Icon24Cancel/></PanelHeaderButton>}
					right={<PanelHeaderButton onClick={modalBack}>{os === IOS ? 'Готово' : <Icon24Done/>}</PanelHeaderButton>}
				>
					Добавить
				</ModalPageHeader>
			}>
				<FormLayout>
					<FormLayoutGroup>
						<Button onClick={() => {
							dispatch({type: SET_MODAL, payload: {modal: 'add-account'}});
						}} size={'xl'}>Добавить карту(наличные)</Button>
						{state.accounts.length !== 0 &&
						<Button
							onClick={() => {
								dispatch({type: SET_MODAL, payload: {modal: 'add-money'}});
							}}
							size={'xl'}
						>
							Добавить расход(доход)
						</Button>
						}
					</FormLayoutGroup>
				</FormLayout>
			</ModalPage>

			<ModalPage id={'add-account'} header={
				<ModalPageHeader
					left={os === ANDROID && <PanelHeaderButton onClick={modalBack}><Icon24Cancel/></PanelHeaderButton>}
					right={<PanelHeaderButton onClick={modalBack}>{os === IOS ? 'Готово' : <Icon24Done/>}</PanelHeaderButton>}
				>
					Добавить
				</ModalPageHeader>
			}>
				<AddAccount close={modalBack}/>
			</ModalPage>

			<ModalPage id={'add-money'} header={
				<ModalPageHeader
					left={os === ANDROID && <PanelHeaderButton onClick={modalBack}><Icon24Cancel/></PanelHeaderButton>}
					right={<PanelHeaderButton onClick={modalBack}>{os === IOS ? 'Готово' : <Icon24Done/>}</PanelHeaderButton>}
				>
					Добавить
				</ModalPageHeader>
			}>
				<AddMoney accounts={state.accounts}/>
			</ModalPage>
		</ModalRoot>
	)

	return (
		<InfoSnackbar>
			<Root activeView={state.activeView}>
				<View id={'home'} activePanel={state.activePanel} popout={popout} modal={modal}>
					<Home id='home' data={state.accounts} dispatch={dispatch} isLoading={isLoading}/>
				</View>
				<View id={'info'} activePanel={state.activePanel}>
					<AccountInfo id={'account'} account={state.account} dispatch={dispatch} />
				</View>
			</Root>
		</InfoSnackbar>
	);
}

export default App;

