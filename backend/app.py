from flask import Flask, request, jsonify
import sqlite3
from datetime import datetime
import math

app = Flask(__name__)

def get_db():
    conn = sqlite3.connect('donations.db')
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    conn.execute('''CREATE TABLE IF NOT EXISTS orgs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT, lat REAL, lng REAL
    )''')
    conn.execute('''CREATE TABLE IF NOT EXISTS donations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        donor_name TEXT, food_description TEXT, quantity_portions INTEGER,
        pickup_address TEXT, lat REAL, lng REAL, expires_at TEXT,
        status TEXT, matched_org_id INTEGER, matched_org_name TEXT,
        created_at TEXT
    )''')
    conn.commit()
    conn.close()

@app.after_request
def apply_cors(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    response.headers['Access-Control-Allow-Methods'] = 'GET,POST,OPTIONS'
    return response

def distance_km(lat1, lng1, lat2, lng2):
    R = 6371
    dlat = math.radians(lat2 - lat1)
    dlng = math.radians(lng2 - lng1)
    a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1))*math.cos(math.radians(lat2))*math.sin(dlng/2)**2
    return R * 2 * math.asin(math.sqrt(a))

def find_match(lat, lng):
    conn = get_db()
    orgs = conn.execute('SELECT * FROM orgs').fetchall()
    conn.close()
    if not orgs:
        return None, None, None
    best = min(orgs, key=lambda o: distance_km(lat, lng, o['lat'], o['lng']))
    dist = distance_km(lat, lng, best['lat'], best['lng'])
    return best['id'], best['name'], round(dist, 1)

@app.route('/api/donations', methods=['POST'])
def create_donation():
    data = request.get_json()
    required = ['donor_name', 'food_description', 'quantity_portions', 'pickup_address', 'lat', 'lng', 'expires_at']
    for field in required:
        if field not in data or data[field] in (None, ''):
            return jsonify({'error': f'Missing field: {field}'}), 400

    try:
        expires = datetime.fromisoformat(data['expires_at'])
        if expires < datetime.now():
            return jsonify({'error': 'expires_at cannot be in the past'}), 400
    except ValueError:
        return jsonify({'error': 'Invalid expires_at format, use ISO format'}), 400

    org_id, org_name, dist = find_match(data['lat'], data['lng'])

    conn = get_db()
    cur = conn.execute('''INSERT INTO donations
        (donor_name, food_description, quantity_portions, pickup_address, lat, lng, expires_at, status, matched_org_id, matched_org_name, created_at)
        VALUES (?,?,?,?,?,?,?,?,?,?,?)''',
        (data['donor_name'], data['food_description'], data['quantity_portions'], data['pickup_address'],
         data['lat'], data['lng'], data['expires_at'], 'matched', org_id, org_name, datetime.now().isoformat()))
    conn.commit()
    new_id = cur.lastrowid
    conn.close()

    return jsonify({
        'id': new_id, 'donor_name': data['donor_name'], 'food_description': data['food_description'],
        'quantity_portions': data['quantity_portions'], 'pickup_address': data['pickup_address'],
        'lat': data['lat'], 'lng': data['lng'], 'expires_at': data['expires_at'],
        'status': 'matched', 'matched_org_id': org_id, 'matched_org_name': org_name, 'distance_km': dist
    }), 200

@app.route('/api/donations', methods=['GET'])
def get_donations():
    org_id = request.args.get('org_id')
    conn = get_db()
    if org_id:
        rows = conn.execute('SELECT * FROM donations WHERE matched_org_id = ?', (org_id,)).fetchall()
    else:
        rows = conn.execute('SELECT * FROM donations').fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])

@app.route('/api/donations/<int:donation_id>/status', methods=['POST'])
def update_status(donation_id):
    data = request.get_json()
    if 'status' not in data:
        return jsonify({'error': 'Missing field: status'}), 400
    conn = get_db()
    conn.execute('UPDATE donations SET status = ? WHERE id = ?', (data['status'], donation_id))
    conn.commit()
    conn.close()
    return jsonify({'id': donation_id, 'status': data['status']}), 200

@app.route('/api/stats', methods=['GET'])
def get_stats():
    conn = get_db()
    total_meals = conn.execute('SELECT SUM(quantity_portions) as s FROM donations').fetchone()['s'] or 0
    active = conn.execute("SELECT COUNT(*) as c FROM donations WHERE status NOT IN ('delivered','rejected')").fetchone()['c']
    total_orgs = conn.execute('SELECT COUNT(*) as c FROM orgs').fetchone()['c']
    conn.close()
    return jsonify({
        'total_meals_saved': total_meals,
        'active_donations': active,
        'total_orgs': total_orgs,
        'co2_saved_kg': round(total_meals * 0.4, 1)
    })

if __name__ == '__main__':
    init_db()
    app.run(debug=True, port=5000) 