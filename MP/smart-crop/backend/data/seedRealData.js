require('dotenv').config();
const mongoose = require('mongoose');

// Define refined schemas locally for seeding or import from models
const DiseaseDataSchema = new mongoose.Schema({
    disease: String,
    plantType: String,
    confidence: Number,
    severity: String,
    cause: String,
    prevention: String,
    treatment: String,
    organic: [String],
    chemical: [String]
});

const PestDataSchema = new mongoose.Schema({
    pest_name: String,
    plantType: String,
    confidence: Number,
    severity: String,
    description: String,
    prevention: String,
    control_method: String,
    organic: [String],
    chemical: [String]
});

const DiseaseData = mongoose.model('DiseaseData', DiseaseDataSchema);
const PestData = mongoose.model('PestData', PestDataSchema);

const diseases = [
    {
        disease: 'Late Blight',
        plantType: 'Potato/Tomato',
        confidence: 98,
        severity: 'High',
        cause: 'Phytophthora infestans (Oomycete)',
        prevention: 'Use resistant varieties, ensure proper spacing for airflow, and avoid overhead irrigation.',
        treatment: 'Apply fungicides immediately and remove infected plants.',
        organic: ['Copper-based sprays', 'Serenade (Bacillus subtilis)', 'Cornmeal mulch'],
        chemical: ['Chlorothalonil', 'Mancozeb', 'Ridomil Gold']
    },
    {
        disease: 'Apple Scab',
        plantType: 'Apple',
        confidence: 95,
        severity: 'Medium',
        cause: 'Venturia inaequalis (Fungus)',
        prevention: 'Rake and destroy fallen leaves in autumn, prune to improve light and air.',
        treatment: 'Timely application of protectant fungicides.',
        organic: ['Sulfur sprays', 'Neem oil', 'Compost tea'],
        chemical: ['Captan', 'Myclobutanil', 'Flint']
    },
    {
        disease: 'Rice Blast',
        plantType: 'Rice',
        confidence: 92,
        severity: 'High',
        cause: 'Magnaporthe oryzae (Fungus)',
        prevention: 'Avoid excessive nitrogen, use silica fertilizers, and resistant cultivars.',
        treatment: 'Tricyclazole application at first sign of infection.',
        organic: ['Pseudomonas fluorescens treatment', 'Neem oil', 'Garlic extract'],
        chemical: ['Tricyclazole 75 WP', 'Edifenphos', 'Carbendazim']
    }
];

const pests = [
    {
        pest_name: 'Diamondback Moth',
        plantType: 'Cabbage/Broccoli',
        confidence: 97,
        severity: 'High',
        description: 'Small, grayish-brown moths whose larvae feed on cruciferous leaves.',
        prevention: 'Intercropping with mustard, using pheromone traps.',
        control_method: 'Integrated Pest Management (IPM) focusing on biological controls.',
        organic: ['Bacillus thuringiensis (Bt)', 'Spinosad', 'Neem Seed Kernel Extract'],
        chemical: ['Chlorantraniliprole', 'Flubendiamide']
    },
    {
        pest_name: 'Bollworm',
        plantType: 'Cotton',
        confidence: 94,
        severity: 'Very High',
        description: 'Larvae of moths that feed on cotton bolls, causing massive yield loss.',
        prevention: 'Growing Bt cotton, early sowing, and trap cropping.',
        control_method: 'Scouting for eggs and larvae before spraying.',
        organic: ['NPV (Nuclear Polyhedrosis Virus)', 'Neem oil', 'Release of Trichogramma wasps'],
        chemical: ['Spinosad', 'Indoxacarb', 'Emamectin Benzoate']
    }
];

async function seedData() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB for seeding...');

        await DiseaseData.deleteMany({});
        await PestData.deleteMany({});

        await DiseaseData.insertMany(diseases);
        await PestData.insertMany(pests);

        console.log('🌱 Real-world agricultural datasets seeded successfully!');
        process.exit();
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}

seedData();
