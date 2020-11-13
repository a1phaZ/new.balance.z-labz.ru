import React, {createContext, useReducer} from 'react';
import {
	SET_ACCOUNT,
	SET_ACCOUNTS,
	SET_ACTIVE_PANEL,
	SET_ACTIVE_VIEW,
	SET_BUDGET,
	SET_BUDGETS, SET_DATE,
	SET_EDITED_ITEM,
	SET_ERROR, SET_HISTORY_BACK,
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
	currentDate: new Date(),
	history: []
}

const reducer = (state, action) => {
	switch (action.type) {
		case SET_ACTIVE_VIEW: {
			if (action.payload.view === state.activeView && action.payload.panel === state.activePanel) {
				window.history.replaceState({activeView: state.activeView, activePanel: state.activePanel}, `${state.activeView}.${state.activePanel}`, window.location.search);
				return {
					...state
				}
			}
			window.history.pushState({activeView: action.payload.view, activePanel: action.payload.panel}, `${action.payload.view}.${action.payload.panel}`, window.location.search);
			return {
				...state,
				activeView: action.payload.view,
				activePanel: action.payload.panel,
				history: [...state.history, {activeView: action.payload.view, activePanel: action.payload.panel}]
			}
		}
		case SET_ACTIVE_PANEL: {
			window.history.replaceState({activeView: state.activeView, activePanel: action.payload.panel}, `${state.activeView}.${action.payload.panel}`, window.location.search);
			return {
				...state,
				activePanel: action.payload.panel,
				history: [...state.history, {activeView: state.activeView, activePanel: action.payload.panel}]
			}
		}
		case SET_HISTORY_BACK: {
			const backEl = state.history[state.history.length-2];
			const historyState = action.payload?.state;
			if (historyState) {
				return {
					...state,
					activeView: historyState.activeView ? historyState.activeView : 'home',
					activePanel: historyState.activePanel ? historyState.activePanel : 'home',
					modal: historyState.modal ? historyState.modal : null,
					popout: historyState.popout ? historyState.popout : null,
					history: [{activeView: historyState.activeView ? historyState.activeView : 'home', activePanel: historyState.activePanel ? historyState.activePanel : 'home'}],
				}
			}
			if (!backEl) {
				return {
					...state,
					activeView: 'home',
					activePanel: 'home',
					history: [{activeView: 'home', activePanel: 'home'}]
				}
			} else {
				const newHistory = state.history;
				newHistory.pop();
				return {
					...state,
					activeView: backEl.activeView,
					activePanel: backEl.activePanel,
					history: [...newHistory]
				}
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
			if (action.payload.popout) {
				window.history.pushState({popout: null}, `popout`, window.location.search);
			} else {
				window.history.replaceState({activeView: state.activeView, activePanel: state.activePanel}, `${state.activeView}.${state.activePanel}`, window.location.search);
			}
			return {
				...state,
				popout: action.payload.popout
			}
		}
		case SET_MODAL: {
			if (action.payload.modal) {
				window.history.pushState({modal: action.payload.modal}, `modal.${action.payload.modal}`, window.location.search);
			} else {
				window.history.replaceState({activeView: state.activeView, activePanel: state.activePanel}, `${state.activeView}.${state.activePanel}`, window.location.search);
			}
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