import bcrypt

def hash_password(password: str) -> str:
    # Convert string to bytes
    pwd_bytes = password.encode('utf-8')
    # Generate salt and hash
    # bcrypt automatically handles the 72-byte truncation internally
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(pwd_bytes, salt)
    # Return as a string for database storage
    return hashed.decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    pwd_bytes = password.encode('utf-8')
    hashed_bytes = hashed.encode('utf-8')
    # This function is salt-aware and timing-attack resistant
    return bcrypt.checkpw(pwd_bytes, hashed_bytes)