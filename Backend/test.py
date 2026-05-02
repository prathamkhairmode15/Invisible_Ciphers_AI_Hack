import sqlite3
import datetime
conn = sqlite3.connect('aishield.db')
username = 'Nitin'
one_minute_ago = (datetime.datetime.now() - datetime.timedelta(minutes=1)).isoformat()
print("1 min ago:", one_minute_ago)
count = conn.execute("SELECT COUNT(*) FROM security_logs WHERE username = ? AND final_status = 'BLOCKED' AND timestamp >= ?", (username, one_minute_ago)).fetchone()[0]
print("Strikes:", count)
