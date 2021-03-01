import React from 'react';
import currency from "../services/currency";

export default ({color = 'black', value}) => {
	if (!value) return null;
	return (
		<span style={{color: color}}>
			{currency(value)}
		</span>
	)
}