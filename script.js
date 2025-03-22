const definitions = [
    { definition: "Это реклама, которая показывается в зависимости от контекста страницы.", word: "контекстная" },
    { definition: "Платформа от Google для размещения рекламы.", word: "adwords" },
    { definition: "Ключевое слово, используемое в рекламе.", word: "ключевик" }
    // Добавьте больше определений
];

let currentDefinition = {};

function getRandomDefinition() {
    const index = Math.floor(Math.random() * definitions.length);
    currentDefinition = definitions[index];
    document.getElementById('definition').textContent = currentDefinition.definition;
    document.getElementById('result').classList.remove('show');
    document.getElementById('answer').value = '';
}

document.getElementById('check').addEventListener('click', () => {
    const answer = document.getElementById('answer').value.trim().toLowerCase();
    const resultBox = document.getElementById('result');
    if (answer === currentDefinition.word.toLowerCase()) {
        resultBox.textContent = 'Правильно!';
        resultBox.style.color = '#27ae60';
    } else {
        resultBox.textContent = 'Неправильно. Попробуйте еще раз!';
        resultBox.style.color = '#e74c3c';
    }
    resultBox.classList.add('show');
    setTimeout(getRandomDefinition, 2000); // Следующее определение через 2 секунды
});

// Старт игры
getRandomDefinition();
