import React, {Component} from 'react';
import {Panel, PanelHeader, PanelHeaderButton} from "@vkontakte/vkui";
import {bindActionCreators} from "redux";
import {setStory} from "../../store/router/actions";
import {connect} from "react-redux";
import {getData} from "../../store/api/actions";
import ItemsList from "../../components/ItemsList";
import Icon28ListAddOutline from '@vkontakte/icons/dist/28/list_add_outline';
import Icon28MarketAddBadgeOutline from '@vkontakte/icons/dist/28/market_add_badge_outline';

class HomePanelIndex extends Component {
	constructor(props) {
		super(props);
		
		this.callApi = this.callApi.bind(this);
	}
	
	componentDidMount() {
		this.callApi('/accounts');
	}
	
	callApi = (url) => {
		this.props.getData(url);
	}
	
	render() {
		const {id, accounts} = this.props;
		return (
			<Panel id={id}>
				<PanelHeader
					left={
						<>
							<PanelHeaderButton
								onClick={() => {
									console.log('Вызываем modal для добавления счета');
								}}
							>
								<Icon28ListAddOutline/>
							</PanelHeaderButton>
							<PanelHeaderButton
								onClick={() => {
									console.log('Вызываем modal для добавления элемента')
								}}
							>
								<Icon28MarketAddBadgeOutline/>
							</PanelHeaderButton>
						</>
					}
				>
					Баланс
				</PanelHeader>
				<ItemsList data={accounts} />
			</Panel>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		accounts: state.api.accounts,
		error: state.api.error
	}
}

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
		...bindActionCreators({setStory, getData}, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePanelIndex);