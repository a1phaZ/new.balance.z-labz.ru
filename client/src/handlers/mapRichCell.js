import React from 'react';
import {Caption, RichCell} from "@vkontakte/vkui";
import {format} from "date-fns";
import ruLocale from "date-fns/locale/ru";
import currency from "./currency";
import {SET_EDITED_ITEM, SET_MODAL} from "../state/actions";
import Color from "../components/Color";

export default function mapRichCell({dispatch, tagsShow = true}) {
	return (item, index) => {
		if (item?.caption) {
			return (
				<Caption level="2" weight="semibold" caps
								 key={index}>
					{format(new Date(item?.date), 'dd MMMM yyyy ', {locale: ruLocale})}
					<br/>
					{item?.income && item?.outcome ? ' [ ' : null}
					<Color value={item?.income} color={'green'}/>
					{item?.income && item?.outcome ? ' | ' : null}
					<Color value={item?.outcome} color={'red'}/>
					{item?.income && item?.outcome ? ' ]' : null}
				</Caption>
			)
		}

		const tags = item?.tags.filter(tag => !!tag.length).map(
			(tag, index) =>
				<span key={index} style={{
					marginLeft: '5px',
					marginRight: '5px',
					marginBottom: '5px',
					maxWidth: '100%',
					overflow: 'hidden',
					overflowWrap: 'normal',
					// background: 'var(--counter_secondary_background)',
					// color: 'var(--counter_secondary_text)',
					// padding: '5px'
				}}><b>{tag}</b></span>
		);
		let caption;
		let after;
		if (tagsShow) {
			caption = item?.tags.length !== 0 && <div style={{display: 'flex', flexWrap: 'wrap'}}><span>Теги:</span> {tags}</div>
			after = item?.income ? currency(item?.sum) : currency(-1 * item?.sum)
		} else {
			caption = <div style={{display: 'flex', flexWrap: 'wrap'}}>{format(new Date(item?.date), 'dd MMMM yyyy ', {locale: ruLocale})}</div>
			after = currency(item?.sum);
		}
		return (
			<RichCell
				key={index}
				multiline
				caption={caption}
				after={after}
				data-id={item?._id}
				onClick={() => {
					dispatch({type: SET_EDITED_ITEM, payload: {item: item}});
					dispatch({type: SET_MODAL, payload: {modal: 'add-money'}});
				}}
			>
				{item?.title}
			</RichCell>
		)
	};
}