import os
import io
import time
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
from waitress import serve

# Dummy imports for when models are actually trained
# import joblib
# from tensorflow.keras.models import load_model

app = Flask(__name__)
CORS(app)

# Load Models (Mocked for deployment without large model files)
# In production: 
# rf_model = joblib.load('models/crop_rf_model.pkl')
# cnn_model = load_model('models/disease_cnn_model.h5')

def predict_crop_mock(data):
    """Fallback logic to mimic RF model"""
    n, p, k = data['N'], data['P'], data['K']
    temp, rain = data['temperature'], data['rainfall']
    
    if rain > 200 and temp > 25: crop = 'Rice'
    elif temp < 20 and rain < 100: crop = 'Wheat'
    elif n > 80: crop = 'Maize'
    elif temp > 30 and rain < 80: crop = 'Cotton'
    else: crop = 'Chickpea'
    
    return {
        'crop': crop,
        'confidence': int(np.random.normal(92, 4)),
        'emoji': '🌾' if crop in ['Rice', 'Wheat'] else '🌽' if crop == 'Maize' else '🌿',
        'description': f'{crop} is highly suitable for your {data.get("soilType", "soil")} with these temperature ({temp}°C) and rainfall ({rain}mm) conditions.',
        'season': 'Kharif' if temp > 25 else 'Rabi',
        'water': 'High' if rain > 150 else 'Medium' if rain > 80 else 'Low',
        'demand': 'High',
        'yield': '3-5 tons/ha',
        'alternatives': ['Soybean', 'Black Gram', 'Mustard']
    }

def predict_disease_mock(image_bytes):
    """Fallback logic to mimic CNN model"""
    # Simulate processing time
    time.sleep(1.5)
    
    diseases = [
        {
            'disease': 'Leaf Blight (Xanthomonas)',
            'plantType': 'Rice',
            'severity': 'High',
            'confidence': int(np.random.normal(95, 3)),
            'treatment': 'Apply copper-based fungicides immediately. Drain field water.',
            'organic': ['Neem oil spray (1%)', 'Garlic extract', 'Ash dusting'],
            'chemical': ['Copper Oxychloride 3g/L', 'Mancozeb 2g/L']
        },
        {
            'disease': 'Powdery Mildew',
            'plantType': 'Wheat',
            'severity': 'Medium',
            'confidence': int(np.random.normal(88, 5)),
            'treatment': 'Apply sulfur-based fungicide. Avoid excessive nitrogen.',
            'organic': ['Baking soda (5g/L)', 'Milk spray (40%)'],
            'chemical': ['Sulfur 80WP 3g/L', 'Hexaconazole 1ml/L']
        },
        {
            'disease': 'Healthy Leaf',
            'plantType': 'Unknown Crop',
            'severity': 'Low',
            'confidence': int(np.random.normal(98, 1)),
            'treatment': 'No disease detected. Continue standard nutritional management.',
            'organic': ['Regular compost application', 'Jivamrutha spray'],
            'chemical': ['Preventive systemic fungicide (optional)']
        }
    ]
    return diseases[np.random.randint(0, len(diseases))]

def predict_pest_mock(image_bytes):
    """Fallback logic to mimic CNN model for pest detection"""
    # Simulate processing time
    time.sleep(1.2)
    
    pests = [
        {
            'pest_name': 'Aphids',
            'plantType': 'Green Leafy Vegetables',
            'severity': 'High',
            'confidence': int(np.random.normal(92, 4)),
            'description': 'Aphids are small sap-sucking insects that can spread viral diseases quickly.',
            'prevention': 'Use yellow sticky traps and avoid excessive nitrogen fertilizer.',
            'control_method': 'Apply neem oil spray or insecticidal soap immediately.',
            'organic': ['Introduce ladybugs', 'Neem oil (2%)', 'Garlic extract spray'],
            'chemical': ['Imidacloprid (systemic)', 'Acetamiprid']
        },
        {
            'pest_name': 'Fall Armyworm',
            'plantType': 'Maize',
            'severity': 'High',
            'confidence': int(np.random.normal(94, 3)),
            'description': 'A highly destructive pest that feeds on the whorl of the maize plant.',
            'prevention': 'Early planting and periodic field scouting.',
            'control_method': 'Apply bio-pesticides or specific chemical treatments to the whorl.',
            'organic': ['Bacillus thuringiensis (Bt)', 'Neem Seed Kernel Extract', 'Pheromone traps'],
            'chemical': ['Spinetoram 11.7 SC', 'Chlorantraniliprole 18.5 SC']
        },
        {
            'pest_name': 'Whitefly',
            'plantType': 'Cotton/Tomato',
            'severity': 'Medium',
            'confidence': int(np.random.normal(86, 5)),
            'description': 'Whiteflies are tiny insects that suck juice from plants and leave sticky honeydew.',
            'prevention': 'Keep greenhouses clean and use insect screens.',
            'control_method': 'Use yellow sticky traps and manage the habitat around the farm.',
            'organic': ['Yellow sticky traps', 'Neem oil (5ml/L)', 'Verticillium lecanii'],
            'chemical': ['Diafenthiuron 50 WP', 'Spiromesifen']
        }
    ]
    return pests[np.random.randint(0, len(pests))]

@app.route('/predict/crop', methods=['POST'])
def predict_crop():
    try:
        data = request.json
        result = predict_crop_mock(data)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/predict/disease', methods=['POST'])
def predict_disease():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400
            
        file = request.files['image']
        image_bytes = file.read()
        
        result = predict_disease_mock(image_bytes)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/predict/pest', methods=['POST'])
def predict_pest():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400
            
        file = request.files['image']
        image_bytes = file.read()
        
        result = predict_pest_mock(image_bytes)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'AI Service Online'})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    print(f"🚀 Starting Smart Crop AI Model Service on port {port}")
    if os.environ.get('NODE_ENV') == 'production':
        serve(app, host='0.0.0.0', port=port)
    else:
        app.run(host='0.0.0.0', port=port, debug=True)
