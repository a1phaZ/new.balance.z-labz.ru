import React, {useEffect, useReducer, useState} from 'react';
import bridge from "@vkontakte/vk-bridge";
import {
	Banner,
	Button,
	FixedLayout,
	Footer,
	FormLayout,
	Input,
	List,
	Panel,
	PanelHeader,
	PanelHeaderContent,
	PanelHeaderContext
} from "@vkontakte/vkui";
import {SET_TOGGLE_CONTEXT} from "../state/actions";
import InfoSnackbar from "../components/InfoSnackbar";
import regexp from "../handlers/regexp";
import validate from "../handlers/validate";
import Icon16Dropdown from "@vkontakte/icons/dist/16/dropdown";
import useApi from "../handlers/useApi";
import ShopList from "../components/ShopList";
import BackButton from "../components/BackButton";
import ShareButton from "../components/ShareButton";
import ShopListDeleteOptionsList from "../components/ShopListDeleteOptionsList";

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
			const {list} = action.payload;
			list.sort((x, y) => {
				if (x.id>y.id) return 1;
				if (x.id<y.id) return -1;
				return 0;
			});
			const index = list[list.length - 1] ? list[list.length - 1].id : 1;
			return {
				...state,
				list: list,
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
			const {list} = state;
			list.sort((x, y) => {
				if (x.id>y.id) return 1;
				if (x.id<y.id) return -1;
				return 0;
			});
			const newIndex = list[list.length - 1] ? list[list.length - 1].id : 1
			item.id = item.id || newIndex + 1;
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
		case 'DELETE_ALL': {
			return {
				...state,
				list: []
			}
		}
		case 'DELETE_DONE': {
			return {
				...state,
				list: state.list.filter(({done}) => !done)
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
			<ShopList
				list={state.list}
				dispatch={dispatch}
				deleteMode={deleteMode}
				setShopListItemTitle={setShopListItemTitle}
				dispatchList={dispatchList}
				shopListFromServer={shopListFromServer}
				setShopList={setShopList}
			/>
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
	}, [response, dispatchList]);
	
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
	
	useEffect(() => {
		if (!deleteMode) return;
		if (state.list.length === 0) {
			setDeleteMode(false);
		}
	}, [deleteMode, state.list.length])
	
	return (
		<Panel id={id}>
			<PanelHeader
				left={
					<>
						<BackButton dispatch={dispatch}/>
						<ShareButton
							shareClick={
								() => {
									doApiFetch({
										method: 'POST',
										list: state.list
									})
								}
							}
						/>
					</>
				}
			>
				<PanelHeaderContent
					aside={state.list.length !== 0 ? <Icon16Dropdown style={{transform: `rotate(${isOpened ? '180deg' : '0'})`}}/> : null}
					onClick={state.list.length !== 0 ? toggleContext : null}
				>
					Список покупок
				</PanelHeaderContent>
			</PanelHeader>
			<PanelHeaderContext opened={isOpened} onClose={toggleContext}>
				<List>
					<ShopListDeleteOptionsList
						deleteOne={() => {
							toggleContext();
							setDeleteMode(true);
						}}
						deleteDone={() => {
							toggleContext();
							if (state.list.filter(({done}) => !done).length === 0) {
								dispatchList({type: 'DELETE_ALL'});
								setShopList([]);
							} else {
								dispatchList({type: 'DELETE_DONE'});
							}
							
						}}
						deleteAll={() => {
							toggleContext();
							dispatchList({type: 'DELETE_ALL'});
							setShopList([]);
						}}
					/>
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
			<List style={{paddingBottom: deleteMode ? 60 : 0}}>
				{shopList}
			</List>
			{
				deleteMode &&
				<FixedLayout filled={true} vertical={'bottom'}>
					<FormLayout>
						<Button type={'button'} size={'xl'} onClick={() => {
							toggleContext();
							setDeleteMode(false);
						}}>
							Завершить удаление
						</Button>
					</FormLayout>
				</FixedLayout>
			}
			<InfoSnackbar/>
		</Panel>
	)
}