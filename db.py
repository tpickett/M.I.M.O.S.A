import sqlite3

# Defining the path of the SQLite database file
DATABASE = 'data.db'

# Function to connect to the database
def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row

    # Create the items table if it does not exist
    conn.execute('''
        CREATE TABLE IF NOT EXISTS items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            link TEXT NOT NULL,
            image TEXT,
            quantity INTEGER
        )
    ''')
    conn.execute('''
        CREATE TABLE IF NOT EXISTS "organizers" (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            led_count INTEGER NOT NULL,
            ip TEXT
        )
    ''')

    conn.execute('''
        CREATE TABLE IF NOT EXISTS "positions" (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            item_id INTEGER,
            organizer_id INTEGER,
            position INTEGER
        )
    ''')
    conn.execute('''
        CREATE TABLE IF NOT EXISTS "settings" (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            theme TEXT
            locate_timeout INTEGER
            
        )
    ''')
    conn.commit()
    return conn

# Function to read the data from the database
def read_items():
    conn = get_db()
    items = conn.execute('SELECT * FROM items').fetchall()
    conn.close()
    return [dict(item) for item in items]


# Function to write data to the database
def write_item(item):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO items (name, link, image, quantity) VALUES (?, ?, ?, ?)', [item['name'], item['link'], item['image'], item['quantity']])
    lastId = cursor.lastrowid
    conn.commit()
    conn.close()
    return lastId

def delete_item(id):
    conn = get_db()
    conn.execute('DELETE FROM items WHERE id = ?', [id])
    conn.commit()
    conn.close()

def get_item(id):
    conn = get_db()
    item = conn.execute('SELECT items.*, positions.position as position FROM items LEFT JOIN positions ON positions.item_id = items.id WHERE items.id = ?', [id]).fetchone()
    conn.close()
    return item

def update_item(id, data):
    conn = get_db()
    conn.execute('UPDATE items SET name = ?, link = ?, image = ?, quantity = ? WHERE id = ?', [data['name'], data['link'], data['image'], data['quantity'], id])
    conn.commit()
    conn.close()

def read_organizers():
    conn = get_db()
    organizers = conn.execute('SELECT * FROM organizers').fetchall()
    conn.close()
    return [dict(organizers) for organizers in organizers]

def write_organizer(organizer):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO organizers (name, led_count, ip) VALUES (?, ?, ?)', [organizer['name'], organizer['led_count'], organizer['ip']])
    lastId = cursor.lastrowid
    conn.commit()
    conn.close()
    return lastId

def get_organizer(id):
    conn = get_db()
    organizer = conn.execute('SELECT * FROM organizers WHERE id = ?', [id]).fetchone()
    conn.close()
    return organizer

def update_organizer(id, data):
    conn = get_db()
    conn.execute('UPDATE organizers SET name = ?, led_count = ?, ip = ?  WHERE id = ?', [data['name'], data['led_count'], data['ip'], id])
    conn.commit()
    conn.close()

def delete_organizer(id):
    conn = get_db()
    conn.execute('DELETE FROM organizers WHERE id = ?', [id])
    conn.commit()
    conn.close()


def get_organizer_parts(id):
    conn = get_db()
    parts = conn.execute('SELECT items.*, positions.position as position FROM items LEFT JOIN positions ON positions.item_id = items.id WHERE positions.organizer_id = ?', [id]).fetchall()
    conn.close()
    return [dict(part) for part in parts]

def assign_part_to_organizer_slot(id, slot, part):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO positions (item_id, organizer_id, position) VALUES (?, ?, ?)', [int(part), int(id), int(slot)])
    lastId = cursor.lastrowid
    conn.commit()
    conn.close()
    return lastId

def find_all_part_locations(id):
    conn = get_db()
    positions = conn.execute('SELECT positions.* FROM positions WHERE positions.item_id = ?;', [id]).fetchall()
    conn.close()
    return [dict(position) for position in positions]