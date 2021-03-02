import React, {Component} from 'react';
import {bindActionCreators} from "redux";
import {getData} from "../../store/api/actions";
import {connect} from "react-redux";
import ItemsList from "../ItemsList";
import {Div, Group, Header, PanelSpinner, Title} from "@vkontakte/vkui";
import currency from "../../services/currency";
import {setStory} from "../../store/router/actions";
import {setId} from "../../store/background/actions";

class Accounts extends Component {
	constructor(props) {
		super(props);
		
		this.callApi = this.callApi.bind(this);
		this.sumOfAll = this.sumOfAll.bind(this);
		this.setAccount = this.setAccount.bind(this);
	}
	
	componentDidMount() {
		this.callApi('/accounts');
	}
	
	callApi = (url) => {
		this.props.getData(url);
	}
	
	setAccount = ({type, id}) => {
		this.props.setId({[type]: id});
		this.props.setStory('accounts', 'info');
	}
	
	sumOfAll = (accounts) => {
		return accounts.map(el => el.sum).reduce((acc, cur) => acc + cur, 0);
	}
	
	render() {
		const {accounts, isLoading} = this.props;
		return (
			<Group
				header={<Header mode="secondary">Ваши счета</Header>}
				separator="show"
			>
				<Div>
					{isLoading && <PanelSpinner/>}
					{!isLoading &&
						<>
							<Title level="1" weight="semibold" style={{marginBottom: 16}}>{currency(this.sumOfAll(accounts))}</Title>
							<ItemsList data={accounts} setAccount={this.setAccount}/>
						</>
					}
				</Div>
			</Group>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		accounts: state.api.accounts,
		error: state.api.error,
		isLoading: state.api.isLoading.accounts
	}
}

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
		...bindActionCreators({getData, setId, setStory}, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Accounts);