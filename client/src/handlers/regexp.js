// const ranges = [
// 	'\ud83c[\udf00-\udfff]', // U+1F300 to U+1F3FF
// 	'\ud83d[\udc00-\ude4f]', // U+1F400 to U+1F64F
// 	'\ud83d[\ude80-\udeff]'  // U+1F680 to U+1F6FF
// ]
//
// const regexp = new RegExp(ranges.join('|'), 'g');
export default (str) => {
	return str.replace(/^\s*/g, '').replace(/\s{2,}/g, ' ').replace(/<% RGI_Emoji %>|\p{Emoji_Presentation}|\p{Emoji}\uFE0F|\p{Emoji_Modifier_Base}/gu, '');
}