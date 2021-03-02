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
import {connect} from "react-redux";
import Icon24Cancel from "@vkontakte/icons/dist/24/cancel";
import Icon24Dismiss from "@vkontakte/icons/dist/24/dismiss";
import { Icon28ClearDataOutline } from '@vkontakte/icons';
import {setFormData} from "../../store/formData/actions";
import regexp from "../../services/regexp";
import validate from "../../services/validate";
import currency from "../../services/currency";
import {postData} from "../../store/api/actions";
import {bindActionCreators} from "redux";
import {closeModal} from "../../store/router/actions";

class AccountModal extends Component {
	constructor(props) {
		super(props);
		
		let defaultInputData = {
			title: '',
			sum: '',
			validate: {
				title: {
					status: '',
					message: ''
				},
				sum: {
					status: '',
					message: ''
				}
			}
		};
		
		this.state = {
			inputData: props.inputData['account_form'] || defaultInputData
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
		
		this.handleSubmit = this.handleSubmit.bind(this);
		this.clearForm = () => {
			this.setState({
				inputData: defaultInputData
			});
		};
	}
	
	handleSubmit = (e) => {
		e.preventDefault();
		this.props.postData('/accounts', {title: this.state.inputData.title, sum: this.state.inputData.sum});
		this.props.closeModal();
		this.clearForm();
	}
	
	componentWillUnmount() {
		this.props.setFormData('account_form', this.state.inputData);
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
						Добавить счет
					</ModalPageHeader>
				}
				onClose={onClose}
				settlingHeight={80}
			>
				<FormLayout
					onSubmit={this.handleSubmit}
				>
					<Input type={'text'} placeholder={'Карта, наличные, счет в банке'} top={'Название'} value={this.state.inputData.title}
								 required={true}
								 name = 'title'
								 maxLength={'20'}
								 status={this.state.inputData.validate.title.status}
								 bottom={this.state.inputData.validate.title.message ? this.state.inputData.validate.title.message : `${this.state.inputData.title.length} из 20`}
								 onChange={this.handleInput}
					       autoComplete={'off'}
					/>
					<Input type={'number'} placeholder={currency(0)} top={'Баланс счета'} value={this.state.inputData.sum}
								 pattern={'[0-9]+([,\\.][0-9]+)?'}
								 required={true}
								 name={'sum'}
								 status={this.state.inputData.validate.sum.status}
								 inputMode="decimal"
								 max={999999999}
								 min={0}
								 step={0.01}
								 bottom={this.state.inputData.validate.sum.message ? this.state.inputData.validate.sum.message : 'Денежные средства, находящиеся на счете в данный момент'}
								 onChange={this.handleInput}
								 autoComplete={'off'}
					/>
					<Button size={'xl'}>Сохранить</Button>
				</FormLayout>
			</ModalPage>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		inputData: state.formData.forms
	};
};

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
		...bindActionCreators({postData, setFormData, closeModal}, dispatch)
	}
}


export default withPlatform(connect(mapStateToProps, mapDispatchToProps)(AccountModal));