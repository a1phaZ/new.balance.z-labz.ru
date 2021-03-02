import React, {Component} from 'react';
import {
	Button, Checkbox, Counter, Div,
	FormLayout, FormLayoutGroup,
	Input,
	IOS,
	ModalPage,
	ModalPageHeader,
	PanelHeaderButton, Radio,
	Select, Textarea,
	withPlatform
} from "@vkontakte/vkui";
import Icon24Cancel from "@vkontakte/icons/dist/24/cancel";
import {Icon28ClearDataOutline} from "@vkontakte/icons";
import Icon24Dismiss from "@vkontakte/icons/dist/24/dismiss";
import currency from "../../services/currency";
import {format} from "date-fns";
import regexp from "../../services/regexp";
import validate from "../../services/validate";
import AccountsOptionsList from "../../components/Accounts/AccountsOptionsList";
import {bindActionCreators} from "redux";
import {postData} from "../../store/api/actions";
import {setFormData} from "../../store/formData/actions";
import {closeModal} from "../../store/router/actions";
import {connect} from "react-redux";
import Icon24AddSquareOutline from "@vkontakte/icons/dist/24/add_square_outline";
import {setId} from "../../store/background/actions";

class ItemModal extends Component {
	constructor(props) {
		super(props);
		
		let defaultInputData = {
			account: '',
			title: '',
			date: format(new Date(), 'yyyy-MM-dd'),
			income: false,
			description: '',
			price: '',
			quantity: '',
			tags: '',
			boxPrice: false,
			validate: {
				account: {},
				date: {},
				title: {},
				description: {},
				price: {},
				quantity: {},
				tags: {},
			}
		}
		
		this.state = {
			inputData: this.getItemByIdFromState({itemId: this.props.itemId, operations: this.props.account.operations}) || props.inputData['item_form'] || defaultInputData,
			descriptionShow: false
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
		
		this.setDescriptionShow = () => {
			this.setState({descriptionShow: true})
		}
		
		this.clearForm = () => {
			this.setState({
				inputData: defaultInputData
			});
		}
		
		this.handleSubmit = this.handleSubmit.bind(this);
		this.renderedTags = this.renderedTags.bind(this);
		this.tagsToArray = this.tagsToArray.bind(this);
		this.dataToServer = this.dataToServer.bind(this);
		this.getItemByIdFromState = this.getItemByIdFromState.bind(this);
	}
	
	getItemByIdFromState = ({itemId, operations}) => {
		let item = operations.filter(item => itemId === item._id)[0];
		let {tags, itemFrom} = item;
		const validate = {
			account: {},
			date: {},
			title: {},
			description: {},
			price: {},
			quantity: {},
			tags: {},
		}
		return {...item, tags: tags.join(' '), account: itemFrom, validate}
	}
	
	handleSubmit = (e) => {
		e.preventDefault();
		this.props.postData('/items', this.dataToServer({state: this.state.inputData, accountId: this.props.accountId}));
		this.props.closeModal();
		this.clearForm();
	}
	
	dataToServer = ({state, accountId}) => {
		return {
			date: state.date,
			title: state.title,
			description: state.income ? '' : state.description,
			price: state.boxPrice ? (state.price / state.quantity).toFixed(4) : Number(state.price).toFixed(2),
			quantity: state.quantity,
			income: state.income,
			tags: this.tagsToArray(state.tags).filter(tag => !!tag.length),
			itemFrom: accountId || this.state.inputData.account,
			boxPrice: state.boxPrice,
			params: {
				//TODO set app date
				// date: new Date(date),
				tzOffset: new Date().getTimezoneOffset()
			}
		}
	}
	
	tagsToArray = (tags) => {
		return regexp(tags).toLowerCase().split(' ')
	}
	
	renderedTags = (tags) => {
		return tags.filter(tag => !!tag.length).map(
			(tag, index) =>
				<Counter
					style={{
						marginRight: '5px',
						marginBottom: '5px',
						maxWidth: '100%',
						overflow: 'hidden',
						overflowWrap: 'normal'
					}}
					key={index}
				>
					{tag}
				</Counter>
		);
	}
	
	componentWillUnmount() {
		this.props.setId({item: null});
		this.props.setFormData('item_form', this.state.inputData);
	}
	
	render() {
		const {id, onClose, platform, accounts, accountId} = this.props;
		const tagsArray = this.tagsToArray(this.state.inputData.tags);
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
						Добавить запись
					</ModalPageHeader>
				}
				onClose={onClose}
				settlingHeight={80}
			>
				<FormLayout
					onSubmit={this.handleSubmit}
				>
					<Select top={'Счет'}
									name={'account'}
									placeholder={'Выберите счет'}
									onChange={this.handleInput}
									// defaultValue={accountId || this.state.inputData.account}
									required={true}
									value={accountId || this.state.inputData.account}
									status={this.state.inputData.validate.account.status}
									bottom={this.state.inputData.validate.account.message}
					>
						<AccountsOptionsList accounts={accounts} />
					</Select>
					<Input type={'date'}
								 top={'Дата'}
								 name={'date'}
								 value={this.state.inputData.date}
								 required={true}
								 min={'2019-01-01'}
								 max={format(new Date(), 'yyyy-MM-dd')}
								 onChange={this.handleInput}
								 status={this.state.inputData.validate.date.status}
								 bottom={this.state.inputData.validate.date.message}
					/>
					<Input type={'text'}
								 placeholder={'Продукт, услуга, товар'}
								 name={'title'}
								 value={this.state.inputData.title}
								 top={'Название'}
								 required={true}
								 maxLength={20}
								 status={this.state.inputData.validate.title.status}
								 bottom={this.state.inputData.validate.title.message ? this.state.inputData.validate.title.message : `${this.state.inputData.title.length} из 20`}
								 onChange={this.handleInput}
								 autoComplete={'off'}
					/>
					<Radio name={'income'}
								 value={false}
								 defaultChecked={this.state.inputData.income ? null : true}
								 onClick={this.handleInput}
					>
						Расход
					</Radio>
					<Radio name={'income'}
								 value={true}
								 defaultChecked={this.state.inputData.income ? true : null}
								 onClick={this.handleInput}
								 //TODO disable when edit
								 // disabled={!!shopListItemTitle}
					>
						Доход
					</Radio>
					{!this.state.inputData.income
					&&
					<FormLayoutGroup top={'Описание'}>
						<Button
							type={'button'}
							mode="secondary"
							before={<Icon24AddSquareOutline/>}
							size="l"
							disabled={this.state.inputData.description || this.state.descriptionShow}
							onClick={this.setDescriptionShow}
						>
							Добавить описание
						</Button>
						{
							(this.state.descriptionShow || this.state.inputData.description) &&
							<Textarea top={'Описание'}
												name={'description'}
												placeholder={'Описание товара(продукта, услуги)'}
												value={this.state.inputData.description}
												maxLength={70}
												status={this.state.inputData.validate.description.status}
												bottom={this.state.inputData.validate.description.message ? this.state.inputData.validate.description.message : `${this.state.inputData.description.length} из 70`}
												onChange={this.handleInput}
							/>
						}
					</FormLayoutGroup>
					}
					<Input type={'text'}
								 top={'Теги'}
								 name={'tags'}
								 value={this.state.inputData.tags}
								 placeholder={'Теги через пробел'}
								 status={this.state.inputData.validate.tags.status}
								 maxLength={50}
								 bottom={this.state.inputData.validate.tags.message ? this.state.inputData.validate.tags.message : `${this.state.inputData.tags.length} из 50 символов`}
								 onChange={this.handleInput}
								 autoComplete={'off'}
					/>
					{
						!!tagsArray.length &&
						this.state.inputData.tags.length !== 0
						&&
						<Div style={{display: 'flex', flexWrap: 'wrap'}}>
							{this.renderedTags(tagsArray)}
						</Div>
					}
					<Input type={'number'}
								 name={'price'}
								 placeholder={currency(0)}
								 pattern={'[0-9]+([,\\.][0-9]+)?'}
								 top={'Цена'}
								 inputMode="decimal"
								 max={99999999}
								 min={0}
								 step={0.0001}
								 status={this.state.inputData.validate.price.status}
								 bottom={this.state.inputData.validate.price.message}
								 value={this.state.inputData.price}
								 required={true}
								 onChange={this.handleInput}
								 autoComplete={'off'}
					/>
					{
						!this.state.inputData.income
						&&
						<Checkbox
							checked={this.state.inputData.boxPrice}
							name={'boxPrice'}
							onChange={this.handleInput}
						>
							Цена за упаковку
						</Checkbox>
					}
					<Input type={'number'}
								 name={'quantity'}
								 placeholder={'0'}
								 pattern={'[0-9]+([,\\.][0-9]+)?'}
								 top={'Кол-во'}
								 inputMode="decimal"
								 max={9999999}
								 min={0}
								 step={0.001}
								 status={this.state.inputData.validate.quantity.status}
								 bottom={this.state.inputData.validate.quantity.message}
								 value={this.state.inputData.quantity}
								 required={true}
								 onChange={this.handleInput}
								 autoComplete={'off'}
					/>
					<Button size={'xl'}>
						{`Сохранить ${this.state.inputData.boxPrice ? currency(this.state.inputData.price) : currency(this.state.inputData.price * this.state.inputData.quantity)}`}
					</Button>
				</FormLayout>
			</ModalPage>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		inputData: state.formData.forms,
		
		accounts: state.api.accounts,
		account: state.api.account,
		
		accountId: state.background.id.account,
		itemId: state.background.id.item
	};
};

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
		...bindActionCreators({postData, setFormData, closeModal, setId}, dispatch)
	}
}


export default withPlatform(connect(mapStateToProps, mapDispatchToProps)(ItemModal));
