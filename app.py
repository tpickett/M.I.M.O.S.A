# Importing necessary modules and packages
from flask import Flask, render_template, jsonify, request, send_from_directory
from flask_cors import CORS
import db
import requests
from concurrent.futures import ThreadPoolExecutor
import time

# Creating a Flask application instance
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})
app.config['JSON_SORT_KEYS'] = False

# Route to Favicon
@app.route('/favicon.ico')
def favicon():
    return send_from_directory(app.root_path, 'favicon.ico', mimetype='image/vnd.microsoft.icon')

# Route to the home page of the web application
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
    return render_template('index.html')

@app.route('/assets/<path:path>')
def assets(path):
    return send_from_directory('static/assets', path)

# Route to Create/Edit page
@app.route('/edititem')
def edititem():
    return render_template('edititem.html')

# Route to handle GET and POST requests for items
@app.route('/api/items', methods=['GET', 'POST'])
def items():
    if request.method == 'GET':
        # If the request method is GET, read data from the database and return as JSON
        items = db.read_items()
        return jsonify(items)
    elif request.method == 'POST':
        # If the request method is POST, add new item to the database and return the item as JSON
        item = request.get_json()
        id = db.write_item(item)
        item['id'] = id
        return jsonify(item)

# Route to handle GET and POST requests for items
@app.route('/api/organizers', methods=['GET', 'POST'])
def organizers():
    if request.method == 'GET':
        # If the request method is GET, read data from the database and return as JSON
        organizers = db.read_organizers()
        return jsonify(organizers)
    elif request.method == 'POST':
        # If the request method is POST, add new item to the database and return the item as JSON
        organizer = request.get_json()
        id = db.write_organizer(organizer)
        organizer['id'] = id
        return jsonify(organizer)
    
@app.route('/api/organizers/<id>', methods=['PUT', 'DELETE'])
def organizer(id):
    if request.method == 'PUT':
        db.update_organizer(id, request.get_json())
        organizer = db.get_organizer(id)
        return jsonify(dict(organizer))
    elif request.method == 'DELETE':
        # If the request method is DELETE, remove the item from the database and return a success message as JSON
        db.delete_organizer(id)
        return jsonify({ 'success': True })
    
@app.route('/api/organizers/<id>/parts', methods=['GET', 'POST'])
def organizer_parts(id):
    if request.method == 'GET':
        parts = db.get_organizer_parts(int(id))
        if not parts:
            return jsonify({ 'error': 'Organizer parts not found' }), 404
        return jsonify(parts)
    elif request.method == 'POST':
        body = request.get_json()
        slot = body['slot']
        part = body['part']
        print(f"Position of {part}: {slot}: {id}")
        createdId = db.assign_part_to_organizer_slot(id, slot, part)
        return jsonify({ 'success': True, 'id': createdId })

@app.route('/api/organizers/<id>/illuminate', methods=['GET'])
def organizer_locate(id):
    organizer = db.get_organizer(id)
    if not organizer:
        return jsonify({ 'error': 'Organizer not found' }), 404
    if request.method == 'GET':
        locate_organizer(6, organizer['ip'], organizer['led_count'])
        return jsonify({ 'success': True })

# Route to handle illuminating slot requests for an individual organizer
@app.route('/api/organizers/<id>/illuminate/<slot>', methods=['GET'])
def organizer_slot_light(id, slot):
    organizer = db.get_organizer(id)
    if not organizer:
        return jsonify({ 'error': 'Organizer not found' }), 404
    if request.method == 'GET':
        lights(slot, organizer['ip'])
        return jsonify({ 'success': True })
    
# Route to handle GET, PUT, DELETE and POST requests for an individual item
@app.route('/api/items/<id>', methods=['GET', 'PUT', 'DELETE', 'POST'])
def item(id):
    item = db.get_item(id)
    if not item:
        return jsonify({ 'error': 'Item not found' }), 404
    if request.method == 'GET':
        # If the request method is GET, return the item as JSON
        return jsonify(dict(item))
    elif request.method == 'PUT':
        # If the request method is PUT, update the item in the database and return the updated item as JSON
        db.update_item(id, request.get_json())
        item = db.get_item(id)
        return jsonify(dict(item))
    elif request.method == 'DELETE':
        # If the request method is DELETE, remove the item from the database and return a success message as JSON
        db.delete_item(id)
        return jsonify({ 'success': True })
    elif request.method == 'POST':
        # If the request method is POST, check if the request is for locating the item, and send the position to a WLED API
        if request.form.get('action') == 'locate':
            positions = locate_all_parts(id)
            return jsonify({ 'success': True, 'positions': [dict(item) for item in positions] })
        elif request.form.get('action') == 'addQuantity': #incrementing the quantity by 1 instead of append a digit next to the current quantity
            item['quantity'] = int(item['quantity']) + 1
            db.update_item(id, item)
            return jsonify({ 'success': True })
        elif request.form.get('action') == 'removeQuantity':
            item['quantity'] -= 1
            db.update_item(id, item)
            return jsonify({ 'success': True })
        elif request.form.get('action') == 'setQuantity':
            new_quantity = int(request.form.get('quantity'))
            if new_quantity >= 1:
                item['quantity'] = new_quantity
                db.update_item(id, item)
                return jsonify({ 'success': True })      
                  
        else:
            return jsonify({ 'error': 'Invalid action' }), 400

# Route to handle DELETE requests for an individual item
@app.route('/api/items/<id>', methods=['DELETE'])
def delete_item(id):
    db.delete_item(id)
    return jsonify({ 'success': True })

def locate_organizer(blinkTimes, ip, led_count):
    url = f"http://{ip}/json/state"
    redState = {"seg": {"i":[ 0, led_count, "FF0000"] } } #turn all leds red
    offState = {"seg": {"i":[ 0, led_count, [0,0,0]] } } #turn all leds off
    resetState = {"seg":[{"frz": False}]}
    for x in range(0, blinkTimes):
        if x % 2 == 0:
            state = offState
        else:
            state = redState
        requests.post(url, json = state)
        time.sleep(.5)
    requests.post(url, json = resetState)

def send_request(target_ip, start_num, stop_num, color):
    url = f"http://{target_ip}/json/state" # construct URL using the target IP address
    state = {"seg": [{"id": 0, "start": start_num, "stop": stop_num, "col": [color]}]}
    response = requests.post(url, json=state)

def lights(position, pi):
    start_num = int(position) - 1
    send_request(pi, start_num, int(position), [255, 255, 255]) # Convert color value to [0, 0, 0, 255] to only use white part of LED (RGBW LEDs only).
    time.sleep(5) # Change how long the LED stays on for.
    send_request(pi, 0, 60, [0, 255, 0])

def prelight(position):
    organizer_id = position['organizer_id']
    position = position['position']
    organizer = db.get_organizer(organizer_id)
    lights(position, organizer['ip'])

def locate_all_parts(part):
    positions = db.find_all_part_locations(part)
    with ThreadPoolExecutor(max_workers=3) as pool:
        pool.map(prelight,positions)
    return positions

# Running the Flask application
if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=True)