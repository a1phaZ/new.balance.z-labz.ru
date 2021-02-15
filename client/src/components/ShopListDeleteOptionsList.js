import React from 'react';
import {Cell} from "@vkontakte/vkui";
import Icon28DeleteOutline from "@vkontakte/icons/dist/28/delete_outline";
import Icon28DoneOutline from "@vkontakte/icons/dist/28/done_outline";
import Icon28ErrorCircleOutline from '@vkontakte/icons/dist/28/error_circle_outline';

export default ({deleteOne, deleteDone, deleteAll}) => {
	return (
		<>
			<Cell
				disabled
				before={<Icon28DeleteOutline/>}
				onClick={deleteOne}
			>
				Удалять по одному
			</Cell>
			<Cell
				disabled
				before={<Icon28DoneOutline/>}
				onClick={deleteDone}
			>
				Удалить выполненые
			</Cell>
			<Cell
				disabled
				before={<Icon28ErrorCircleOutline/>}
				onClick={deleteAll}
			>
				Удалить весь список
			</Cell>
		</>
	)
}