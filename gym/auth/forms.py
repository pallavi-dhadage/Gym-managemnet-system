from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField, SubmitField, TelField
from wtforms.validators import (DataRequired, Email, EqualTo, Length,
                                 ValidationError, Regexp)
from gym.models.user import User


class RegistrationForm(FlaskForm):
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
    password = PasswordField("Password", validators=[
        DataRequired(),
        Length(min=8, message="Password must be at least 8 characters."),
        Regexp(r"^(?=.*[A-Za-z])(?=.*\d).+$",
               message="Password must contain at least one letter and one number.")
    ])
    confirm_password = PasswordField("Confirm Password", validators=[
        DataRequired(), EqualTo("password", message="Passwords must match.")
    ])
    submit = SubmitField("Create Account")

    def validate_email(self, field):
        if User.query.filter_by(email=field.data.lower().strip()).first():
            raise ValidationError("An account with this email already exists.")


class LoginForm(FlaskForm):
    email = StringField("Email Address", validators=[
        DataRequired(), Email(), Length(max=120)
    ])
    password = PasswordField("Password", validators=[DataRequired()])
    remember = BooleanField("Remember me")
    submit = SubmitField("Log In")
