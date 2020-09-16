import React from 'react';
import {format} from 'date-fns';
import ruLocale from 'date-fns/locale/ru';
import {Div, Footer, Header, Panel, PanelHeader, PanelHeaderBack, RichCell, Title} from "@vkontakte/vkui";
import currency from "../handlers/currency";
import Group from "@vkontakte/vkui/dist/components/Group/Group";
import {SET_ACTIVE_VIEW} from "../state/actions";

export default ({id, account, dispatch}) => {
	console.log(account);
	const accountItemsList = account.operations.map((item, index) => {
		return (
			<RichCell
				key={index}
				multiline
				caption={format(new Date(item?.date), 'dd MMMM yyyy', {locale: ruLocale})}
				after={item?.income ? currency(item?.sum) : currency(-1*item?.sum)}
			>
				{item?.title}
			</RichCell>
		)
	});
	return (
		<Panel id={id}>
			<PanelHeader left={<PanelHeaderBack onClick={() => dispatch({type: SET_ACTIVE_VIEW, payload: {view: 'home', panel: 'home'}})} />}>
				{account?.title}
			</PanelHeader>
			<Group
				header={<Header mode="secondary">Информация по счету</Header>}
				separator="show"
			>
				<Div>
					<Title level="1" weight="semibold" style={{marginBottom: 16}}>{currency(account?.sum)}</Title>
				</Div>
				{account?.operations.length === 0 && <Footer>Операций по счету еще не было</Footer>}
				{accountItemsList}
			</Group>
		</Panel>
	)
}