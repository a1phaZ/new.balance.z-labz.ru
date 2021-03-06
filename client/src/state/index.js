import React, {createContext, useReducer} from 'react';
import {
	SET_ACCOUNT,
	SET_ACCOUNTS,
	SET_ACTIVE_VIEW,
	SET_BUDGET,
	SET_BUDGETS,
	SET_DATE,
	SET_EDITED_ITEM,
	SET_ERROR,
	SET_HISTORY_BACK,
	SET_MODAL,
	SET_POPOUT,
	SET_SUCCESS_MESSAGE,
	SET_COLOR_SCHEME, SET_TOGGLE_CONTEXT
} from './actions';
// import {smoothScrollToTop} from "../handlers/smoothScrollToTop";

const initialState = {
	accounts: [],
	budgets: [],
	account: null,
	budget: null,
	modal: null,
	successMessage: null,
	error: null,
	activeView: 'init',
	activePanel: 'init',
	popout: null,
	editedItem: null,
	currentDate: new Date(),
	history: [],
	modalsHistory: [],
	popoutHistory: [],
	contextHistory: false,
	canClose: true,
	scheme: 'client_light',
	modalOpenTime: +new Date()
}

const reducer = (state, action) => {
	switch (action.type) {
		case SET_COLOR_SCHEME: {
			return {
				...state,
				scheme: action.payload.scheme
			}
		}
		case SET_ACTIVE_VIEW: {
			window.history.pushState(null, null);

			// console.log(document.documentElement.scrollTop, document.body.scrollTop);
			window.scrollTo(0, 0);
			// smoothScrollToTop();

			let history = state.history;
			if (history.length !== 0) {
				let lastHistoryState = history[history.length - 1];
				if (lastHistoryState.view === action.payload.view && lastHistoryState.panel === action.payload.panel) {
					return {
						...state
					}
				} else {
					return {
						...state,
						activeView: action.payload.view,
						activePanel: action.payload.panel,
						history: [...history, {view: action.payload.view, panel: action.payload.panel}],
						canClose: false,
						contextHistory: false,
						successMessage: null,
						error: null
					}
				}
			} else {
				return {
					...state,
					activeView: action.payload.view,
					activePanel: action.payload.panel,
					history: [...history, {view: action.payload.view, panel: action.payload.panel}],
					canClose: true,
					contextHistory: false,
					successMessage: null,
					error: null
				}
			}
		}
		case SET_HISTORY_BACK: {
			window.history.pushState(null, null);

			window.scrollTo(0, 0);
			// smoothScrollToTop();

			const backEl = state.history[state.history.length - 2];
			let popoutHistory = state.popoutHistory || [];
			let modalsHistory = state.modalsHistory || [];
			let contextHistory = state.contextHistory || false;

			if (popoutHistory.length !== 0) {
				const canClose = state.history.length <= 1;
				return {
					...state,
					popout: null,
					popoutHistory: [],
					canClose: canClose,
					editedItem: null
				}
			}

			if (!!contextHistory) {
				const canClose = state.history.length <= 1;
				return {
					...state,
					contextHistory: false,
					canClose: canClose,
					editedItem: null
				}
			}

			if (modalsHistory.length !== 0) {
				if (+new Date() - state.modalOpenTime < 700) {
					return {
						...state
					}
				}
				const canClose = state.history.length <= 1;
				return {
					...state,
					modal: null,
					modalsHistory: [],
					canClose: canClose,
					editedItem: null
				}
			}

			if (!backEl) {
				return {
					...state,
					activeView: 'home',
					activePanel: 'home',
					history: [],
					canClose: true,
					editedItem: null,
					successMessage: null,
					error: null
				}
			} else {
				const canClose = (backEl.view === 'home' && backEl.panel === 'home');
				const newHistory = state.history;
				newHistory.pop();
				return {
					...state,
					activeView: backEl.view,
					activePanel: backEl.panel,
					history: [...newHistory],
					editedItem: null,
					canClose: canClose,
					successMessage: null,
					error: null
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
			if (action.payload.alert) {
				window.history.pushState(null, null);
			}
			let history = state.history;
			let canClose = state.canClose;
			if (history.length !== 0 || action.payload.popout) {
				canClose = history.length === 1 && !action.payload.popout;
			} else {
				if (history.length === 0 && !action.payload.popout) {
					canClose = true
				}
			}
			return {
				...state,
				popout: action.payload.popout,
				popoutHistory: action.payload.popout ? [action.payload.popout] : [],
				canClose: canClose
			}
		}
		case SET_MODAL: {
			// window.history.pushState(null, null);
			let history = state.history;
			let canClose = state.canClose;
			if (history.length !== 0 || action.payload.modal) {
				canClose = history.length === 1 && !action.payload.modal;
			} else {
				if (history.length === 0 && !action.payload.modal) {
					canClose = true
				}
			}
			return {
				...state,
				modal: action.payload.modal,
				modalsHistory: action.payload.modal ? [action.payload.modal] : [],
				canClose: canClose,
				modalOpenTime: +new Date()
			}
		}
		case SET_TOGGLE_CONTEXT: {
			let history = state.history;
			let canClose = state.canClose;
			if (history.length !== 0 || action.payload.context) {
				canClose = history.length === 1 && !action.payload.context;
			} else {
				if (history.length === 0 && !action.payload.context) {
					canClose = true
				}
			}
			return {
				...state,
				// modal: action.payload.modal,
				contextHistory: action.payload.context,
				canClose: canClose
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