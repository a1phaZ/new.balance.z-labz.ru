import React, {Component} from 'react';
import {Panel, PanelHeader} from "@vkontakte/vkui";
import {bindActionCreators} from "redux";
import {setStory} from "../../store/router/actions";
import {connect} from "react-redux";
import {getData} from "../../store/api/actions";
import ItemsList from "../../components/ItemsList";

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
		const {id, accounts, error} = this.props;
		console.log(accounts ,error);
		return (
			<Panel id={id}>
				<PanelHeader>Баланс</PanelHeader>
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