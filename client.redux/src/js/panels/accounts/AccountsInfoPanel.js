import React, {Component} from 'react';
import {bindActionCreators} from "redux";
import {deleteData, getData, postData} from "../../store/api/actions";
import {connect} from "react-redux";
import {closePopout, goBack, openModal, openPopout, setStory} from "../../store/router/actions";
import {
	Alert,
	Cell,
	Div,
	List,
	Panel,
	PanelHeader,
	PanelHeaderBack,
	PanelHeaderButton,
	PanelHeaderContent,
	PanelHeaderContext,
	PanelSpinner
} from "@vkontakte/vkui";
import accountRichCell from "../../components/Accounts/accountRichCell";
import {ArrayToObjectWithDate, ObjectToArrayWithDate} from "../../services/formatingArrayWithDate";
import Icon28MarketAddBadgeOutline from "@vkontakte/icons/dist/28/market_add_badge_outline";
import {onSearch, setId} from "../../store/background/actions";
import {Icon16Dropdown, Icon28DeleteOutline, Icon28EditOutline} from "@vkontakte/icons";
import {MODAL_ACCOUNT, MODAL_ITEM} from "../../const";
import AccountSummary from "../../components/Accounts/AccountSummary";
import SearchForm from "../../components/SearchForm";

class AccountsInfoPanel extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			context: {
				isOpened: false
			},
			operations: []
		}
		
		this.callApi = async (url) => {
			this.props.getData(url);
		}
		this.getTitle = () => {
			const {isLoading, account} = this.props;
			if (!account || isLoading) {
				return 'Загрузка...'
			}
			return account.title
		}
		this.getOperationBySearch = ({str, operations}) => {
			const filteredOperations = operations.filter(({title}) => title.toLowerCase().indexOf(str.toLowerCase()) > -1)
			this.setState({operations: filteredOperations});
		}
		
		this.prepareData = () => {
			const indexAr = ArrayToObjectWithDate(this.state.operations);
			
			return ObjectToArrayWithDate(indexAr);
		}
		
		this.setItem = this.setItem.bind(this);
		this.getHeaderContent = this.getHeaderContent.bind(this);
		this.toggleContext = this.toggleContext.bind(this);
		this.getHeaderContext = this.getHeaderContext.bind(this);
		this.deleteAccount = this.deleteAccount.bind(this);
		this.onSearch = this.onSearch.bind(this);
	}
	
	toggleContext = () => {
		this.setState({context: {isOpened: !this.state.context.isOpened}});
	}
	
	setItem = ({type, id}) => {
		this.props.setId({[type]: id});
		this.props.openModal(MODAL_ITEM);
	}
	
	deleteAccount = ({accountId = null}) => {
		if (!accountId) return;
		const url = `/accounts/${accountId}`;
		this.props.deleteData(url);
	}
	
	openPopout() {
		this.props.openPopout(
			<Alert
				actions={[
					{
						title: 'Отмена',
						autoclose: true,
						mode: "cancel"
					},
					{
						title: 'Удалить',
						mode: 'destructive',
						autoclose: true,
						action: async () => {
							this.deleteAccount({accountId: this.props.accountId});
							this.props.goBack();
						}
					}
				]}
				onClose={() => {
					this.props.closePopout();
				}}
			>
				<h2>Удалить счет?</h2>
				<p>Удаление счета приведет к удалению всех данных по доходам и расходам, привязанным к данному счету. Суммы
					бюджетов могут отображаться некорректно.</p>
			</Alert>
		)
	}
	
	getHeaderContent = ({accountId = null, toggleContext = () => {}, isOpened = false}) => {
		return (
			<PanelHeaderContent
				aside={accountId && <Icon16Dropdown style={{transform: `rotate(${isOpened ? '180deg' : '0'})`}}/>}
				onClick={toggleContext}
			>
				{this.getTitle()}
			</PanelHeaderContent>
		)
	}
	getHeaderContext = ({isOpened = false, toggleContext = () => {}, account = null, openModal = () => {}}) => {
		const title = account ? account.title : '';
		return (
			<PanelHeaderContext opened={isOpened} onClose={toggleContext}>
				<List>
					<Cell
						before={<Icon28EditOutline/>}
						onClick={() => {
							openModal(MODAL_ACCOUNT)
							toggleContext();
						}}
					>
						Редактировать счет
					</Cell>
					<Cell
						before={<Icon28DeleteOutline/>}
						onClick={() => {
							this.openPopout();
							toggleContext();
						}}
					>
						Удалить счет {title}
					</Cell>
				</List>
			</PanelHeaderContext>
		)
	}
	
	componentDidMount() {
		if (this.props.id) {
			this.callApi(`/accounts/${this.props.accountId}`);
		} else {
			//TODO 404 page
			this.props.setStory('main', 'index');
		}
		
	}
	//
	// componentDidUpdate(prevProps, prevState, snapshot) {
	// 	const str = this.props.search[this.props.accountId];
	// 	this.getOperationBySearch({str, operations: this.props.account.operations});
	// }
	
	onSearch = (str) => {
		this.props.onSearch({[this.props.accountId]: str});
		this.getOperationBySearch({str, operations: this.props.account.operations});
	}
	
	componentDidUpdate(prevProps, prevState, snapshot) {
		const {account} = this.props;
		if (account && account !== prevProps.account) {
			this.setState({operations: account.operations});
		}
	}
	
	// componentWillUnmount() {
	// 	this.props.setId({account: null});
	// }
	
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
									this.props.openModal(MODAL_ITEM)
								}}
							>
								<Icon28MarketAddBadgeOutline/>
							</PanelHeaderButton>
						</>
					}
				>
					{this.getHeaderContent({
						accountId: this.props.accountId,
						toggleContext: this.toggleContext,
						isOpened: this.state.context.isOpened
					})}
				</PanelHeader>
				{this.getHeaderContext({
					toggleContext: this.toggleContext,
					isOpened: this.state.context.isOpened,
					account: account || null,
					openModal: this.props.openModal
				})}
				{isLoading && <PanelSpinner/>}
				{!isLoading && account &&
				<>
					<SearchForm onSearch={this.onSearch} initialString={this.props.search[this.props.accountId]}/>
					<AccountSummary account={account}/>
					<Div>
						{this.prepareData().map(accountRichCell({setId: this.setItem}))}
					</Div>
				</>
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
		accountId: state.background.id.account,
		itemId: state.background.id.item,
		search: state.background.search
	}
}

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
		...bindActionCreators({
			getData,
			postData,
			deleteData,
			setStory,
			goBack,
			openModal,
			setId,
			openPopout,
			closePopout,
			onSearch
		}, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountsInfoPanel);