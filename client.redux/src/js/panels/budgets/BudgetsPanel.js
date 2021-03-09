import React, {Component} from 'react';
import {connect} from "react-redux";
import {Panel, PanelHeader, PanelHeaderBack, PanelHeaderButton} from "@vkontakte/vkui";
import {bindActionCreators} from "redux";
import {goBack, openModal} from "../../store/router/actions";
import {MODAL_ITEM} from "../../const";
import Icon28MarketAddBadgeOutline from "@vkontakte/icons/dist/28/market_add_badge_outline";
import ItemsList from "../../components/ItemsList";

class BudgetsPanel extends Component{
	constructor(props) {
		super(props);
	}
	
	render() {
		const {id, budgets} = this.props;
		return(
			<Panel id={id}>
				<PanelHeader
					left={
						<>
							<PanelHeaderBack onClick={() => this.props.goBack()}/>
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
					Бюджеты
				</PanelHeader>
				<ItemsList data={budgets}/>
			</Panel>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		budgets: state.api.budgets
	}
}

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
		...bindActionCreators({
				goBack,
				openModal
			},
			dispatch
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(BudgetsPanel);
