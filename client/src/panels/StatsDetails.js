import React, {useState, useEffect} from 'react';
import {Footer, Panel, PanelHeader, PanelHeaderBack, RichCell} from "@vkontakte/vkui";
import sort from "../handlers/sort";
import mapRichCell from "../handlers/mapRichCell";
import InfoSnackbar from "../components/InfoSnackbar";
import {SET_EDITED_ITEM, SET_HISTORY_BACK, SET_MODAL} from "../state/actions";
import SearchForm from "../components/SearchForm";
import {format} from "date-fns";
import ruLocale from 'date-fns/locale/ru';
import currency from "../handlers/currency";

export default ({id, itemsList = [], dispatch, title, showSearch = true, category}) => {
    const [filteredItems, setFilteredItems] = useState(() => itemsList);
    const [searchStr, setSearchStr] = useState('');
    const onSearch = (searchStr) => {
        setSearchStr(searchStr);
    }
    let itemsListView = [];
    if (category === 'tags') {
        itemsListView = filteredItems.sort(sort).map(mapRichCell({dispatch, tagsShow: false}));
    }
    if (category === 'items') {
        itemsListView = filteredItems.sort(sort).map(item => {
            const caption = (quantity = 0, tags = []) => {
                return (
                    <div style={{display: 'flex', flexWrap: 'wrap'}}>
                        <p style={{margin: '0px 5px 0px 0px'}}>
                            <span style={{marginRight: '5px'}}>Кол-во: </span>
                            <span>{quantity.toFixed(3)}</span>
                        </p>
                        {
                            tags.length !== 0 &&
                            <>
                                <span style={{margin: '0px 5px 0px 0px'}}>|</span>
                                <p style={{margin: '0px 0px 0px 0px'}}>
                                    <span style={{marginRight: '5px'}}>Теги: </span>
                                    <span>{tags.join(', ')}</span>
                                </p>
                            </>
                        }
                    </div>
                )
            }
            return (
                <RichCell
                    key={item._id}
                    multiline
                    caption={caption(item?.quantity, item?.tags)}
                    after={currency(item?.sum.toFixed(2))}
                    data-id={item?._id}
                    onClick={() => {
                        dispatch({type: SET_EDITED_ITEM, payload: {item: item}});
                        dispatch({type: SET_MODAL, payload: {modal: 'add-money'}});
                    }}
                >
                    {format(new Date(item?.date), 'dd MMMM yyyy ', {locale: ruLocale})}
                </RichCell>
            )
        })
    }

    useEffect(() => {
        if (searchStr === '') {
            setFilteredItems(itemsList);
        } else {
            setFilteredItems(itemsList.filter(({title}) => title.toLowerCase().indexOf(searchStr.toLowerCase()) > -1));
        }
    }, [itemsList, searchStr]);

    return (
        <Panel id={id}>
            <PanelHeader
                left={
                    <PanelHeaderBack onClick={() => {
                        dispatch({type: SET_HISTORY_BACK});
                    }}/>
                }
            >
                {title}
            </PanelHeader>
            {showSearch && <SearchForm onSearch={onSearch}/>}
            {itemsListView}
            {itemsListView.length === 0 && <Footer>Нет данных для отображения</Footer>}
            <InfoSnackbar/>
        </Panel>
    )
}