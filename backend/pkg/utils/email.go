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

func SendPasswordResetEmail(toEmail, otp string) error {
	from := configs.Env.SmtpUser
	password := configs.Env.SmtpPassword
	port := configs.Env.SmtpPort
	host := configs.Env.SmtpHost

	subject := "Subject: Reset your DevCollab Password\n"
	mime := "MIME-version: 1.0;\nContent-Type: text/html; charset=\"UTF-8\";\n\n"

	body := fmt.Sprintf(`
		<html>
		<body style="font-family: Arial, sans-serif; padding: 20px;">
			<h2>Password Reset Request</h2>
			<p>We received a request to reset the password for your DevCollab account. Your authorization code is:</p>
			<div style="background-color: #f4f4f4; padding: 15px; font-size: 24px; font-weight: bold; letter-spacing: 5px; text-align: center; border-radius: 8px; width: fit-content;">
				%s
			</div>
			<p style="color: #888; font-size: 12px; margin-top: 20px;">If you did not request this, please ignore this email. This code expires in 15 minutes.</p>
		</body>
		</html>
	`, otp)

	message := []byte(subject + mime + body)
	auth := smtp.PlainAuth("", from, password, host)

	address := fmt.Sprintf("%s:%s", host, port)

	return smtp.SendMail(address, auth, from, []string{toEmail}, message)
}

func SendInvitationEmail(toEmail string, orgName string, token string) error {
	from := configs.Env.SmtpUser
	password := configs.Env.SmtpPassword
	port := configs.Env.SmtpPort
	host := configs.Env.SmtpHost

	subject := fmt.Sprintf("Subject: You've been invited to join %s on DevCollab\n", orgName)
	mime := "MIME-version: 1.0;\nContent-Type: text/html; charset=\"UTF-8\";\n\n"

	inviteLink := fmt.Sprintf("http://localhost:3000/invite?token=%s", token)

	body := fmt.Sprintf(`
		<html>
		<body style="font-family: Arial, sans-serif; padding: 20px;">
			<h2>You have an invitation!</h2>
			<p>You've been invited to collaborate in the <b>%s</b> workspace.</p>
			<br/>
			<a href="%s" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
				Accept Invitation
			</a>
			<p style="color: #888; font-size: 12px; margin-top: 30px;">This link will expire in 72 hours.</p>
		</body>
		</html>
	`, orgName, inviteLink)

	message := []byte(subject + mime + body)
	auth := smtp.PlainAuth("", from, password, host)

	address := fmt.Sprintf("%s:%s", host, port)

	return smtp.SendMail(address, auth, from, []string{toEmail}, message)
}