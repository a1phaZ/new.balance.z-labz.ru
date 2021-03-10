import React, {Component} from 'react';
import {bindActionCreators} from "redux";
import {Snackbar} from "@vkontakte/vkui";
import {Icon24ErrorCircle} from "@vkontakte/icons";
import {unsetMessage} from "../store/api/actions";

const {connect} = require("react-redux");

class InfoSnackbar extends Component {
	render() {
		const {error, unsetMessage} = this.props;
		return (
			error ?
			<Snackbar
				onClose={unsetMessage}
				before={<Icon24ErrorCircle style={{color: 'var(--destructive)'}}/>}
			>
				{error.message}
			</Snackbar> :
				null
		)
	}
}

const mapStateToProps = (state) => {
	return {
		error: state.api.error,
		state: state
	}
}

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
		...bindActionCreators({unsetMessage}, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(InfoSnackbar);
