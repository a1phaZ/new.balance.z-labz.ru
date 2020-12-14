import React, {useEffect} from 'react';
import bridge from '@vkontakte/vk-bridge';
import {Cell, FixedLayout, Group, Header, Panel, PanelHeader, PromoBanner} from "@vkontakte/vkui";
import Icon28ShareExternalOutline from '@vkontakte/icons/dist/28/share_external_outline';
import Icon28Users3Outline from '@vkontakte/icons/dist/28/users_3_outline';
import Icon28AddCircleOutline from '@vkontakte/icons/dist/28/add_circle_outline';
import Icon28ListCheckOutline from '@vkontakte/icons/dist/28/list_check_outline';
import {SET_ACTIVE_VIEW} from "../state/actions";

export default ({id, dispatch, bannerData, setBannerData, addToHomeScreenSupported, addedToHomeScreen}) => {
	const userId = new URL(window.location.href).searchParams.get('vk_user_id');

	useEffect(() => {
		bridge.send('VKWebAppGetAds', {});
	}, []);

	return (
		<Panel id={id}>
			<PanelHeader>Ещё</PanelHeader>
			<Group>
				<Cell
					expandable
					before={<Icon28ListCheckOutline/>}
					onClick={() => {
						dispatch({type: SET_ACTIVE_VIEW, payload: {view: 'more', panel: 'shop-list'}})
					}}
				>Список покупок</Cell>
			</Group>
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
					Присоединиться к Балансу
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
			<FixedLayout vertical={"bottom"}>
				{bannerData && <PromoBanner bannerData={bannerData} onClose={() => setBannerData(null)}/>}
			</FixedLayout>
		</Panel>
	)
}