import React, {useContext} from 'react';
import {addMonths, format, subMonths} from 'date-fns';
import {ru} from 'date-fns/locale';
import Icon24BrowserBack from '@vkontakte/icons/dist/24/browser_back';
import Icon24BrowserForward from '@vkontakte/icons/dist/24/browser_forward';
import {State} from "../state";
import {Button, Cell, Group} from "@vkontakte/vkui";

export default ({onRefresh}) => {
	const [state, dispatch] = useContext(State);
	const dateFormat = 'LLLL yyyy';
	const disabled = format(new Date(), 'yyyy.M') >= format(state.currentDate, 'yyyy.M');

	const nextMonth = () => {
		dispatch({type: 'SET_DATE', payload: {date: (addMonths(state.currentDate, 1))}});
		onRefresh();
	};

	const prevMonth = () => {
		dispatch({type: 'SET_DATE', payload: {date: (subMonths(state.currentDate, 1))}});
		onRefresh();
	};

	return (
		<Group>
			<Cell
				before={<Button onClick={prevMonth} mode={'secondary'}><Icon24BrowserBack/></Button>}
				asideContent={<Button disabled={disabled} onClick={nextMonth}
															mode={'secondary'}><Icon24BrowserForward/></Button>}
				style={{textAlign: 'center', fontWeight: 'bold'}}
			>
				{format(state.currentDate, dateFormat, {locale: ru}).toLocaleUpperCase()}
			</Cell>
		</Group>
	)
}