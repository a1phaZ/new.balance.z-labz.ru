import React, {useRef} from 'react';
import {FormLayout, Search} from "@vkontakte/vkui";

export default ({onSearch}) => {

	const searchRef = useRef(null);

	return (
		<>
		<FormLayout
			onSubmit={(e) => {
				e.preventDefault();
				searchRef.current.focus();
			}}
		>
			<Search
				onChange={(e) => {
					onSearch(e.currentTarget.value)
				}}/>
		</FormLayout>
		<input type={'radio'} style={{position: 'absolute', height: '0', width: '0', top: '0', left: '0'}} ref={searchRef}/>
		</>
	)
}
