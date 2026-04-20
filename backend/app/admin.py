from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from . import models
from .security import hash_password


DEFAULT_ADMIN_EMAIL = "admin@hero.com"
DEFAULT_ADMIN_PASSWORD = "admin@123"


def create_default_admin(db: Session):
    existing_admin = (
        db.query(models.User)
        .filter(models.User.email == DEFAULT_ADMIN_EMAIL)
        .first()
    )

    if existing_admin:
        return existing_admin

    admin_user = models.User(
        email=DEFAULT_ADMIN_EMAIL,
        hashed_password=hash_password(DEFAULT_ADMIN_PASSWORD),
        is_admin=True,
        subscription_status="active",
    )
    db.add(admin_user)
    try:
        db.commit()
        db.refresh(admin_user)
    except IntegrityError:
        db.rollback()
        admin_user = (
            db.query(models.User)
            .filter(models.User.email == DEFAULT_ADMIN_EMAIL)
            .first()
        )
    return admin_user
