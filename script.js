document.addEventListener('DOMContentLoaded', (event) => {
    const startButton = document.getElementById('start-btn');
    const stopButton = document.getElementById('stop-btn');
    const clearButton = document.getElementById('clear-btn');
    const resultText = document.getElementById('result-text');

    // Verifica si el navegador soporta la API de reconocimiento de voz
    if (!('webkitSpeechRecognition' in window)) {
        alert("Lo siento, tu navegador no soporta la API de reconocimiento de voz.");
    } else {
        const recognition = new webkitSpeechRecognition();

        // Configuración del reconocimiento de voz
        recognition.continuous = true; // Continuar reconociendo incluso después de pausas
        recognition.interimResults = false; // Mostrar resultados solo cuando el discurso se haya completado
        recognition.lang = 'es-ES'; // Configurar el idioma en español

        recognition.onstart = () => {
            startButton.disabled = true;
            stopButton.disabled = false;
            console.log('Reconocimiento de voz iniciado');
        };

        recognition.onresult = (event) => {
            let interimTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    resultText.value += event.results[i][0].transcript + '\n';
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }
            console.log('Resultado:', interimTranscript);
        };

        recognition.onerror = (event) => {
            console.error('Error en el reconocimiento de voz:', event.error);
        };

        recognition.onend = () => {
            startButton.disabled = false;
            stopButton.disabled = true;
            console.log('Reconocimiento de voz detenido');
        };

        startButton.addEventListener('click', () => {
            recognition.start();
        });

        stopButton.addEventListener('click', () => {
            recognition.stop();
        });

        clearButton.addEventListener('click', () => {
            resultText.value = '';
        });

        // Inicialmente deshabilitar el botón de detener
        stopButton.disabled = true;
    }
});
