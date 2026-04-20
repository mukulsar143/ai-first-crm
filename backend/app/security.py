import hashlib
import os


def hash_password(password: str) -> str:
    salt = os.urandom(16)
    password_hash = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt,
        100_000,
    )
    return f"pbkdf2_sha256$100000${salt.hex()}${password_hash.hex()}"
