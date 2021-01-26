import React, {useEffect, useState} from 'react';
import {
    Cell,
    Footer,
    Group, Header,
    List,
    Panel,
    PanelHeader,
    PanelHeaderContent,
    PanelHeaderContext
} from "@vkontakte/vkui";
import MonthSwitch from "../components/MonthSwitch";
import mapStats from "../handlers/mapStats";
import SearchForm from "../components/SearchForm";
import Icon16Dropdown from "@vkontakte/icons/dist/16/dropdown";
import {SET_TOGGLE_CONTEXT} from "../state/actions";
import Icon28MarketAddBadgeOutline from "@vkontakte/icons/dist/28/market_add_badge_outline";
import Icon28MoneyTransfer from "@vkontakte/icons/dist/28/money_transfer";
import {getTagsListItemsFromAccount, getTagsListItemsView} from "../handlers/getTagsListFromAccounts";

export default ({id, accounts, context, onRefresh, dispatch, setSelectedTagTitle, groupedByStats, setGroupedByStats, setSelectedItemTitle}) => {
    const [operations, setOperations] = useState(() => {
        return accounts
            .map(item => item.operations)
            .flat()
            .filter(({income}) => !income)
            .sort((a, b) => a.title.localeCompare(b.title))
    });
    const [isOpened, setIsOpened] = useState(false);
    const [searchStr, setSearchStr] = useState('');
    const [filteredItems, setFilteredItems] = useState(() => operations);
    const [filteredTags, setFilteredTags] = useState([]);
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

    const tagsListItemView = getTagsListItemsView(filteredTags, dispatch, setSelectedTagTitle);

    const accountItemsList = filteredItems
        .reduce(reducer, [])
        .map(mapStats({dispatch, setSelectedItemTitle}));

    useEffect(() => {
        setIsOpened(context);
    }, [context]);

    useEffect(() => {
        if (groupedByStats === 'title') {
            const items = accounts
              .map(item => item.operations)
              .flat()
              .filter(({income}) => !income)
              .sort((a, b) => a.title.localeCompare(b.title));
            setOperations(items);
            setFilteredItems(items);
        }

        if (groupedByStats === 'tags') {
            setFilteredTags(getTagsListItemsFromAccount(accounts));
        }
    }, [accounts, groupedByStats]);

    useEffect(() => {
        if (searchStr === '') {
            if (groupedByStats === 'title') {
                setFilteredItems(accounts
                  .map(item => item.operations)
                  .flat()
                  .filter(({income}) => !income)
                  .sort((a, b) => a.title.localeCompare(b.title))
                );
            }
            if (groupedByStats === 'tags') {
                setFilteredTags(getTagsListItemsFromAccount(accounts));
            }
        } else {
            if (groupedByStats === 'title') {
                setFilteredItems(accounts
                  .map(item => item.operations)
                  .flat()
                  .filter(({income}) => !income)
                  .sort((a, b) => a.title.localeCompare(b.title))
                  .filter(({title}) => title.toLowerCase().indexOf(searchStr.toLowerCase()) > -1));
            }
            if (groupedByStats === 'tags') {
                const preparedTagsArray = getTagsListItemsFromAccount(accounts);
                let filteredTags = {};
                const keys = Object.keys(preparedTagsArray);
                keys.forEach(key => {
                    if (key.toLowerCase().indexOf(searchStr.toLowerCase()) > -1) {
                        filteredTags[key] = preparedTagsArray[key];
                    }
                });
                setFilteredTags(filteredTags);
            }
        }
    }, [searchStr, accounts, groupedByStats]);

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
                    <Header mode="secondary">Сгруппировано по {groupedByStats === 'title' ? 'названию' : 'тэгам'}</Header>
                    <Cell
                        before={<Icon28MarketAddBadgeOutline/>}
                        onClick={() => {
                            setGroupedByStats('title')
                            toggleContext();
                        }}
                    >
                        По названию
                    </Cell>
                    <Cell
                        before={<Icon28MoneyTransfer/>}
                        onClick={() => {
                            setGroupedByStats('tags')
                            toggleContext();
                        }}
                    >
                        По тэгам
                    </Cell>
                </List>
            </PanelHeaderContext>
            <MonthSwitch onRefresh={onRefresh}/>
            <SearchForm onSearch={onSearch}/>
            <Group
              header={<Header mode="secondary">Сгруппировано по {groupedByStats === 'title' ? 'названию' : 'тэгам'}</Header>}
              separator="show"
            >
                {groupedByStats === 'title' ? accountItemsList : tagsListItemView}
                {accountItemsList.length === 0 && <Footer>Нет данных для отображения</Footer>}
            </Group>
        </Panel>
    )
}