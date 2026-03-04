from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    environment: str = "development"
    api_prefix: str = "/api/v1"
    frontend_origin: str = "http://localhost:5173"
    mongodb_uri: str = "mongodb://localhost:27017/aura_wealth"
    db_name: str = "aura_wealth"

    # Qwen LLM
    qwen_base_url: str = "http://54.36.182.37:2015"
    upload_dir: str = "/data/uploads"

    # JWT
    jwt_secret: str = "dev-secret-change-in-production"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7

    class Config:
        env_file = ".env"


settings = Settings()
