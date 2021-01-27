import React, {useState} from 'react';
import format from "date-fns/format";
import startOfMonth from 'date-fns/startOfMonth';
import endOfMonth from 'date-fns/endOfMonth';
import {FormLayout, Input} from "@vkontakte/vkui";

export default ({onDateChange, date}) => {
	const [startDate, setStartDate] = useState(() => format(startOfMonth(new Date(date)), 'yyyy-MM-dd'));
	const [endDate, setEndDate] = useState(() => format(endOfMonth(new Date(date)), 'yyyy-MM-dd'));
	
	const minPeriod = format(startOfMonth(new Date(date)), 'yyyy-MM-dd');
	const maxPeriod = format(endOfMonth(new Date(date)), 'yyyy-MM-dd');
	
	return (
		<FormLayout>
			<Input type={'date'}
						 top={'Дата начала периода'}
						 value={startDate}
						 required={true}
						 min={minPeriod}
						 max={maxPeriod}
						 onChange={
							 (e) => {
								 setStartDate(e.currentTarget.value);
								 onDateChange({
									 startDate: e.currentTarget.value,
									 endDate
								 });
							 }
						 }
			/>
			<Input type={'date'}
						 top={'Дата конца периода'}
						 value={endDate}
						 required={true}
						 min={minPeriod}
						 max={maxPeriod}
						 onChange={(e) => {
							 setEndDate(e.currentTarget.value)
							 onDateChange({
								 startDate,
								 endDate: e.currentTarget.value
							 });
						 }}
			/>
		</FormLayout>
	)
}