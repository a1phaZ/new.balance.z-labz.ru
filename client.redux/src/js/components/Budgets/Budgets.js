import React, {Component} from 'react';
import {bindActionCreators} from "redux";
import {getData} from "../../store/api/actions";
import {connect} from "react-redux";
import ItemsList from "../ItemsList";
import {Div, Group, Header, PanelSpinner} from "@vkontakte/vkui";

class Budgets extends Component {
	constructor(props) {
		super(props);
		
		this.callApi = this.callApi.bind(this);
		this.sumOfAll = this.sumOfAll.bind(this);
	}
	
	componentDidMount() {
		this.callApi('/budgets');
	}
	
	callApi = (url) => {
		this.props.getData(url);
	}
	
	sumOfAll = (budgets) => {
		return budgets.map(el => el.sum).reduce((acc, cur) => acc + cur, 0);
	}
	
	render() {
		const {budgets, isLoading} = this.props;
		return (
			<Group
				header={<Header mode="secondary">Ваши бюджеты</Header>}
				separator="show"
			>
				<Div>
					{isLoading && <PanelSpinner/>}
					{!isLoading && <ItemsList data={budgets}/>}
				</Div>
			</Group>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		budgets: state.api.budgets,
		error: state.api.error,
		isLoading: state.api.isLoading.budgets
	}
}

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
		...bindActionCreators({getData}, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Budgets);