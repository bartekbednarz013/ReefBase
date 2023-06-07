import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import lxml.html

from django.conf import settings
from os.path import join
import environ

env = environ.Env()
environ.Env.read_env(join(settings.BASE_DIR, ".env"))

GMAIL_APPPASSWORD = env("GMAIL_APPPASSWORD")


def send_mail(sender: str, recipient: str, subject: str, message: str, password=GMAIL_APPPASSWORD):
    msg = MIMEMultipart("related")
    msg["Subject"] = subject
    msg["From"] = sender
    msg["To"] = recipient
    msg.preamble = "This is a multi-part message in MIME format."
    msg_alternative = MIMEMultipart("alternative")
    msg.attach(msg_alternative)
    part_text = MIMEText(lxml.html.fromstring(message).text_content().encode("utf-8"), "plain", _charset="utf-8")
    part_html = MIMEText(message.encode("utf-8"), "html", _charset="utf-8")
    msg_alternative.attach(part_text)
    msg_alternative.attach(part_html)
    smtp_server = smtplib.SMTP_SSL("smtp.gmail.com", 465)
    smtp_server.login(sender, password)
    smtp_server.sendmail(sender, recipient, msg.as_string())
    smtp_server.quit()


# subject = "Email Subject"
# body = "This is the body of the text message"
# sender = "sender@gmail.com"
# recipients = ["recipient1@gmail.com", "recipient2@gmail.com"]
# password = "password"
