import React, {useRef, useState, useEffect} from 'react';
import {FormLayout, Search} from "@vkontakte/vkui";

export default ({onSearch}) => {

	const [searchStr, setSearchStr] = useState('');
	const searchRef = useRef(null);

	useEffect(() => {
		onSearch(searchStr);
	}, [searchStr, onSearch])

	return (
		<>
		<FormLayout
			onSubmit={(e) => {
				e.preventDefault();
				searchRef.current.focus();
			}}
		>
			<Search
				value={searchStr}
				onChange={(e) => {
					setSearchStr(e.currentTarget.value.substring(0, 20))
				}}
			/>
		</FormLayout>
		<input type={'radio'} style={{position: 'absolute', height: '0', width: '0', top: '0', left: '0'}} ref={searchRef}/>
		</>
	)
}
