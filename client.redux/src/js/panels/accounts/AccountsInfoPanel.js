import React, {Component} from 'react';
import {bindActionCreators} from "redux";
import {getData, postData} from "../../store/api/actions";
import {connect} from "react-redux";
import {goBack, openModal, setStory} from "../../store/router/actions";
import {Div, Panel, PanelHeader, PanelHeaderBack, PanelHeaderButton, PanelSpinner} from "@vkontakte/vkui";
import accountRichCell from "../../components/Accounts/accountRichCell";
import {ArrayToObjectWithDate, ObjectToArrayWithDate} from "../../services/formatingArrayWithDate";
import Icon28MarketAddBadgeOutline from "@vkontakte/icons/dist/28/market_add_badge_outline";

class AccountsInfoPanel extends Component {
	constructor(props) {
		super(props);
		
		this.callApi = (url) => {
			this.props.getData(url);
		}
		this.getTitle = () => {
			const {isLoading, account} = this.props;
			if (!account || isLoading) {
				return 'Загрузка...'
			}
			return account.title
		}
		this.prepareData = () => {
			const indexAr = ArrayToObjectWithDate(this.props.account.operations);
			
			return ObjectToArrayWithDate(indexAr);
		}
	}
	
	componentDidMount() {
		if (this.props.id) {
			this.callApi(`/accounts/${this.props.accountId}`);
		} else {
			//TODO 404 page
			this.props.setStory('main', 'index');
		}
	}
	
	render() {
		const {id, isLoading, account} = this.props;
		return (
			<Panel id={id}>
				<PanelHeader
					left={
						<>
							<PanelHeaderBack onClick={() => this.props.goBack()}/>
							<PanelHeaderButton
								onClick={() => {
									this.props.openModal("MODAL_ITEM")
								}}
							>
								<Icon28MarketAddBadgeOutline/>
							</PanelHeaderButton>
						</>
					}
				>
					{this.getTitle()}
				</PanelHeader>
				{isLoading && <PanelSpinner/>}
				{!isLoading && account &&
				<Div>
					{this.prepareData().map(accountRichCell({}))}
				</Div>
				}
			</Panel>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		account: state.api.account,
		error: state.api.error,
		isLoading: state.api.isLoading.accounts,
		accountId: state.api.id.account
	}
}

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
		...bindActionCreators({getData, postData, setStory, goBack, openModal}, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountsInfoPanel);