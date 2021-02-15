import React from 'react';
import {SET_HISTORY_BACK} from "../state/actions";
import {PanelHeaderBack} from "@vkontakte/vkui";

export default ({dispatch}) => {
	return (
		<PanelHeaderBack onClick={() => {
			dispatch({type: SET_HISTORY_BACK});
		}}/>
	)
}