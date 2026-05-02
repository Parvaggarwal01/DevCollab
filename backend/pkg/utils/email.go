package utils

import (
	"devcollab/configs"
	"fmt"
	"net/smtp"
)

func SendOTPEmail(toEmail, otp string) error {
	from := configs.Env.SmtpUser
	password := configs.Env.SmtpPassword
	port := configs.Env.SmtpPort
	host := configs.Env.SmtpHost

	subject := "Subject: Verify your DevCollab Account\n"
	mime := "MIME-version: 1.0;\nContent-Type: text/html; charset=\"UTF-8\";\n\n"

	body := fmt.Sprintf(`
		<html>
		<body style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
			<h2>Welcome to DevCollab!</h2>
			<p>Thank you for signing up. Please use the verification code below to activate your account:</p>
			<div style="background-color: #f4f4f4; padding: 15px; font-size: 24px; font-weight: bold; letter-spacing: 5px; text-align: center; border-radius: 8px; width: fit-content;">
				%s
			</div>
			<p style="color: #888; font-size: 12px; margin-top: 20px;">This code will expire in 15 minutes.</p>
		</body>
		</html>
	`, otp)

	message := []byte(subject + mime + body)

	auth := smtp.PlainAuth("", from, password, host)

	address := fmt.Sprintf("%s:%s", host, port)

	return smtp.SendMail(address, auth, from, []string{toEmail}, message)
}
