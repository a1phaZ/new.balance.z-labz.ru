import React from 'react';
import Icon28ShareExternalOutline from '@vkontakte/icons/dist/28/share_external_outline';
import {PanelHeaderButton} from "@vkontakte/vkui";


export default ({shareClick}) => {
	return (
			<PanelHeaderButton
				onClick={shareClick}
			>
				<Icon28ShareExternalOutline/>
			</PanelHeaderButton>
	)
}