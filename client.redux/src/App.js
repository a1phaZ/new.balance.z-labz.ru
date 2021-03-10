import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import {goBack, closeModal, setStory} from "./js/store/router/actions";
import {getActivePanel} from "./js/services/_functions";

import * as VK from './js/services/VK';

import {Epic, View, Root, Tabbar, ModalRoot, TabbarItem, ConfigProvider} from "@vkontakte/vkui";

import Icon28More from '@vkontakte/icons/dist/28/more';
import HomePanelBase from './js/panels/home/base';

import HomePanelGroups from './js/panels/home/groups';
import MorePanelBase from './js/panels/more/base';

import MorePanelExample from './js/panels/more/example';
import HomeBotsListModal from './js/components/modals/HomeBotsListModal';
import HomeBotInfoModal from './js/components/modals/HomeBotInfoModal';
import HomePanelIndex from "./js/panels/home";
import AccountsInfoPanel from "./js/panels/accounts/AccountsInfoPanel";
import AccountModal from "./js/components/modals/AccountModal";
import ItemModal from "./js/components/modals/ItemModal";
import {MODAL_ACCOUNT, MODAL_BUDGET, MODAL_ITEM} from "./js/const";
import {Icon28CoinsOutline, Icon28HomeOutline, Icon28StatisticsOutline} from "@vkontakte/icons";
import BudgetsPanel from "./js/panels/budgets/BudgetsPanel";
import BudgetModal from "./js/components/modals/BudgetModal";

class App extends React.Component {
	constructor(props) {
		super(props);
		
		this.lastAndroidBackAction = 0;
	}
	
	componentDidMount() {
		const {goBack, dispatch} = this.props;
		
		dispatch(VK.initApp());
		
		window.onpopstate = () => {
			let timeNow = +new Date();
			
			if (timeNow - this.lastAndroidBackAction > 500) {
				this.lastAndroidBackAction = timeNow;
				
				goBack();
			} else {
				window.history.pushState(null, null);
			}
		};
		
	}
	
	componentDidUpdate(prevProps, prevState, snapshot) {
		const {activeView, activeStory, activePanel, scrollPosition} = this.props;
		
		if (
			prevProps.activeView !== activeView ||
			prevProps.activePanel !== activePanel ||
			prevProps.activeStory !== activeStory
		) {
			let pageScrollPosition = scrollPosition[activeStory + "_" + activeView + "_" + activePanel] || 0;
			
			window.scroll(0, pageScrollPosition);
		}
	}
	
	render() {
		const {goBack, setStory, closeModal, popouts, activeView, activeStory, activeModals, panelsHistory, colorScheme} = this.props;
		
		let history = (panelsHistory[activeView] === undefined) ? [activeView] : panelsHistory[activeView];
		let popout = (popouts[activeView] === undefined) ? null : popouts[activeView];
		let activeModal = (activeModals[activeView] === undefined) ? null : activeModals[activeView];
		
		const homeModals = (
			<ModalRoot activeModal={activeModal}>
				<HomeBotsListModal
					id="MODAL_PAGE_BOTS_LIST"
					onClose={() => closeModal()}
				/>
				<HomeBotInfoModal
					id="MODAL_PAGE_BOT_INFO"
					onClose={() => closeModal()}
				/>
			</ModalRoot>
		);
		
		const balanceModals = (
			<ModalRoot activeModal={activeModal}>
				<AccountModal
					id={MODAL_ACCOUNT}
					onClose={() => closeModal()}
				/>
				<ItemModal
					id={MODAL_ITEM}
					onClose={() => closeModal()}
				/>
				<BudgetModal
					id={MODAL_BUDGET}
					onClose={() => closeModal()}
				/>
			</ModalRoot>
		)
		
		return (
			<ConfigProvider isWebView={true} scheme={colorScheme}>
				<Epic activeStory={activeStory} tabbar={
					<Tabbar itemsLayout={'horizontal'}>
						<TabbarItem
							onClick={() => setStory('home', 'base')}
							selected={activeStory === 'home'}
							text={'Баланс'}
						>
							<Icon28HomeOutline/>
						</TabbarItem>
						<TabbarItem
							onClick={() => setStory('budgets', 'list')}
							selected={activeStory === 'budgets'}
							text={'Бюджеты'}
						>
							<Icon28CoinsOutline/>
						</TabbarItem>
						<TabbarItem
							onClick={() => setStory('home', 'base')}
							selected={activeStory === 'stats'}
							text={'Сводка'}
						>
							<Icon28StatisticsOutline/>
						</TabbarItem>
						<TabbarItem
							onClick={() => setStory('home', 'base')}
							selected={activeStory === 'more'}
							text={'Ещё'}
						>
							<Icon28More/>
						</TabbarItem>
					</Tabbar>
				}>
					<Root id="home" activeView={activeView} popout={popout}>
						<View
							id="home"
							modal={balanceModals}
							activePanel={getActivePanel("home")}
							history={history}
							onSwipeBack={() => goBack()}
						>
							<HomePanelIndex id={'index'}/>
							<HomePanelBase id="base" withoutEpic={false}/>
							<HomePanelGroups id="groups"/>
						</View>
					</Root>
					<Root id={'accounts'} activeView={activeView} popout={popout}>
						<View
							id={'accounts'}
							modal={balanceModals}
							activePanel={getActivePanel('accounts')}
							history={history}
							onSwipeBack={() => goBack()}
						>
							<AccountsInfoPanel id={'info'}/>
						</View>
					</Root>
					<Root activeView={activeView} id={'budgets'} popout={popout}>
						<View
							id={'budgets'}
							modal={balanceModals}
							activePanel={getActivePanel('budgets')}
							history={history}
							onSwipeBack={() => goBack()}
						>
							<BudgetsPanel id={'list'} />
						</View>
					</Root>
					<Root id="more" activeView={activeView} popout={popout}>
						<View
							id="more"
							modal={homeModals}
							activePanel={getActivePanel("more")}
							history={history}
							onSwipeBack={() => goBack()}
						>
							<MorePanelBase id="callmodal"/>
						</View>
						<View
							id="modal"
							modal={homeModals}
							activePanel={getActivePanel("modal")}
							history={history}
							onSwipeBack={() => goBack()}
						>
							<MorePanelExample id="filters"/>
						</View>
					</Root>
				</Epic>
			</ConfigProvider>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		activeView: state.router.activeView,
		activeStory: state.router.activeStory,
		panelsHistory: state.router.panelsHistory,
		activeModals: state.router.activeModals,
		popouts: state.router.popouts,
		scrollPosition: state.router.scrollPosition,
		
		colorScheme: state.vkui.colorScheme,
	};
};


function mapDispatchToProps(dispatch) {
	return {
		dispatch,
		...bindActionCreators({setStory, goBack, closeModal}, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
