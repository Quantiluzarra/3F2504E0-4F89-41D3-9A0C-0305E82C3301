// ai-engine.js
class AI {
    constructor() {
        this.context = [];
        this.model = null;
        this.tokenizer = null;
        this.maxTokens = 512;
        this.temperature = 0.8;
    }

    async initialize() {
        await load();
        this.tokenizer = tokenizer('cl100k_base');
        this.model = await tf.loadLayersModel('https://storage.googleapis.com/tfjs-models/tfjs/gpt2_mini/model.json');
    }

    async generateResponse(prompt) {
        const encoded = this.tokenizer.encode(prompt);
        const inputTensor = tf.tensor2d([encoded], [1, encoded.length]);
        let responseTokens = [];

        for (let i = 0; i < 150; i++) {
            const logits = this.model.predict(inputTensor);
            const probabilities = tf.nn.softmax(logits);
            const nextToken = this.sampleToken(probabilities, this.temperature);
            
            responseTokens.push(nextToken);
            inputTensor = tf.concat([inputTensor, tf.tensor2d([[nextToken]], [1, 1])], 1);
            
            if (nextToken === 50256) break;
        }

        tf.dispose([logits, probabilities]);
        return this.tokenizer.decode(responseTokens);
    }

    sampleToken(probs, temperature) {
        const data = probs.dataSync();
        const expData = data.map(x => Math.exp(x / temperature));
        const sum = expData.reduce((a, b) => a + b, 0);
        const normalized = expData.map(x => x / sum);
        
        let cumulative = 0;
        const r = Math.random();
        for (let i = 0; i < normalized.length; i++) {
            cumulative += normalized[i];
            if (cumulative > r) return i;
        }
        return normalized.length - 1;
    }

    updateContext(userInput, aiResponse) {
        this.context.push({ user: userInput, ai: aiResponse });
        return this.context.slice(-5); // Ограничение истории
    }
}
