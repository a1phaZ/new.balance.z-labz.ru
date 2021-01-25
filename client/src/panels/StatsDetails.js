import React from 'react';
import {Footer, Panel, PanelHeader, PanelHeaderBack} from "@vkontakte/vkui";
import sort from "../handlers/sort";
import mapRichCell from "../handlers/mapRichCell";
import InfoSnackbar from "../components/InfoSnackbar";
import {SET_HISTORY_BACK} from "../state/actions";

export default ({id, itemsList = [], dispatch, title}) => {
    const itemsListView = itemsList.sort(sort).map(mapRichCell({dispatch, tagsShow: false}));
    return (
        <Panel id={id} >
            <PanelHeader
              left={
                <PanelHeaderBack onClick={() => {
                  dispatch({type: SET_HISTORY_BACK});
                }}/>
              }
            >
                {title}
            </PanelHeader>
            {itemsListView}
          {itemsListView.length === 0 && <Footer>Нет данных для отображения</Footer>}
          <InfoSnackbar/>
        </Panel>
    )
}