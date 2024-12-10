from flask import Flask, request, jsonify
import sqlite3

app = Flask(__name__)
DATABASE = './Prod/db/database.sqlite'

def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/record', methods=['POST'])
def save_record():
    data = request.json
    name = data.get('name')
    score = data.get('score')
    conn = get_db_connection()
    conn.execute('INSERT INTO records (name, score) VALUES (?, ?)', (name, score))
    conn.commit()
    conn.close()
    return jsonify({"message": "Record saved!"}), 201

@app.route('/records', methods=['GET'])
def get_records():
    conn = get_db_connection()
    records = conn.execute('SELECT * FROM records ORDER BY score DESC').fetchall()
    conn.close()
    return jsonify([dict(row) for row in records])

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
