import React from 'react';
import {Button, Panel, Placeholder, Spinner} from "@vkontakte/vkui";
import {SET_ACTIVE_VIEW} from "../state/actions";
import Icon36Done from '@vkontakte/icons/dist/36/done';

export default ({id, dispatch, loading}) => {
	console.log(loading);
	return (
		<Panel id={id}>
			<Placeholder
				icon={loading ? <Spinner size="large"/> : <Icon36Done/>}
				action={
					!loading && <Button
						onClick={() => {
							dispatch({type: SET_ACTIVE_VIEW, payload: {view: 'home', panel: 'home'}});
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
		</Panel>
	)
}
