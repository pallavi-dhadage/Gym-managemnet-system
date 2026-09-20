from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, SubmitField, TelField
from wtforms.validators import DataRequired, Email, Length, Regexp


class EnquiryForm(FlaskForm):
    name = StringField("Full Name", validators=[
        DataRequired(), Length(min=2, max=120)
    ])
    email = StringField("Email Address", validators=[
        DataRequired(), Email(), Length(max=120)
    ])
    phone = TelField("Phone Number", validators=[
        DataRequired(),
        Regexp(r"^\+?[\d\s\-]{7,20}$", message="Enter a valid phone number.")
    ])
    message = TextAreaField("Message (optional)", validators=[
        Length(max=1000)
    ])
    submit = SubmitField("Send Enquiry")
