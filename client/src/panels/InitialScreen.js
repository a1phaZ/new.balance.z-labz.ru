import React, {useEffect} from 'react';
import {Panel} from "@vkontakte/vkui";
import {SET_ACTIVE_VIEW} from "../state/actions";

export default ({id, dispatch}) => {
	useEffect(() => {
		dispatch({type: SET_ACTIVE_VIEW, payload: {view: 'home', panel: 'home'}});
	}, [dispatch]);
	return (
		<Panel id={id}>

		</Panel>
	)
}
