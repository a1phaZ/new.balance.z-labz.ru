import React, {Component} from 'react';
import {connect} from "react-redux";
import {Panel, PanelHeader, PanelHeaderBack, PanelHeaderButton} from "@vkontakte/vkui";
import {bindActionCreators} from "redux";
import {goBack, openModal, setStory} from "../../store/router/actions";
import {MODAL_BUDGET} from "../../const";
import Icon28MarketAddBadgeOutline from "@vkontakte/icons/dist/28/market_add_badge_outline";
import ItemsList from "../../components/ItemsList";
import {setId} from "../../store/background/actions";

class BudgetsPanel extends Component{
	constructor(props) {
		super(props);
		this.setBudget = this.setBudget.bind(this);
	}
	
	setBudget = ({type, id}) => {
		this.props.setId({[type]: id});
		this.props.setStory('budgets', 'info');
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
									this.props.openModal(MODAL_BUDGET);
								}}
							>
								<Icon28MarketAddBadgeOutline/>
							</PanelHeaderButton>
						</>
					}
				>
					Бюджеты
				</PanelHeader>
				<ItemsList data={budgets} type={'budget'} setId={this.setBudget}/>
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
				openModal,
				setId,
				setStory
			},
			dispatch
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(BudgetsPanel);
