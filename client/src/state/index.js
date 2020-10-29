import React, {createContext, useReducer} from 'react';
import {
	SET_ACCOUNT,
	SET_ACCOUNTS,
	SET_ACTIVE_PANEL,
	SET_ACTIVE_VIEW,
	SET_BUDGET,
	SET_BUDGETS, SET_DATE,
	SET_EDITED_ITEM,
	SET_ERROR,
	SET_MODAL,
	SET_POPOUT,
	SET_SUCCESS_MESSAGE
} from './actions';

const initialState = {
	accounts: [],
	budgets: [],
	account: null,
	budget: null,
	modal: null,
	successMessage: null,
	error: null,
	activeView: 'home',
	activePanel: 'home',
	popout: null,
	editedItem: null,
	currentDate: new Date()
}

const reducer = (state, action) => {
	switch (action.type) {
		case SET_ACTIVE_VIEW: {
			return {
				...state,
				activeView: action.payload.view,
				activePanel: action.payload.panel,
			}
		}
		case SET_ACTIVE_PANEL: {
			return {
				...state,
				activePanel: action.payload.panel
			}
		}
		case SET_ACCOUNTS: {
			const accountId = state.account?._id;
			const account = !accountId ? accountId : action.payload.accounts.find(item => {
				return item._id === accountId;
			})
			return {
				...state,
				accounts: action.payload.accounts,
				account: account
			}
		}
		case SET_BUDGETS: {
			const budgetId = state.budget?._id;
			const budget = !budgetId ? budgetId : action.payload.budgets.find(item => item._id === budgetId)
			return {
				...state,
				budgets: action.payload.budgets,
				budget: budget
			}
		}
		case SET_ACCOUNT: {
			const {payload: {id}} = action;
			return {
				...state,
				account: state.accounts.find(item => {
					return item._id === id;
				})
			}
		}
		case SET_BUDGET: {
			const {payload: {id}} = action;
			return {
				...state,
				budget: !id ? id : state.budgets.find(item => item._id === id)
			}
		}
		case SET_EDITED_ITEM: {
			return {
				...state,
				editedItem: action.payload.item
			}
		}
		case SET_POPOUT: {
			return {
				...state,
				popout: action.payload.popout
			}
		}
		case SET_MODAL: {
			return {
				...state,
				modal: action.payload.modal
			}
		}
		case SET_SUCCESS_MESSAGE: {
			return {
				...state,
				successMessage: action.payload.message
			}
		}
		case SET_ERROR: {
			return {
				...state,
				error: action.payload.error
			}
		}
		case SET_DATE: {
			return {
				...state,
				currentDate: new Date(action.payload.date)
			}
		}
		default:
			return state;
	}
}

export const State = createContext();

export const StateProvider = ({children}) => {
	const value = useReducer(reducer, initialState);
	return (
		<State.Provider value={value}>
			{children}
		</State.Provider>
	)
}