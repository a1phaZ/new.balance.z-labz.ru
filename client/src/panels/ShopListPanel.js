import React, {useEffect, useReducer, useState} from 'react';
import bridge from "@vkontakte/vk-bridge";
import {
	Banner,
	Button,
	Cell,
	Footer,
	FormLayout,
	Input,
	List,
	Panel,
	PanelHeader,
	PanelHeaderBack,
	PanelHeaderContent,
	PanelHeaderContext
} from "@vkontakte/vkui";
import {SET_HISTORY_BACK, SET_MODAL, SET_SUCCESS_MESSAGE, SET_TOGGLE_CONTEXT} from "../state/actions";
import InfoSnackbar from "../components/InfoSnackbar";
import regexp from "../handlers/regexp";
import validate from "../handlers/validate";
import Icon16Dropdown from "@vkontakte/icons/dist/16/dropdown";
import Icon28DeleteOutline from '@vkontakte/icons/dist/28/delete_outline';
import Icon28DoneOutline from '@vkontakte/icons/dist/28/done_outline';
import Icon28ShareExternalOutline from '@vkontakte/icons/dist/28/share_external_outline';
import useApi from "../handlers/useApi";

const initialState = {
	list: [],
	item: {
		id: 1,
		title: '',
		done: false
	},
	id: null,
	validate: {
		title: {}
	}
}

const reducer = (state, action) => {
	switch (action.type) {
		case 'INITIAL_LIST': {
			const index = action.payload.list[action.payload.list.length - 1] ? action.payload.list[action.payload.list.length - 1].id : 1;
			return {
				...state,
				list: action.payload.list,
				item: {
					id: index + 1,
					title: '',
					done: false
				}
			}
		}
		case 'SET_TITLE': {
			const {payload: {validateForm, title}} = action;
			const item = {
				id: state.item.id,
				title: title,
				done: false
			}
			return {
				...state,
				item,
				validate: {...state.validate, ...validateForm}
			}
		}
		case 'SET_ID': {
			return {
				...state,
				id: action.payload.id
			}
		}
		case 'SET_ITEM_TO_LIST': {
			const item = action?.payload?.item || state.item;
			const itemIndex = state.list.findIndex((stateItem) => stateItem.title === item.title);
			if (itemIndex !== -1) {
				return {
					...state
				}
			}
			const newIndex = state.list[state.list.length - 1] ? state.list[state.list.length - 1].id : 1
			item.id = item.id || newIndex+1;
			const newList = [...state.list, {id: item.id, title: item.title, done: item.done}];
			const index = newList[newList.length - 1] ? newList[newList.length - 1].id : 1;
			return {
				...state,
				list: newList,
				item: {title: '', done: false, id: index + 1},
				validate: {
					title: {}
				}
			}
		}
		case 'SET_DONE': {
			const list = state.list;
			const {id} = action.payload;
			const index = list.findIndex((item) => item.id === id);
			if (index !== -1) {
				list[index].done = !list[index].done;
			}
			return {
				...state,
				list
			}
		}
		case 'DELETE_ITEM': {
			const {list} = state;
			const {id} = action.payload;
			const index = list.findIndex((item) => item.id === id);
			list.splice(index, 1);
			if (list.length === 0) {
				localStorage.removeItem('shopList');
			}
			return {
				...state,
				list
			}
		}
		default:
			return state;
	}
}

