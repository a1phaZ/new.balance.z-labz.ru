import React, {useContext, useState} from 'react';
import {addMonths, format, subMonths, isAfter, isBefore} from 'date-fns';
import {ru} from 'date-fns/locale';
import Icon24BrowserBack from '@vkontakte/icons/dist/24/browser_back';
import Icon24BrowserForward from '@vkontakte/icons/dist/24/browser_forward';
import {State} from "../state";
import {Button, Cell, Group} from "@vkontakte/vkui";

export default ({onRefresh}) => {
	const [state, dispatch] = useContext(State);
	const dateFormat = 'LLLL yyyy';
	const disabledAfter = isAfter(addMonths(state.currentDate, 1), new Date());
	const disabledBefore = isBefore(new Date(state.currentDate), new Date(2015, 0, 1));
	const [clickTime, setClickTime] = useState(0);
	
	const nextMonth = () => {
		let timeNow = +new Date();
		if (timeNow - clickTime > 500) {
			dispatch({type: 'SET_DATE', payload: {date: (addMonths(state.currentDate, 1))}});
			onRefresh();
			setClickTime(timeNow);
		}
	};

	const prevMonth = () => {
		let timeNow = +new Date();
		if (timeNow - clickTime > 500) {
			dispatch({type: 'SET_DATE', payload: {date: (subMonths(state.currentDate, 1))}});
			onRefresh();
			setClickTime(timeNow);
		}
	};

	return (
		<Group>
			<Cell
				before={<Button disabled={disabledBefore} onClick={prevMonth} mode={'secondary'}><Icon24BrowserBack/></Button>}
				asideContent={<Button disabled={disabledAfter} onClick={nextMonth}
															mode={'secondary'}><Icon24BrowserForward/></Button>}
				style={{textAlign: 'center', fontWeight: 'bold'}}
			>
				<div style={{cursor: 'auto'}}>
					{format(state.currentDate, dateFormat, {locale: ru}).toLocaleUpperCase()}
				</div>
			</Cell>
		</Group>
	)
}