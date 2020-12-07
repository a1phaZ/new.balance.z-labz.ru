import React, { useEffect, useState } from 'react';
import bridge from '@vkontakte/vk-bridge';
import {Cell, Group, Header, Panel, PanelHeader} from "@vkontakte/vkui";
import Icon28ShareExternalOutline from '@vkontakte/icons/dist/28/share_external_outline';
import Icon28Users3Outline from '@vkontakte/icons/dist/28/users_3_outline';
import Icon28AddCircleOutline from '@vkontakte/icons/dist/28/add_circle_outline';
import Icon28ListCheckOutline from '@vkontakte/icons/dist/28/list_check_outline';

export default ({id}) => {
	const userId = new URL(window.location.href).searchParams.get('vk_user_id');
	const [addToHomeScreenSupported, setAddToHomeScreenSupported] = useState(false);
	const [addedToHomeScreen, setAddedToHomeScreen] = useState(false);

	useEffect(() => {
		bridge.subscribe(({detail: {type, data}}) => {
			if (type === 'VKWebAppAddToHomeScreenInfoResult') {
				setAddToHomeScreenSupported(data.is_feature_supported);
				setAddedToHomeScreen(data.is_added_to_home_screen);
			}
			if (type === 'VKWebAppAddToHomeScreenResult') {
				console.log(data);
				if (data.result) {
					bridge.send('VKWebAppAddToHomeScreenInfo');
				}
			}
		});
		bridge.send('VKWebAppAddToHomeScreenInfo');
	}, []);

	return (
		<Panel id={id}>
			<PanelHeader>Ещё</PanelHeader>
			<Group
				header={
					<Header
						mode="secondary"
					>
						Дополнительно
					</Header>
				}
			>
				<Cell
					expandable
					before={
						<Icon28ShareExternalOutline/>
					}
					onClick={() => {
						bridge.send("VKWebAppShare", {link: `https://vk.com/zlabz_balance#ref=${userId}`})
					}}
				>
					Поделиться
				</Cell>
				<Cell
					expandable
					before={<Icon28Users3Outline/>}
					onClick={() => {
						bridge.send('VKWebAppJoinGroup', {group_id: 195358095})
					}}
				>
					Присоеденииться к Балансу
				</Cell>

				{addToHomeScreenSupported && !addedToHomeScreen && <Cell
					expandable
					before={<Icon28AddCircleOutline/>}
					onClick={() => {
						bridge.send('VKWebAppAddToHomeScreen');
					}}
				>
					Добавить на главный экран
				</Cell>}
			</Group>
			{false && <Group>
				<Cell expandable before={<Icon28ListCheckOutline/>}>Список покупок</Cell>
			</Group>}
		</Panel>
	)
}