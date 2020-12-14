import React from 'react';
import {Cell} from "@vkontakte/vkui";
import {SET_ACTIVE_VIEW} from "../state/actions";
import Icon28ChevronRightCircleOutline from '@vkontakte/icons/dist/28/chevron_right_circle_outline';
import Icon28CheckCircleOn from '@vkontakte/icons/dist/28/check_circle_on';

export default ({list, dispatch}) => {
	return (
		list.map((item) => {
			return (
				<Cell
					key={item.id}
					expandable
					before={item.done ? <Icon28CheckCircleOn/> : <Icon28ChevronRightCircleOutline/>}
					checked={item.done}
					// disabled={item.done}
					onClick={() => {
						dispatch({type: SET_ACTIVE_VIEW, payload: {view: 'more', panel: 'shop-list'}});
					}}
				>
					{item.title}
				</Cell>
			)
		})
	)
}