import React from 'react';
import {Button, FixedLayout, Panel, Placeholder, PromoBanner, Spinner} from "@vkontakte/vkui";
import {SET_ACTIVE_VIEW} from "../state/actions";
import Icon36Done from '@vkontakte/icons/dist/36/done';

export default ({id, dispatch, loading, bannerData, setBannerData, shopListId}) => {
	return (
		<Panel id={id}>
			<Placeholder
				icon={loading ? <Spinner size="large"/> : <Icon36Done/>}
				action={
					!loading && <Button
						onClick={() => {
							if (!window.location.hash || window.location.hash.slice(1) === shopListId) {
								dispatch({type: SET_ACTIVE_VIEW, payload: {view: 'home', panel: 'home'}});
							} else {
								dispatch({type: SET_ACTIVE_VIEW, payload: {view: 'more', panel: 'shop-list'}});
							}
						}}
						id={'initial-button'}
					>
						Запустить
					</Button>
				}
				stretched
			>
				{loading ? 'Подготавливаем приложение к запуску' : 'Приложение готово'}
			</Placeholder>
			<FixedLayout vertical={"bottom"}>
				{bannerData && <PromoBanner bannerData={bannerData} onClose={() => setBannerData(null)}/>}
			</FixedLayout>
		</Panel>
	)
}
