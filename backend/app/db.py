from sqlmodel import create_engine, Session
from .core.config import settings

# Create database engine
engine = create_engine(settings.DATABASE_URL, echo=True)


def get_session():
    """Database session dependency"""
    with Session(engine) as session:
        yield session