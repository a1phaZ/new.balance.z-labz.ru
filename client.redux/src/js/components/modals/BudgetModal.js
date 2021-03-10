import React, {Component} from 'react';
import {
	Button,
	FormLayout,
	Input,
	IOS,
	ModalPage,
	ModalPageHeader,
	PanelHeaderButton,
	withPlatform
} from "@vkontakte/vkui";
import Icon24Cancel from "@vkontakte/icons/dist/24/cancel";
import {Icon28ClearDataOutline} from "@vkontakte/icons";
import Icon24Dismiss from "@vkontakte/icons/dist/24/dismiss";
import regexp from "../../services/regexp";
import validate from "../../services/validate";
import {bindActionCreators} from "redux";
import {postData, updateData} from "../../store/api/actions";
import {setFormData} from "../../store/formData/actions";
import {closeModal} from "../../store/router/actions";
import {setId} from "../../store/background/actions";
import {connect} from "react-redux";
import currency from "../../services/currency";

class BudgetModal extends Component{
	constructor(props) {
		super(props);
		
		let defaultInputData = {
			title: '',
			startSum: '',
			validate: {
				title: {
					status: '',
					message: ''
				},
				startSum: {
					status: '',
					message: ''
				}
			}
		}
		
		this.state = {
			inputData:
				this.getBudgetByIdFromState({budgetId: this.props.budgetId, budget: this.props.budget}) ||
				props.inputData[this.props.budgetId ? `budget_${this.props.budgetId}` : 'budget_form'] ||
				defaultInputData
		};
		
		this.handleInput = (e) => {
			let value = e.currentTarget.value;
			let fieldStatus = {};
			if (e.currentTarget.type === 'text') {
				value = regexp(value);
			}
			
			if (e.currentTarget.type === 'number') {
				value = value.replace(/[^\d.]*/, '');
			}
			
			if (e.currentTarget.type === 'checkbox') {
				
				value = e.currentTarget.checked;
			} else {
				fieldStatus = validate(e)
			}
			
			this.setState({
				inputData: {
					...this.state.inputData,
					[e.currentTarget.name]: value,
					validate: {...this.state.inputData.validate, [e.currentTarget.name]: fieldStatus}
				}
			})
		};
		
		this.clearForm = () => {
			this.setState({
				inputData: defaultInputData
			});
		};
		
		this.handleSubmit = this.handleSubmit.bind(this);
		this.getBudgetByIdFromState = this.getBudgetByIdFromState.bind(this);
	}
	
	handleSubmit = (e) => {
		e.preventDefault();
		if (!this.props.accountId) {
			this.props.postData('/budgets', {title: this.state.inputData.title, sum: this.state.inputData.startSum});
		} else {
			this.props.updateData(`/budgets/${this.props.budget}`, {title: this.state.inputData.title, sum: this.state.inputData.startSum});
		}
		this.props.closeModal();
		this.clearForm();
	}
	
	getBudgetByIdFromState = ({budgetId, budget}) => {
		if (!budget || !budgetId) {
			return null;
		}
		
		const validate = {
			title: {
				status: '',
				message: ''
			},
			startSum: {
				status: '',
				message: ''
			}
		}
		return {...budget, validate}
	}
	
	componentWillUnmount() {
		this.props.setFormData(this.props.budgetId ? `account_${this.props.budgetId}` : 'account_form', this.state.inputData);
		this.props.setId({budget: null});
	}
	
	render() {
		const {id, onClose, platform} = this.props;
		return (
			<ModalPage
				id={id}
				header={
					<ModalPageHeader
						left={platform !== IOS ?
							<PanelHeaderButton onClick={onClose}><Icon24Cancel/></PanelHeaderButton> :
							<PanelHeaderButton onClick={this.clearForm}><Icon28ClearDataOutline/></PanelHeaderButton>}
						right={platform === IOS ?
							<PanelHeaderButton onClick={onClose}><Icon24Dismiss/></PanelHeaderButton> :
							<PanelHeaderButton onClick={this.clearForm}><Icon28ClearDataOutline/></PanelHeaderButton>}
					>
						Добавить бюджет
					</ModalPageHeader>
				}
				onClose={onClose}
				settlingHeight={80}
			>
				<FormLayout
					onSubmit={this.handleSubmit}
				>
					<Input type={'text'} placeholder={'Название бюджета'} top={'Название'} value={this.state.inputData.title}
								 name={'title'}
								 required={true}
								 maxLength={'20'}
								 status={this.state.inputData.validate.title.status}
								 bottom={this.state.inputData.validate.title.message ? this.state.inputData.validate.title.message : `${this.state.inputData.validate.title.length} из 20`}
								 onChange={this.handleInput}/>
					<Input type={'number'} placeholder={currency(0)} top={'Бюджет в рублях'} value={this.state.inputData.startSum}
								 name={'startSum'}
								 pattern={'[0-9]+([,\\.][0-9]+)?'}
								 inputMode="decimal"
								 required={true}
								 status={this.state.inputData.validate.startSum.status}
								 min={0}
								 max={999999999}
								 step={0.01}
								 bottom={this.state.inputData.validate.startSum.message ? this.state.inputData.validate.startSum.message : 'Сколько вы готовы на это потратить?'}
								 onChange={this.handleInput}/>
					<Button size={'xl'}>Сохранить</Button>
				</FormLayout>
			</ModalPage>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		inputData: state.formData.forms,
		budgetId: state.background.id.budget,
		budget: state.api.budget
	};
};

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
		...bindActionCreators({postData, setFormData, closeModal, updateData, setId}, dispatch)
	}
}

export default withPlatform(connect(mapStateToProps, mapDispatchToProps)(BudgetModal));
