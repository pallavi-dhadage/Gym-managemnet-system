from flask_wtf import FlaskForm
from wtforms import SelectField, SubmitField
from wtforms.validators import DataRequired
from gym.models.membership import Plan


class PlanSelectionForm(FlaskForm):
    plan_id = SelectField("Choose Your Plan", coerce=int,
                          validators=[DataRequired()])
    submit = SubmitField("Select Plan")

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Populate choices dynamically from active plans
        self.plan_id.choices = [
            (p.id, f"{p.name} — ₹{p.price} / {p.duration_days} days")
            for p in Plan.query.filter_by(is_active=True)
                               .order_by(Plan.duration_days).all()
        ]
