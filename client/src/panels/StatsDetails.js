import React, {useEffect, useState} from 'react';
import {Div, Footer, Panel, PanelHeader} from "@vkontakte/vkui";
import sort from "../handlers/sort";
import mapRichCell from "../handlers/mapRichCell";
import InfoSnackbar from "../components/InfoSnackbar";
import SearchForm from "../components/SearchForm";
import {ArrayToObjectWithDate, ObjectToArrayWithDate} from "../handlers/formatingArrayWithDate";
import startOfMonth from 'date-fns/startOfMonth';
import endOfMonth from 'date-fns/endOfMonth';
import SearchDate from "../components/SearchDate";
import BackButton from "../components/BackButton";

export default ({id, itemsList = [], dispatch, title, showSearch = true, category, currentStateDate}) => {
	const [filteredItems, setFilteredItems] = useState(() => itemsList);
	const [searchStr, setSearchStr] = useState('');
	const [searchDate, setSearchDate] = useState(() => {
		return {
			startDate: startOfMonth(new Date(currentStateDate)),
			endDate: endOfMonth(new Date(currentStateDate))
		}
	});
	const onSearch = (searchStr) => {
		setSearchStr(searchStr);
	}
	const onDateChange = (date) => {
		const {startDate, endDate} = date;
		setSearchDate({
			startDate: new Date(startDate),
			endDate: new Date(endDate)
		});
	}
	
	const indexAr = ArrayToObjectWithDate(filteredItems);
	
	const accountItemsListArray = ObjectToArrayWithDate(indexAr);
	
	let itemsListView = [];
	if (category === 'tags') {
		itemsListView = accountItemsListArray.sort(sort).map(mapRichCell({dispatch, tagsShow: false}));
	}
	if (category === 'items') {
		itemsListView = accountItemsListArray.sort(sort).map(mapRichCell({dispatch}));
	}
	
	useEffect(() => {
		setFilteredItems(itemsList.filter(({date}) => {
			return (+new Date(date) >= +new Date(searchDate.startDate) && +new Date(date) <= +new Date(searchDate.endDate));
		}))
	}, [searchDate, itemsList])
	
	useEffect(() => {
		if (searchStr === '') {
			setFilteredItems(itemsList);
		} else {
			setFilteredItems(itemsList.filter(({title}) => title.toLowerCase().indexOf(searchStr.toLowerCase()) > -1));
		}
	}, [itemsList, searchStr]);
	
	return (
		<Panel id={id}>
			<PanelHeader
				left={
					<BackButton dispatch={dispatch}/>
				}
			>
				{title}
			</PanelHeader>
			{showSearch && <SearchForm onSearch={onSearch}/>}
			{!showSearch && <SearchDate onDateChange={onDateChange} date={currentStateDate}/>}
			<Div>
				{itemsListView}
				{+new Date(searchDate.startDate) > +new Date(searchDate.endDate) &&
				<Footer>Дата начала периода больше даты конца периода.</Footer>}
				{itemsListView.length === 0 && <Footer>Нет данных для отображения</Footer>}
			</Div>
			<InfoSnackbar/>
		</Panel>
	)
}