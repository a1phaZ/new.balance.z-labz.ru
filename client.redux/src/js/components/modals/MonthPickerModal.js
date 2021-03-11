import React, {Component} from 'react';
import {
	Button,
	Div,
	FormLayout,
	IOS,
	ModalPage,
	ModalPageHeader,
	PanelHeaderButton,
	withPlatform
} from "@vkontakte/vkui";
import Icon24Cancel from "@vkontakte/icons/dist/24/cancel";
import {Icon28ClearDataOutline} from "@vkontakte/icons";
import Icon24Dismiss from "@vkontakte/icons/dist/24/dismiss";
import monthByNumber from "../../services/monthByNumber";
import {bindActionCreators} from "redux";
import {closeModal} from "../../store/router/actions";
import {setDate} from "../../store/background/actions";
import {connect} from "react-redux";

class MonthPickerModal extends Component {
	constructor(props) {
		super(props);
		
		this.renderMonth = this.renderMonth.bind(this);
		this.clickMonth = this.clickMonth.bind(this);
	}
	
	clickMonth = (year, month) => {
		this.props.setDate({date: `${year}-${month}`});
	}
	
	renderMonth = (date) => {
		const numbersOfMonth = [0,1,2,3,4,5,6,7,8,9,10,11];
		const currentDate = new Date(date);
		const currentYear = currentDate.getFullYear();
		const currentMonth = currentDate.getMonth();
		return numbersOfMonth.map(number => {
			return (
				<Button
					key={`month_${number}`}
					type={'button'}
					size="l"
					data-number={number}
					disabled={number === currentMonth}
					style={{width: '30%', margin: '0 0 1em 0'}}
					onClick={(e) => {
						this.clickMonth(currentYear, parseInt(e.currentTarget.dataset.number)+1)
					}}
				>
					{monthByNumber(number)}
				</Button>
			)
		});
	}
	
	
	render() {
		const {id, onClose, platform, date} = this.props;
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
						Выберете месяц
					</ModalPageHeader>
				}
				onClose={onClose}
				settlingHeight={80}
			>
				<FormLayout
					onSubmit={() => {}}
				>
					<Div style={{display: 'flex', flexWrap: 'wrap', justifyContent:'space-between'}}>
						{this.renderMonth(date)}
					</Div>
				</FormLayout>
			</ModalPage>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		date: state.background.date,
	};
};

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
		...bindActionCreators({closeModal, setDate}, dispatch)
	}
}

export default withPlatform(connect(mapStateToProps, mapDispatchToProps)(MonthPickerModal));