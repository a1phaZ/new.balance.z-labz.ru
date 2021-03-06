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
	SET_EDITED_ITEM,
	SET_HISTORY_BACK,
	SET_MODAL,
	SET_POPOUT, SET_SUCCESS_MESSAGE
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
import Icon28More from '@vkontakte/icons/dist/28/more';
import AddAccount from "./components/modals/AddAccount";
import AddMoney from "./components/modals/AddMoney";
import AccountInfo from "./panels/AccountInfo";
import Budgets from "./panels/Budgets";
import AddBudget from "./components/modals/AddBudget";
import BudgetInfo from "./panels/BudgetInfo";
import Stats from "./panels/Stats";
import InitialScreen from "./panels/InitialScreen";

import './style.css';
import More from "./panels/More";
import ShopListPanel from "./panels/ShopListPanel";
import useLocalStorage from "./handlers/useLocalStorage";
import AppStats from "./panels/AppStats";
import TransferMoney from "./components/modals/TransferMoney";
import StatsDetails from "./panels/StatsDetails";
import {getTagsListItemsFromAccount} from "./handlers/getTagsListFromAccounts";

const App = () => {
	const os = platform();
	const [{response, isLoading}, doApiFetch] = useApi('/state');
	const [needFetch, setNeedFetch] = useState(true);
	const [state, dispatch] = useContext(State);
	const [lastBackAction, setLastBackAction] = useState(0);
	const [bannerData, setBannerData] = useState(null);
	const [shopListItemTitle, setShopListItemTitle] = useState('');
	const [shopList, setShopList] = useLocalStorage('shopList', []);
	const [shopListId, setShopListId] = useLocalStorage('shop-list-id');
	const [addToHomeScreenSupported, setAddToHomeScreenSupported] = useState(false);
	const [addedToHomeScreen, setAddedToHomeScreen] = useState(false);
	const [selectedTagTitle, setSelectedTagTitle] = useState('');
	const [selectedItemTitle, setSelectedItemTitle] = useState('');
	const [tagsItemsList, setTagsItemsList] = useState([]);
	const [groupedByStats, setGroupedByStats] = useState('title');
	const [itemsFromItemTitle, setItemsFromItemTitle] = useState([]);
	
	const getItemsFromItemTitle = useCallback((accounts) => {
		return accounts.map(({operations}) => operations).flat().filter(({title, income}) => title === selectedItemTitle && !income);
	}, [selectedItemTitle]);
	
	useEffect(() => {
		bridge.subscribe(({detail: {type, data}}) => {
			if (type === 'VKWebAppUpdateConfig') {
				dispatch({type: SET_COLOR_SCHEME, payload: {scheme: data.scheme}})
			}
			if (type === 'VKWebAppGetAdsResult') {
				setBannerData(data);
			}
			if (type === 'VKWebAppAddToHomeScreenInfoResult') {
				setAddToHomeScreenSupported(data.is_feature_supported);
				setAddedToHomeScreen(data.is_added_to_home_screen);
			}
			if (type === 'VKWebAppAddToHomeScreenResult') {
				if (data.result) {
					setAddedToHomeScreen(data.result);
				}
			}
			if (type === 'VKWebAppJoinGroupResult') {
				if (data.result) {
					dispatch({type: SET_SUCCESS_MESSAGE, payload: {message: 'Спасибо, что Вы с нами ❤️'}})
				}
				// console.log(data);
			}
			if (type === 'VKWebAppJoinGroupFailed') {
				// console.log(data);
			}
		});

// Init VK  Mini App
		bridge.send("VKWebAppInit", {});
		// Native ads on Android/IOS
		// bridge.send("VKWebAppShowNativeAds", {ad_format:"preloader"})
		// 	.then(data => console.log(data.result))
		// 	.catch(error => console.log(error));
		bridge.send('VKWebAppGetAds', {});
		bridge.send('VKWebAppAddToHomeScreenInfo');
	}, [dispatch]);
	
	useEffect(() => {
		const tagsListItem = getTagsListItemsFromAccount(state.accounts);
		setTagsItemsList(tagsListItem[selectedTagTitle]);
	}, [state.accounts, selectedTagTitle]);
	
	useEffect(() => {
		if (!selectedItemTitle) return;
		setItemsFromItemTitle(getItemsFromItemTitle(state.accounts));
	}, [selectedItemTitle, state.accounts, getItemsFromItemTitle]);
	
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
					dispatch({type: SET_POPOUT, payload: {popout: alert, alert: true}});
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
		dispatch({type: SET_EDITED_ITEM, payload: {item: null}});
		dispatch({type: SET_MODAL, payload: {modal: null}});
		setShopListItemTitle('');
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
				<AddAccount dispatch={dispatch} editedItem={state.editedItem}/>
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
				          editedItem={state.editedItem} dispatch={dispatch} budget={state.budget}
				          panel={state.activePanel}
				          shopListItemTitle={shopListItemTitle} setShopListItemTitle={setShopListItemTitle}
				          date={state.currentDate}/>
			</ModalPage>
			
			<ModalPage id={'add-budget'} header={
				<ModalPageHeader
					left={os === ANDROID && <PanelHeaderButton onClick={modalBack}><Icon24Cancel/></PanelHeaderButton>}
					right={<PanelHeaderButton onClick={modalBack}>{os === IOS ? 'Закрыть' : null}</PanelHeaderButton>}
				>
					{state.editedItem ? 'Редактировать' : 'Добавить бюджет'}
				</ModalPageHeader>
			}>
				<AddBudget editedItem={state.editedItem} dispatch={dispatch} date={state.currentDate}/>
			</ModalPage>
			<ModalPage id={'transfer-money'} header={
				<ModalPageHeader
					left={os === ANDROID && <PanelHeaderButton onClick={modalBack}><Icon24Cancel/></PanelHeaderButton>}
					right={<PanelHeaderButton onClick={modalBack}>{os === IOS ? 'Закрыть' : null}</PanelHeaderButton>}
				>
					Перевести
				</ModalPageHeader>
			}>
				<TransferMoney accounts={state.accounts} dispatch={dispatch}/>
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
		<Tabbar itemsLayout={'horizontal'}>
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
				selected={state.activeView === 'stats'}
				data-story={'stats'}
				data-panel={'stats'}
				text={'Сводка'}
			>
				<Icon28StatisticsOutline/>
			</TabbarItem>
			<TabbarItem
				onClick={onStoryChange}
				selected={state.activeView === 'more'}
				data-story={'more'}
				data-panel={'index'}
				text={'Ещё'}
			>
				<Icon28More/>
			</TabbarItem>
		</Tabbar>
	)
	
	return (
		<ConfigProvider scheme={state.scheme}>
			<Epic activeStory={state.activeView}
			      tabbar={state.activeView !== 'init' && state.activePanel !== 'init' && tabBar}>
				<View id={'init'} activePanel={state.activePanel}>
					<InitialScreen id={'init'} dispatch={dispatch} loading={state.popout} bannerData={bannerData}
					               setBannerData={setBannerData} shopListId={shopListId}/>
				</View>
				<View id={'home'} activePanel={state.activePanel} popout={state.popout} modal={modal}>
					<Home id='home' accounts={state.accounts} budgets={state.budgets} dispatch={dispatch}
					      isLoading={isLoading} context={state.contextHistory}
					      onRefresh={onRefresh} isFetching={isLoading} shopList={shopList}/>
				</View>
				<View id={'info'} activePanel={state.activePanel} popout={state.popout} modal={modal}>
					<AccountInfo id={'account'} account={state.accounts.find(item => item._id === state.account?._id)}
					             dispatch={dispatch} onRefresh={onRefresh} context={state.contextHistory}
					             date={state.currentDate} scheme={state.scheme}/>
					<Budgets id={'budgets'} budgets={state.budgets} dispatch={dispatch} onRefresh={onRefresh}
					         date={state.currentDate} bannerData={bannerData}
					         setBannerData={setBannerData}/>
					<BudgetInfo id={'budget'} budget={state.budgets.find(item => item._id === state.budget?._id)}
					            dispatch={dispatch} context={state.contextHistory} date={state.currentDate}/>
				</View>
				<View id={'stats'} activePanel={state.activePanel} popout={state.popout} modal={modal}>
					<Stats id={'stats'} accounts={state.accounts} onRefresh={onRefresh} dispatch={dispatch}
					       context={state.contextHistory} setSelectedTagTitle={setSelectedTagTitle}
					       groupedByStats={groupedByStats} setGroupedByStats={setGroupedByStats}
					       setSelectedItemTitle={setSelectedItemTitle}
					/>
					<StatsDetails id={'details-tags'} category={'tags'} itemsList={tagsItemsList} dispatch={dispatch}
					              title={selectedTagTitle} showSearch={true}/>
					<StatsDetails id={'details-items'} category={'items'} itemsList={itemsFromItemTitle}
					              dispatch={dispatch} title={selectedItemTitle} showSearch={false} currentStateDate={state.currentDate}/>
				</View>
				<View id={'more'} activePanel={state.activePanel} popout={state.popout} modal={modal}>
					<More id={'index'} dispatch={dispatch} addToHomeScreenSupported={addToHomeScreenSupported}
					      addedToHomeScreen={addedToHomeScreen} bannerData={bannerData}
					      setBannerData={setBannerData}/>
					<ShopListPanel id={'shop-list'} dispatch={dispatch} shopListFromServer={shopList}
					               setShopListItemTitle={setShopListItemTitle}
					               setShopList={setShopList} context={state.contextHistory}
					               success={state.successMessage} error={state.error} shopListId={shopListId} setShopListId={setShopListId}/>
					<AppStats id={'stats'}/>
				</View>
			</Epic>
		</ConfigProvider>
	);
}

export default App;

