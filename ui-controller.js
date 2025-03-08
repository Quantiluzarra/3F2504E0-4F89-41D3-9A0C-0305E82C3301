// ui-controller.js
let aiInstance;

async function initializeAI() {
    aiInstance = new AI();
    await aiInstance.initialize();
    document.getElementById('sendButton').disabled = false;
}

async function processQuery() {
    const input = document.getElementById('userInput');
    const query = input.value.trim();
    if (!query) return;

    input.value = '';
    addMessage(query, true);
    const responseElement = addLoadingIndicator();

    try {
        const response = await aiInstance.generateResponse(formatContext());
        updateResponse(responseElement, response);
        aiInstance.updateContext(query, response);
    } catch (error) {
        console.error('Произошла ошибка:', error);
        updateResponse(responseElement, 'Извините, произошла ошибка при обработке запроса');
    }
}

function addMessage(text, isUser) {
    const chatBox = document.getElementById('chatBox');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
    messageDiv.textContent = text;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function addLoadingIndicator() {
    const chatBox = document.getElementById('chatBox');
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message ai-message';
    loadingDiv.innerHTML = '...<span class="loader"></span>';
    chatBox.appendChild(loadingDiv);
    return loadingDiv;
}

function updateResponse(element, text) {
    element.textContent = text;
    element.querySelector('.loader').remove();
}

function formatContext() {
    return aiInstance.context.map((item, index) => 
        `${index % 2 === 0 ? 'User' : 'AI'}: ${item.user || item.ai}`
    ).join('\n');
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('sendButton').addEventListener('click', processQuery);
    document.getElementById('userInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') processQuery();
    });
    initializeAI();
});
