import React from 'react';
import bridge from '@vkontakte/vk-bridge';
import {Cell, Group, Panel, PanelHeader} from "@vkontakte/vkui";
import Icon28ShareExternalOutline from '@vkontakte/icons/dist/28/share_external_outline';
import Icon28Users3Outline from '@vkontakte/icons/dist/28/users_3_outline';
import Icon28AddCircleOutline from '@vkontakte/icons/dist/28/add_circle_outline';
import Icon28ListCheckOutline from '@vkontakte/icons/dist/28/list_check_outline';

export default ({id}) => {
	return (
		<Panel id={id}>
			<PanelHeader>Ещё</PanelHeader>
			<Group>
				<Cell
					expandable
					before={
						<Icon28ShareExternalOutline />
					}
					onClick={() => {bridge.send("VKWebAppShare")}}
				>
					Поделиться
				</Cell>
				<Cell
					expandable
					before={<Icon28Users3Outline />}
					onClick={() => {bridge.send('VKWebAppAddToCommunity')}}
				>
					Сообщество Баланса
				</Cell>
				<Cell expandable before={<Icon28AddCircleOutline />}>Добавить на главный экран</Cell>
			</Group>
			{false && <Group>
				<Cell expandable before={<Icon28ListCheckOutline/>}>Список покупок</Cell>
			</Group>}
		</Panel>
	)
}