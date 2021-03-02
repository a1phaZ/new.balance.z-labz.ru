import React from "react";
import currency from "../../services/currency";

export default ({accounts}) => {
	return accounts.map(item => {
		return (<option key={item._id} value={item._id}>{item.title} ({currency(item.sum)})</option>)
	});
}