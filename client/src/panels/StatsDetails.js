import React, {useState, useEffect} from 'react';
import {Div, Footer, Panel, PanelHeader, PanelHeaderBack} from "@vkontakte/vkui";
import sort from "../handlers/sort";
import mapRichCell from "../handlers/mapRichCell";
import InfoSnackbar from "../components/InfoSnackbar";
import {SET_HISTORY_BACK} from "../state/actions";
import SearchForm from "../components/SearchForm";
import {ArrayToObjectWithDate, ObjectToArrayWithDate} from "../handlers/formatingArrayWithDate";

export default ({id, itemsList = [], dispatch, title, showSearch = true, category}) => {
    const [filteredItems, setFilteredItems] = useState(() => itemsList);
    const [searchStr, setSearchStr] = useState('');
    const onSearch = (searchStr) => {
        setSearchStr(searchStr);
    }
  const indexAr = ArrayToObjectWithDate(filteredItems);

  const accountItemsListArray = ObjectToArrayWithDate(indexAr);

    let itemsListView = [];
    if (category === 'tags') {
        itemsListView = accountItemsListArray.sort(sort).map(mapRichCell({dispatch, tagsShow: false}));
    }
    if (category === 'items') {
      itemsListView = accountItemsListArray.sort(sort).map(mapRichCell({dispatch}));
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
            <Div>
              {itemsListView}
              {itemsListView.length === 0 && <Footer>Нет данных для отображения</Footer>}
            </Div>
          <InfoSnackbar/>
        </Panel>
    )
}