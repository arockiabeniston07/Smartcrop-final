const express = require('express');
const router = express.Router();

// POST /api/chatbot
router.post('/', async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        // Simple logic or connect to AI model
        // For now, we use a simple rule-based response as a placeholder for AI
        let reply = "I'm your Smart Crop assistant. How can I help you today?";
        
        const msg = message.toLowerCase();
        
        if (msg.includes('crop') || msg.includes('grow')) {
            reply = "You can use our Crop Recommendation tool to find the best crop based on your soil and weather!";
        } else if (msg.includes('disease') || msg.includes('sick')) {
            reply = "I can help detect diseases in your crops. Please upload a photo in the Disease Detection section.";
        } else if (msg.includes('weather')) {
            reply = "I can provide hyper-local weather forecasts for your farm. Check the Weather tab!";
        } else if (msg.includes('price') || msg.includes('market')) {
            reply = "Current market prices for your commodities can be found in the Market Price section.";
        } else if (msg.includes('fertilizer')) {
            reply = "Our Fertilizer Recommendation tool can help you calculate the exact NPK needs for your field.";
        } else if (msg.includes('pest')) {
            reply = "Identify agricultural pests and get control strategies in our Pest Detection module.";
        } else if (msg.includes('hello') || msg.includes('hi')) {
            reply = "Hello! I am here to assist you with your farming needs.";
        }

        res.json({ reply });
    } catch (error) {
        console.error('Chatbot API Error:', error);
        res.status(500).json({ error: 'Failed to process chat message' });
    }
});

module.exports = router;
