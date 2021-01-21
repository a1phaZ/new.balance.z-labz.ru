import React, {useEffect, useReducer} from 'react';
import useApi from "../../handlers/useApi";
import {Button, FormLayout, Input, Select} from "@vkontakte/vkui";
import validate from "../../handlers/validate";
import AccountsOptionsList from "../AccountsOptionsList";
import {format} from "date-fns";
import currency from "../../handlers/currency";
import regexp from "../../handlers/regexp";
import {SET_ACCOUNTS, SET_BUDGETS} from "../../state/actions";

const initialState = {
    to: '',
    from: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    title: '',
    price: 0
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'CHANGE_STATE':
            const {payload: {validateForm, ...payload}} = action;
            return {
                ...state,
                ...payload,
                validate: {...state.validate, ...validateForm}
            }
        default:
            return state;
    }
}

export default ({accounts, dispatch}) => {
    const [{response}, doApiFetch] = useApi('/money-box/transfer');

    const [state, dispatchForm] = useReducer(reducer, initialState);

    useEffect(() => {
        if (!response) return;
        dispatch({type: SET_ACCOUNTS, payload: {accounts: response?.accounts ? response?.accounts : []}});
        dispatch({type: SET_BUDGETS, payload: {budgets: response?.budgets ? response?.budgets : []}});
    }, [response, dispatch]);

    const accountFrom = accounts.find((item) => item._id === state.from);

    return (
        <FormLayout
            onSubmit={(e) => {
               e.preventDefault();
               doApiFetch({
                   method: 'POST',
                   date: state.date,
                   title: state.title,
                   to: state.to,
                   from: state.from,
                   price: state.price
               })
            }}
        >
            <Input type={'date'}
                   top={'Дата'}
                   value={state.date}
                   required={true}
                   min={'2015-01-01'}
                   max={format(new Date(), 'yyyy-MM-dd')}
                   onChange={(e) => {
                       dispatchForm({
                           type: 'CHANGE_STATE',
                           payload: {date: e.currentTarget.value, validateForm: {date: validate(e)}}
                       })
                   }}
                   status={state.validate?.date?.status}
                   bottom={state.validate?.date?.message}
            />

            <Select top={'Счет списания'}
                    placeholder={'Выберите счет'}
                    onChange={(e) => {
                        dispatchForm({
                            type: 'CHANGE_STATE',
                            payload: {from: e.currentTarget.value, validateForm: {from: validate(e)}}
                        })
                    }}
                    defaultValue={state.from} required={true}
                    status={state.validate?.from?.status}
                    bottom={state.validate?.from?.message}
            >
                <AccountsOptionsList accounts={accounts} />
            </Select>
            <Select top={'Счет зачисления'}
                    placeholder={'Выберите счет'}
                    onChange={(e) => {
                        dispatchForm({
                            type: 'CHANGE_STATE',
                            payload: {to: e.currentTarget.value, validateForm: {to: validate(e)}}
                        })
                    }}
                    defaultValue={state.to} required={true}
                    status={state.validate?.to?.status}
                    bottom={state.validate?.to?.message}
            >
                <AccountsOptionsList accounts={accounts} />
            </Select>
            <Input type={'text'}
                   placeholder={'Продукт, услуга, товар'}
                   value={state.title}
                   top={'Название'}
                   required={true}
                   maxLength={20}
                   status={state.validate?.title?.status}
                   bottom={state.validate?.title?.message ? state.validate?.title?.message : `${state.title.length} из 20`}
                   onChange={(e) => {
                       dispatchForm({
                           type: 'CHANGE_STATE',
                           payload: {
                               title: regexp(e.currentTarget.value),
                               validateForm: {title: validate(e)}
                           }
                       })
                   }}/>
            <Input type={'number'}
                   placeholder={currency(0)}
                   pattern={'[0-9]+([,\\.][0-9]+)?'}
                   top={'Цена'}
                   inputMode="decimal"
                   max={accountFrom?.sum || 99999999}
                   min={0}
                   step={0.0001}
                   status={state.validate?.price?.status}
                   bottom={state.validate?.price?.message}
                   value={state.price}
                   required={true}
                   onChange={(e) => {
                       dispatchForm({
                           type: 'CHANGE_STATE',
                           payload: {price: e.currentTarget.value.replace(/[^\d.]*/, ''), validateForm: {price: validate(e)}}
                       })
                   }}
            />
            <Button size={'xl'}>
                {`Перевести ${currency(state.price)}`}
            </Button>
        </FormLayout>
    )
}