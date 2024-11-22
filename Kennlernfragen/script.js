let currentIndex = 0;
let questions = []; // Hier speichern wir die Fragen

// Funktion, um die Fragen aus der JSON-Datei zu laden
const loadQuestions = async () => {
    try {
        const response = await fetch('questions.json');
        const data = await response.json();
        questions = data.questions; // Die Fragen aus der JSON-Datei

        // Fragen zufällig anordnen
        shuffleArray(questions);

        renderSlides(); // Slides nach dem Laden rendern
    } catch (error) {
        console.error('Fehler beim Laden der Fragen:', error);
    }
};

// Funktion zur zufälligen Anordnung des Arrays
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Elemente tauschen
    }
};

// Funktion, um die Slides zu rendern
const renderSlides = () => {
    const slider = document.getElementById('slider');
    slider.innerHTML = ''; // Leere den Slider, falls schon etwas da ist

    questions.forEach((question) => {
        const slide = document.createElement('div');
        slide.classList.add('question-slide');
        slide.innerHTML = `<h2>${question}</h2>`;
        slider.appendChild(slide);
    });

    showSlide(currentIndex); // Erste Frage anzeigen
};

// Funktion, um die aktuelle Frage anzuzeigen
const showSlide = (index) => {
    if (index < 0) {
        currentIndex = questions.length - 1;
    } else if (index >= questions.length) {
        currentIndex = 0;
    }

    const slider = document.querySelector('.slider');
    slider.style.transform = `translateX(-${currentIndex * 100}%)`;
};

// Event Listener für die Schaltflächen
document.querySelector('.prev-btn').addEventListener('click', () => {
    currentIndex--;
    showSlide(currentIndex);
});

document.querySelector('.next-btn').addEventListener('click', () => {
    currentIndex++;
    showSlide(currentIndex);
});

// Lade die Fragen, wenn die Seite geladen wird
window.onload = loadQuestions;
