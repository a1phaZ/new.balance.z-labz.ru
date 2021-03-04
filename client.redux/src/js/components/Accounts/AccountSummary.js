import React from 'react';
import {Div, Group, Header, Title} from "@vkontakte/vkui";
import currency from "../../services/currency";

export default ({account}) => {
	const sum = account ? account.sum : 0;
	return (
		<Group
			header={<Header mode="secondary">Информация по счету</Header>}
			separator="show"
		>
			<Div>
				<Title level={'3'} weight={'semibold'}>Остаток по счету</Title>
				<Title level="1" weight="bold" style={{marginBottom: 16}}>{currency(sum)}</Title>
			</Div>
		</Group>
	)
}