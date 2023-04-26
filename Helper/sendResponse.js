exports.sendSuccessMessage = (message, data, res) => {
	let success_msg = {
		"statusCode": 200,
		"message": message,
		"data": data || {}
	};
	return res.status(200).send(success_msg);
};
exports.sendErrorMessage = (message, data, res) => {
	let error_message = {
		"statusCode": 400,
		"message": message,
		"responseType": data
	};
	return res.status(400).send(error_message);
};
exports.sendErrorMessageBlock = (message, data, res) => {
	let error_message = {
		"statusCode": message.statusCode,
		"message": message.message,
		"responseType": data
	};
	return res.status(message.statusCode).send(error_message);
};
exports.executeMethod = async (controllerMethod, payload, req, res) => {
	try {
		let data = await controllerMethod(payload, req,res);
		return this.sendSuccessMessage("success", data, res);
	} catch (err) {
		console.log(err);
		return this.sendErrorMessage(err.isJoi ? err.details[0].message : err.message, {}, res);
	}
};