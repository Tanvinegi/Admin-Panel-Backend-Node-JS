var nodeMailer = require("nodemailer");
const env = require("../config/env")();


var emailTemplates = require("./emailTemplates/forgotPassword");

var transport = nodeMailer.createTransport({
	service: env.EMAIL.MAIL_SERVICE,
	auth: {
		user: env.EMAIL.SMTP_CREDENTIALS.email,
		pass: env.EMAIL.SMTP_CREDENTIALS.password
	}
});
let renderMessageFromTemplateAndVariables = async (templateData, variablesData) => {
	var Handlebars = require("handlebars");
	return await Handlebars.compile(templateData)(variablesData);
};
module.exports = {
	sendMail: async (emailType, emailId, emailVariables) => {
		var message = {
			from: `${env.APP_NAME} <${env.EMAIL.SMTP_CREDENTIALS.email}>`,
			to: emailId
		};
		switch (emailType) {
			case "REGISTER_USER":
				message.subject = `Registered with ${env.APP_NAME}`;
				message.html = await renderMessageFromTemplateAndVariables(emailTemplates.registerUser, emailVariables);
				break;
			case "FORGOT_PASSWORD":
				message.subject = "Forgot Password";
				message.html = await renderMessageFromTemplateAndVariables(emailTemplates.forgotPassword, emailVariables);
				break;
			case  "FORGOT_PASSWORD_ADMIN":
				message.subject = "Forgot Password";
				message.html = await renderMessageFromTemplateAndVariables(emailTemplates.forgotPasswordAdmin, emailVariables);
				break;
			case  "ADD_ADMIN":
				message.subject = `Registered with ${env.application}`;
				message.html = await renderMessageFromTemplateAndVariables(emailTemplates.registerAdmin, emailVariables);
				break;
		}
		return transport.sendMail(message, (error) => {
			if (error) {
				console.log("send mail error--", error);
			} else {
				console.log("Sucess...");
			}
		});
	},
};