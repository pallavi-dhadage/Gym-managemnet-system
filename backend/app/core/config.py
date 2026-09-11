from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./gym.db"
    JWT_SECRET: str = "your-secret-key-change-in-production"
    SUPABASE_URL: Optional[str] = None
    SUPABASE_KEY: Optional[str] = None
    
    class Config:
        env_file = ".env"


settings = Settings()