import React from 'react';
import {RichCell} from "@vkontakte/vkui";
import currency from "./currency";
import {SET_ACTIVE_VIEW} from "../state/actions";

export const getAllTags = (array) => {
    return array
        .map(item => {
            return item.operations
        })
        .flat()
        .map(operation => {
            return operation.tags
        })
        .flat()
        .sort((a, b) => a.localeCompare(b))
        .reduce((prev, curr) => {
            if (prev[prev.length - 1] === curr) {
                return [...prev]
            } else {
                return [...prev, curr]
            }
        }, [])
}

export const getTagsListItemsFromAccount = (array) => {
    const tagsListItems = {};

    if (!Array.isArray(array)) {
        return array
    }

    array.forEach((account) => {
        const {operations} = account;
        operations.forEach(operation => {
            const {tags} = operation;
            // if (operation.income) return;
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

export const getTagsListItemsView = (array, dispatch, setSelectedTagTitle) => {
    let tagsListItemView = [];

    const tagsList = getTagsListItemsFromAccount(array);

    for (const [key, value] of Object.entries(tagsList)) {
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
                setSelectedTagTitle(e.currentTarget.dataset.title);
                dispatch({type: SET_ACTIVE_VIEW, payload: {view: 'stats', panel: 'details-tags'}});
            }}
          >
              {key !== 'empty' ? key : 'Без тега'}
          </RichCell>
        )
        tagsListItemView = [...tagsListItemView, view]
    }
    return tagsListItemView;
}