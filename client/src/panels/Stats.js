import React, { useState, useEffect } from 'react';
import {Group, Panel, PanelHeader, Search} from "@vkontakte/vkui";
import MonthSwitch from "../components/MonthSwitch";
import mapStats from "../handlers/mapStats";

export default ({id, accounts, onRefresh}) => {
	const [operations, setOperations] = useState(() => {
		return accounts
			.map(item => item.operations)
			.flat()
			.filter(({income}) => !income)
			.sort((a, b) => a.title.localeCompare(b.title))
	});
	const [filteredItems, setFilteredItems] = useState(() => operations);
	const reducer = (prev, curr) => {
		if (prev[prev.length-1]?.title === curr.title) {
			const prevItem = prev[prev.length-1];
			prevItem.sum = prevItem.sum + curr.sum;
			prevItem.quantity += curr.quantity;
			const array = [...prev.slice(0, prev.length-1), prevItem];
			return [...array];
		} else {
			return [...prev, {title: curr.title, sum: curr.sum, quantity: curr.quantity}];
		}
	}

	const accountItemsList = filteredItems
		.reduce(reducer, [])
		.map(mapStats());

	useEffect(() => {
		const items = accounts
			.map(item => item.operations)
			.flat()
			.filter(({income}) => !income)
			.sort((a, b) => a.title.localeCompare(b.title));
		setOperations(items);
		setFilteredItems(items);
	}, [accounts])

	const onSearch = (str) => {
		if (str === '') {
			setFilteredItems(accounts
				.map(item => item.operations)
				.flat()
				.filter(({income}) => !income)
				.sort((a, b) => a.title.localeCompare(b.title))
			);
		} else {
			setFilteredItems(accounts
				.map(item => item.operations)
				.flat()
				.filter(({income}) => !income)
				.sort((a, b) => a.title.localeCompare(b.title))
				.filter(({title}) => title.toLowerCase().indexOf(str.toLowerCase()) > -1));
		}
	}

	return (
		<Panel id={id}>
			<PanelHeader>
				Сводка
			</PanelHeader>
			<MonthSwitch onRefresh={onRefresh} />
			<Search onChange={(e) => {
				onSearch(e.currentTarget.value)
			}}/>
			<Group>
				{accountItemsList}
			</Group>
		</Panel>
	)
}