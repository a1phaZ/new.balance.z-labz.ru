import React, {createContext, useReducer} from 'react';
import {
	SET_ACCOUNT,
	SET_ACCOUNTS,
	SET_ACTIVE_PANEL,
	SET_ACTIVE_VIEW,
	SET_ERROR,
	SET_MODAL, SET_POPOUT,
	SET_SUCCESS_MESSAGE
} from './actions';

const initialState = {
	accounts: [],
	account: null,
	modal: null,
	successMessage: null,
	error: null,
	activeView: 'home',
	activePanel: 'home',
	popout: null
}

const reducer = (state, action) => {
	switch (action.type) {
		case SET_ACTIVE_VIEW: {
			return {
				...state,
				activeView: action.payload.view,
				activePanel: action.payload.panel
			}
		}
		case SET_ACTIVE_PANEL: {
			return {
				...state,
				activePanel: action.payload.panel
			}
		}
		case SET_ACCOUNTS: {
			return {
				...state,
				accounts: action.payload.accounts
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