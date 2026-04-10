import sqlite3
import os

DB_PATH = "c:\\Projects\\36hr-hackathon\\backend\\attendance.db"

try:
    # Use a long timeout to wait for other processes to release the lock
    conn = sqlite3.connect(DB_PATH, timeout=10)
    cur = conn.cursor()
    print("Successfully connected to DB.")
    
    # Try a write operation
    cur.execute("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, email TEXT, hashed_password TEXT)")
    conn.commit()
    print("Migration successful.")
    
    conn.close()
    print("Connection closed.")
except Exception as e:
    print(f"Error: {e}")
