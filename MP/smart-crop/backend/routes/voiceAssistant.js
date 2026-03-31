const express = require('express');
const router = express.Router();

// Simple Tamil language map for responses
const TAMIL_RESPONSES = {
    'crop': 'உங்கள் மண்ணிற்கும் வானிலைக்கும் ஏற்ற பயிரைக் கண்டறிய எங்கள் பயிர் பரிந்துரைக் கருவியைப் பயன்படுத்தலாம்!',
    'disease': 'உங்கள் பயிர்களில் ஏற்படும் நோய்களைக் கண்டறிய நான் உங்களுக்கு உதவ முடியும். தயவுசெய்து நோய் கண்டறிதல் பிரிவில் ஒரு புகைப்படத்தைப் பதிவேற்றவும்.',
    'weather': 'உங்கள் பண்ணைக்கான வானிலை முன்னறிவிப்புகளை நான் வழங்க முடியும். வானிலை தாவலை சரிபார்க்கவும்!',
    'price': 'உங்கள் பொருட்களுக்கான தற்போதைய சந்தை விலைகளை சந்தை விலை பிரிவில் காணலாம்.',
    'fertilizer': 'உங்கள் வயலுக்குத் தேவையான சரியான NPK தேவைகளைக் கணக்கிட எங்களின் உரப் பரிந்துரைக் கருவி உதவும்.',
    'pest': 'எங்கள் பூச்சி கண்டறிதல் தொகுதியில் விவசாய பூச்சிகளைக் கண்டறிந்து கட்டுப்பாட்டு உத்திகளைப் பெறுங்கள்.',
    'hello': 'வணக்கம்! உங்கள் விவசாயத் தேவைகளுக்கு உதவ நான் இங்கு இருக்கிறேன்.',
    'hi': 'வணக்கம்! நான் உங்களுக்கு எப்படி உதவ முடியும்?',
    'default': 'மன்னிக்கவும், என்னால் புரிந்து கொள்ள முடியவில்லை. வானிலை, நோய்கள் அல்லது சந்தை விலைகள் பற்றி என்னிடம் கேளுங்கள்.'
};

const ENGLISH_RESPONSES = {
    'crop': 'You can use our Crop Recommendation tool to find the best crop based on your soil and weather!',
    'disease': 'I can help detect diseases in your crops. Please upload a photo in the Disease Detection section.',
    'weather': 'I can provide hyper-local weather forecasts for your farm. Check the Weather tab!',
    'price': 'Current market prices for your commodities can be found in the Market Price section.',
    'fertilizer': 'Our Fertilizer Recommendation tool can help you calculate the exact NPK needs for your field.',
    'pest': 'Identify agricultural pests and get control strategies in our Pest Detection module.',
    'hello': 'Hello! I am here to assist you with your farming needs.',
    'hi': 'Hi! How can I help you?',
    'default': "I'm sorry, I didn't quite catch that. Ask me about weather, diseases, or market prices."
};

const HINDI_RESPONSES = {
    'crop': 'अपनी मिट्टी और जलवायु के आधार पर सबसे अच्छी फसल खोजने के लिए आप हमारे फसल अनुशंसा उपकरण का उपयोग कर सकते हैं!',
    'disease': 'मैं आपकी फसलों में रोगों का पता लगाने में मदद कर सकता हूँ। कृपया रोग पहचान अनुभाग में एक फोटो अपलोड करें।',
    'weather': 'मैं आपके खेत के लिए स्थानीय मौसम का पूर्वानुमान दे सकता हूँ। मौसम टैब देखें!',
    'price': 'आप बाज़ार मूल्य अनुभाग में अपनी वस्तुओं के लिए वर्तमान मंडी भाव देख सकते हैं।',
    'fertilizer': 'हमारा उर्वरक अनुशंसा उपकरण आपके खेत के लिए सटीक एनपीके (NPK) आवश्यकताओं की गणना करने में मदद कर सकता है।',
    'pest': 'हमारे कीट पहचान मॉड्यूल में कृषि कीटों की पहचान करें और नियंत्रण रणनीतियाँ प्राप्त करें।',
    'hello': 'नमस्ते! मैं आपकी खेती की ज़रूरतों में मदद करने के लिए यहाँ हूँ।',
    'hi': 'नमस्ते! मैं आपकी कैसे मदद कर सकता हूँ?',
    'default': 'क्षमा करें, मुझे समझ नहीं आया। मुझसे मौसम, बीमारी या बाज़ार भाव के बारे में पूछें।'
};

// POST /api/voice-assistant
router.post('/', async (req, res) => {
    const { message, lang } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        const msg = message.toLowerCase();
        let reply = '';
        let responses = ENGLISH_RESPONSES;
        
        if (lang === 'ta-IN') responses = TAMIL_RESPONSES;
        else if (lang === 'hi-IN') responses = HINDI_RESPONSES;

        if (msg.includes('crop') || msg.includes('grow') || msg.includes('பயிர்') || msg.includes('फसल')) {
            reply = responses['crop'];
        } else if (msg.includes('disease') || msg.includes('sick') || msg.includes('நோய்') || msg.includes('बीमारी') || msg.includes('रोग')) {
            reply = responses['disease'];
        } else if (msg.includes('weather') || msg.includes('rain') || msg.includes('வானிலை') || msg.includes('मौसम') || msg.includes('बारिश')) {
            reply = responses['weather'];
        } else if (msg.includes('price') || msg.includes('market') || msg.includes('விலை') || msg.includes('भाव') || msg.includes('कीमत')) {
            reply = responses['price'];
        } else if (msg.includes('fertilizer') || msg.includes('உரம்') || msg.includes('खाद') || msg.includes('उर्वरक')) {
            reply = responses['fertilizer'];
        } else if (msg.includes('pest') || msg.includes('insect') || msg.includes('பூச்சி') || msg.includes('कीट')) {
            reply = responses['pest'];
        } else if (msg.includes('hello') || msg.includes('hi') || msg.includes('வணக்கம்') || msg.includes('नमस्ते')) {
            reply = responses['hello'];
        } else {
            reply = responses['default'];
        }

        res.json({ reply });
    } catch (error) {
        console.error('Voice Assistant API Error:', error);
        res.status(500).json({ error: 'Failed to process voice request' });
    }
});

module.exports = router;
