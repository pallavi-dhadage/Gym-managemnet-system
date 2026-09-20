import sqlite3
import os

# Flask puts SQLite in instance/ folder when using relative path
db_path = os.path.join(os.path.dirname(__file__), "..", "instance", "gym.db")
db_path = os.path.abspath(db_path)
print(f"Checking: {db_path}\n")

conn = sqlite3.connect(db_path)
cur = conn.cursor()

cur.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
tables = cur.fetchall()

print("=== Tables ===")
for (tname,) in tables:
    print(f"\n  [{tname}]")
    cur2 = conn.cursor()
    cur2.execute(f"PRAGMA table_info({tname})")
    for col in cur2.fetchall():
        cid, name, ctype, notnull, dflt, pk = col
        print(f"    {name:<25} {ctype:<15} pk={pk} notnull={notnull}")

conn.close()
print("\nSchema verification PASSED")
