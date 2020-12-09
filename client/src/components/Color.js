import React from 'react';
import currency from "../handlers/currency";

export default ({color = 'black', value = 0}) => {
	return (
		<span style={{color: color}}>
			{currency(value)}
		</span>
	)
}