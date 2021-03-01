import React, {Component} from 'react';
import {Button, FormLayout, Input, IOS, ModalPage, ModalPageHeader, PanelHeaderButton} from "@vkontakte/vkui";
import Icon24Cancel from "@vkontakte/icons/dist/24/cancel";
import {Icon28ClearDataOutline} from "@vkontakte/icons";
import Icon24Dismiss from "@vkontakte/icons/dist/24/dismiss";
import currency from "../../services/currency";

class ItemModal extends Component {
	render() {
		const {id, onClose, platform} = this.props;
		
		return (
			<ModalPage
				id={id}
				header={
					<ModalPageHeader
						left={platform !== IOS ?
							<PanelHeaderButton onClick={onClose}><Icon24Cancel/></PanelHeaderButton> :
							<PanelHeaderButton onClick={onClose}><Icon28ClearDataOutline/></PanelHeaderButton>}
						right={platform === IOS ?
							<PanelHeaderButton onClick={onClose}><Icon24Dismiss/></PanelHeaderButton> :
							<PanelHeaderButton onClick={onClose}><Icon28ClearDataOutline/></PanelHeaderButton>}
					>
						Добавить запись
					</ModalPageHeader>
				}
				onClose={onClose}
				settlingHeight={80}
			>

			</ModalPage>
		);
	}
}

export default ItemModal;
