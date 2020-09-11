const dataToJson = async (data) => {
	return {
		success: true,
		data: data,
		error: null,
	};
}

const errorToJson = async (error) => {
	return {
		success: false,
		data: null,
		error: error
	};
}

const toJson = {
	dataToJson,
	errorToJson
}

module.exports = toJson;