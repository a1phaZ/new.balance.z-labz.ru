import React, {useEffect, useState} from 'react';
import {
    Cell,
    Footer,
    Group,
    List,
    Panel,
    PanelHeader,
    PanelHeaderContent,
    PanelHeaderContext, RichCell
} from "@vkontakte/vkui";
import MonthSwitch from "../components/MonthSwitch";
import mapStats from "../handlers/mapStats";
import SearchForm from "../components/SearchForm";
import Icon16Dropdown from "@vkontakte/icons/dist/16/dropdown";
import {SET_ACTIVE_VIEW, SET_TOGGLE_CONTEXT} from "../state/actions";
import Icon28MarketAddBadgeOutline from "@vkontakte/icons/dist/28/market_add_badge_outline";
import Icon28MoneyTransfer from "@vkontakte/icons/dist/28/money_transfer";
import currency from "../handlers/currency";

const getTagsListItemsFromAccount = (array) => {
    const tagsListItems = {};
    array.forEach((account) => {
        const {operations} = account;
        operations.forEach(operation => {
            const {tags} = operation;
            if (tags.length === 0) {
                if (!tagsListItems['Без тега']) {
                    tagsListItems['Без тега'] = [operation]
                } else {
                    tagsListItems['Без тега'] = [...tagsListItems['Без тега'], operation];
                }
            } else {
                tags.forEach(tag => {
                    if (!tagsListItems[tag]) {
                        tagsListItems[tag] = [operation];
                    } else {
                        tagsListItems[tag] = [...tagsListItems[tag], operation];
                    }
                })
            }
        })
    });
    return tagsListItems
}

const getTagsListItemsView = (array, dispatch, setTagsItemsList) => {
    let tagsListItemView = [];

    const tagsListItemsfromAccount = getTagsListItemsFromAccount(array);

    for (const [key, value] of Object.entries(getTagsListItemsFromAccount(array))) {
        const outSum = value.reduce((prev, curr) => {
            if (!curr.income) {
                return prev + curr.sum
            } else {
                return prev
            }
        }, 0);
        const view = (
            <RichCell
                key={key}
                multiline
                caption={`Кол-во: ${(value.length)}`}
                after={currency(outSum)}
                data-title={key}
                onClick={(e) => {
                    setTagsItemsList(tagsListItemsfromAccount[e.currentTarget.dataset.title]);
                    dispatch({type: SET_ACTIVE_VIEW, payload: {view: 'stats', panel: 'details'}});
                }}
            >
                {key !== 'empty' ? key : 'Без тега'}
            </RichCell>
        )
        tagsListItemView = [...tagsListItemView, view]
    }
    return tagsListItemView;
}

export default ({id, accounts, context, onRefresh, dispatch, setTagsItemsList}) => {
    const [operations, setOperations] = useState(() => {
        return accounts
            .map(item => item.operations)
            .flat()
            .filter(({income}) => !income)
            .sort((a, b) => a.title.localeCompare(b.title))
    });
    const [isOpened, setIsOpened] = useState(false);
    const [groupedBy, setGroupedBy] = useState('tags');
    const [searchStr, setSearchStr] = useState('');
    const [filteredItems, setFilteredItems] = useState(() => operations);
    const reducer = (prev, curr) => {
        if (prev[prev.length - 1]?.title === curr.title) {
            const prevItem = prev[prev.length - 1];
            prevItem.sum = prevItem.sum + curr.sum;
            prevItem.quantity += curr.quantity;
            const array = [...prev.slice(0, prev.length - 1), prevItem];
            return [...array];
        } else {
            return [...prev, {title: curr.title, sum: curr.sum, quantity: curr.quantity}];
        }
    }

    const tagsListItemView = getTagsListItemsView(accounts, dispatch, setTagsItemsList);

    const accountItemsList = filteredItems
        .reduce(reducer, [])
        .map(mapStats());

    useEffect(() => {
        setIsOpened(context);
    }, [context]);

    useEffect(() => {
        const items = accounts
            .map(item => item.operations)
            .flat()
            .filter(({income}) => !income)
            .sort((a, b) => a.title.localeCompare(b.title));
        setOperations(items);
        setFilteredItems(items);
    }, [accounts]);

    useEffect(() => {
        if (searchStr === '') {
            setFilteredItems(accounts
                .map(item => item.operations)
                .flat()
                .filter(({income}) => !income)
                .sort((a, b) => a.title.localeCompare(b.title))
            );
        } else {
            setFilteredItems(accounts
                .map(item => item.operations)
                .flat()
                .filter(({income}) => !income)
                .sort((a, b) => a.title.localeCompare(b.title))
                .filter(({title}) => title.toLowerCase().indexOf(searchStr.toLowerCase()) > -1));
        }
    }, [searchStr, accounts]);

    const onSearch = (str) => {
        setSearchStr(str);
    }

    const toggleContext = () => {
        dispatch({type: SET_TOGGLE_CONTEXT, payload: {context: !isOpened}});
    }

    return (
        <Panel id={id}>
            <PanelHeader>
                <PanelHeaderContent
                    aside={<Icon16Dropdown style={{transform: `rotate(${isOpened ? '180deg' : '0'})`}}/>}
                    onClick={() => {
                        toggleContext();
                    }}
                >
                    Сводка
                </PanelHeaderContent>
            </PanelHeader>
            <PanelHeaderContext opened={isOpened} onClose={toggleContext}>
                <List>
                    <Cell
                        before={<Icon28MarketAddBadgeOutline/>}
                        onClick={() => {
                            setGroupedBy('title')
                            toggleContext();
                        }}
                    >
                        По названию
                    </Cell>
                    <Cell
                        before={<Icon28MoneyTransfer/>}
                        onClick={() => {
                            setGroupedBy('tags')
                            toggleContext();
                        }}
                    >
                        По тэгам
                    </Cell>
                </List>
            </PanelHeaderContext>
            <MonthSwitch onRefresh={onRefresh}/>
            <SearchForm onSearch={onSearch}/>
            <Group>
                {groupedBy === 'title' ? accountItemsList : tagsListItemView}
                {accountItemsList.length === 0 && <Footer>Нет данных для отображения</Footer>}
            </Group>
        </Panel>
    )
}