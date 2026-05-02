import sqlite3
import os
import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), "aishield.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    c = conn.cursor()
    
    # Users table
    c.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
    ''')
    
    # Chat sessions (optional if we just want one continuous context per user for now, 
    # but good for future expansion)
    c.execute('''
        CREATE TABLE IF NOT EXISTS chats (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            role TEXT NOT NULL,
            content TEXT NOT NULL,
            timestamp TEXT NOT NULL
        )
    ''')
    
    # Security Logs table
    c.execute('''
        CREATE TABLE IF NOT EXISTS security_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            input_risk INTEGER,
            output_risk INTEGER,
            final_status TEXT NOT NULL,
            category TEXT,
            matched_pattern TEXT,
            message TEXT,
            ip TEXT,
            attack_type TEXT,
            timestamp TEXT NOT NULL
        )
    ''')
    
    # Try to add columns if they don't exist (for existing databases)
    try:
        c.execute("ALTER TABLE security_logs ADD COLUMN ip TEXT")
        c.execute("ALTER TABLE security_logs ADD COLUMN attack_type TEXT")
    except:
        pass

    conn.commit()
    conn.close()

def log_security_event_db(username, input_risk, output_risk, final_status, category, matched_pattern, message, ip="127.0.0.1", attack_type="None"):
    conn = get_db_connection()
    c = conn.cursor()
    timestamp = datetime.datetime.now().isoformat()
    c.execute('''
        INSERT INTO security_logs (username, input_risk, output_risk, final_status, category, matched_pattern, message, ip, attack_type, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (username, input_risk, output_risk, final_status, category, matched_pattern, message, ip, attack_type, timestamp))
    conn.commit()
    conn.close()

def save_chat_message(username, role, content):
    conn = get_db_connection()
    c = conn.cursor()
    timestamp = datetime.datetime.now().isoformat()
    c.execute('''
        INSERT INTO chats (username, role, content, timestamp)
        VALUES (?, ?, ?, ?)
    ''', (username, role, content, timestamp))
    conn.commit()
    conn.close()

def get_user_chat_history(username):
    conn = get_db_connection()
    c = conn.cursor()
    # Fetch recent messages, ordered by time
    c.execute('SELECT role, content FROM chats WHERE username = ? ORDER BY id ASC', (username,))
    rows = c.fetchall()
    conn.close()
    return [{"role": row["role"], "content": row["content"]} for row in rows]

def get_user_strikes(username):
    import datetime
    conn = get_db_connection()
    c = conn.cursor()
    one_hour_ago = (datetime.datetime.now() - datetime.timedelta(hours=1)).isoformat()
    c.execute("SELECT COUNT(*) FROM security_logs WHERE username = ? AND final_status = 'BLOCKED' AND timestamp >= ?", (username, one_hour_ago))
    count = c.fetchone()[0]
    conn.close()
    return count

