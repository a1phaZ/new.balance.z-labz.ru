import React from 'react';
import {Panel, PanelHeader} from "@vkontakte/vkui";
import sort from "../handlers/sort";
import mapRichCell from "../handlers/mapRichCell";

export default ({id, itemsList = [], dispatch}) => {
    const itemsListView = itemsList.sort(sort).map(mapRichCell(dispatch));
    return (
        <Panel id={id} >
            <PanelHeader >
                {itemsList.length}
            </PanelHeader>
            {itemsListView}
        </Panel>
    )
}