export default ({id, dispatch, shopListFromServer, setShopListItemTitle, setShopList, context, success, shopListId, setShopListId}) => {
	const [state, dispatchList] = useReducer(reducer, initialState);
	const [isOpened, setIsOpened] = useState(() => context);
	const [deleteMode, setDeleteMode] = useState(false);
	const [hash, setHash] = useState(() => {
		const id = window.location.hash.slice(1);
		if (id === shopListId) {
			return '';
		}
		return id;
	});
	const [path, setPath] = useState(() => {
		return hash ? `shoplist/${hash}` : 'shoplist/add';
	})
	const [{response}, doApiFetch] = useApi(path);
	const shopList =
		shopListFromServer.length
			?
			state.list.map((item, index) => {
				return (
					<Cell
						key={item.id || 1000+index}
						selectable={!deleteMode}
						removable={deleteMode}
						checked={item.done}
						disabled={deleteMode ? false : item.done}
						onChange={() => {
							setShopListItemTitle(shopListFromServer[shopListFromServer.findIndex(i => i.id === item?.id)].title);
							dispatchList({type: 'SET_ID', payload: {id: item?.id}});
							dispatch({type: SET_SUCCESS_MESSAGE, payload: {message: null}});
							dispatch({type: SET_MODAL, payload: {modal: 'add-money'}});
						}}
						onRemove={() => {
							dispatchList({type: 'DELETE_ITEM', payload: {id: item?.id}});
							setShopList(state.list);
						}}
					>
						{item.title}
					</Cell>
				)
			})
			:
			<Footer>Список покупок пуст</Footer>
	;
	
	const banner = (
		<Banner
			size={'m'}
			header={'Обнаружена ссылка на список покупок'}
			subheader={'Добавить к Вашему списку покупок?'}
			asideMode={'dismiss'}
			onDismiss={() => {
				setShopListId(hash);
				setHash('');
			}}
			actions={
				<Button
					mode={'primary'}
					onClick={async () => {
						await doApiFetch({
							method: 'GET',
							params: {
								id: hash
							}
						})
						setShopListId(hash);
						setHash('');
					}}
				>
					Добавить
				</Button>
			}
		/>
		)
	
	const toggleContext = () => {
		dispatch({type: SET_TOGGLE_CONTEXT, payload: {context: !isOpened}});
	}
	
	useEffect(() => {
		if (!response) return;
		if (response.id) {
			bridge.send("VKWebAppShare", {link: `https://vk.com/zlabz_balance#${response.id}`});
		}
		if (response.list) {
			response.list.forEach(item => {
				item.done = false;
				dispatchList({type: 'SET_ITEM_TO_LIST', payload: {item}})
			});
			setPath('/shoplist/add');
		}
	},[response, dispatchList]);

	useEffect(() => {
		setIsOpened(context);
	}, [context]);

	useEffect(() => {
		dispatchList({type: 'INITIAL_LIST', payload: {list: shopListFromServer}});
	}, [shopListFromServer]);
	
	useEffect(() => {
		if (!success) return;
		dispatchList({type: 'SET_DONE', payload: {id: state.id}});
	}, [success, state.id]);

	useEffect(() => {
		if (state.list.length === 0) return;
		setShopList(state.list);
	}, [state.list, setShopList, shopList]);

	return (
		<Panel id={id}>
			<PanelHeader
				left={
					<PanelHeaderBack onClick={() => {
						dispatch({type: SET_HISTORY_BACK});
					}}/>
				}
			>
				<PanelHeaderContent
					aside={<Icon16Dropdown style={{transform: `rotate(${isOpened ? '180deg' : '0'})`}}/>}
					onClick={toggleContext}
				>
					Список покупок
				</PanelHeaderContent>
			</PanelHeader>
			<PanelHeaderContext opened={isOpened} onClose={toggleContext}>
				<List>
					{
						!deleteMode
						&&
						<Cell
							before={<Icon28DeleteOutline />}
							onClick={() => {
								toggleContext();
								setDeleteMode(true);
							}}
						>
							Режим удаления
						</Cell>
					}
					{
						deleteMode
						&&
							<Cell
								before={<Icon28DoneOutline />}
								onClick={() => {
									toggleContext();
									setDeleteMode(false);
								}}
							>
								Режим выполнения
							</Cell>
					}
					<Cell
						before={<Icon28ShareExternalOutline />}
						onClick={() => {
							toggleContext();
							doApiFetch({
								method: 'POST',
								list: state.list
							})
						}}
					>
						Поделиться списком
					</Cell>
				</List>
			</PanelHeaderContext>
			{hash && banner}
			<FormLayout
				onSubmit={(e) => {
					e.preventDefault();
					dispatchList({type: 'SET_ITEM_TO_LIST'});
				}}
			>
				<Input type={'text'}
							 disabled={deleteMode}
							 placeholder={'Продукт, услуга, товар'}
							 value={state.item.title}
							 top={'Название'}
							 required={true}
							 maxLength={20}
							 status={state.validate?.title?.status}
							 bottom={state.validate?.title?.message ? state.validate?.title?.message : `${state.item.title.length} из 20`}
							 onChange={(e) => {
								 dispatchList({
									 type: 'SET_TITLE',
									 payload: {
										 title: regexp(e.currentTarget.value),
										 validateForm: {title: validate(e)}
									 }
								 })
							 }}/>
			</FormLayout>
			<List>
				{shopList}
			</List>
			<InfoSnackbar/>
		</Panel>
	)
}