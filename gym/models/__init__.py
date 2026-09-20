# gym/models/__init__.py
# Import all models here so Flask-Migrate / SQLAlchemy can discover them.

from gym.models.user       import User        # noqa: F401
from gym.models.lead       import Lead        # noqa: F401
from gym.models.membership import Plan, Membership  # noqa: F401
from gym.models.payment    import Payment     # noqa: F401
from gym.models.notes      import TrainerNote # noqa: F401
