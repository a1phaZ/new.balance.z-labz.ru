import React, {Component} from 'react';
import {Button, List, Panel, PanelHeader, PanelHeaderButton} from "@vkontakte/vkui";
import Icon28ListAddOutline from '@vkontakte/icons/dist/28/list_add_outline';
import Icon28MarketAddBadgeOutline from '@vkontakte/icons/dist/28/market_add_badge_outline';
import Accounts from "../../components/Accounts/Accounts";
import Budgets from "../../components/Budgets/BudgetsSummary";
import {closePopout, goBack, openModal, openPopout, setPage} from "../../store/router/actions";
import {connect} from "react-redux";
import {MODAL_ACCOUNT, MODAL_ITEM, MODAL_MONTH_PICKER} from "../../const";
import InfoSnackbar from "../../components/InfoSnackbar";

class HomePanelIndex extends Component {
	
	render() {
		const {id} = this.props;
		return (
			<Panel id={id}>
				<PanelHeader
					left={
						<>
							<PanelHeaderButton
								onClick={() => {
									this.props.openModal(MODAL_ACCOUNT)
								}}
							>
								<Icon28ListAddOutline/>
							</PanelHeaderButton>
							<PanelHeaderButton
								onClick={() => {
									this.props.openModal(MODAL_ITEM)
								}}
							>
								<Icon28MarketAddBadgeOutline/>
							</PanelHeaderButton>
						</>
					}
				>
					Баланс
				</PanelHeader>
				{/*<MonthSwitch />*/}
				<List>
					<Button onClick={() => {this.props.openModal(MODAL_MONTH_PICKER)}} >Open Month</Button>
					<Accounts/>
					<Budgets />
				</List>
				<InfoSnackbar />
			</Panel>
		)
	}
}

const mapDispatchToProps = {
	setPage,
	goBack,
	openPopout,
	closePopout,
	openModal
};

export default connect(null, mapDispatchToProps)(HomePanelIndex);