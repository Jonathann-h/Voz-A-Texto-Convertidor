document.addEventListener('DOMContentLoaded', (event) => {
    // Referencias a los elementos del DOM una vez que se carga el DOM
    const startButton = document.getElementById('start-btn');
    const stopButton = document.getElementById('stop-btn');
    const clearButton = document.getElementById('clear-btn');
    const resultText = document.getElementById('result-text');

    // Verifica si el navegador soporta la API de reconocimiento de voz
    if (!('webkitSpeechRecognition' in window)) {
        alert("Tu navegador no soporta la API de reconocimiento de voz. :(");
    } else {
        // Configuración del reconocimiento de voz
        const recognition = new webkitSpeechRecognition();
        recognition.continuous = true; // Continuar reconociendo incluso después de pausas
        recognition.interimResults = false; // Mostrar resultados solo cuando el discurso se haya completado
        recognition.lang = 'es-ES'; // Configurar el idioma en español

        // Referencia al contenedor de puntos una vez que se carga el DOM
        const dotsContainer = document.querySelector('.dots-container');

        // Evento para cuando se inicia el reconocimiento de voz
        recognition.onstart = () => {
            startButton.disabled = true;
            stopButton.disabled = false;
            dotsContainer.style.display = 'flex';
            console.log('Reconocimiento de voz iniciado');
        };

        // Evento para cuando se obtiene un resultado del reconocimiento de voz
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

        // Evento para un caso de error
        recognition.onerror = (event) => {
            console.error('Error en el reconocimiento de voz:', event.error);
        };

        // Evento para cuando se detiene el reconocimiento de voz
        recognition.onend = () => {
            startButton.disabled = false;
            stopButton.disabled = true;
            dotsContainer.style.display = 'none';
            console.log('Reconocimiento de voz detenido');
        };

        // Iniciar el reconocimiento de voz al hacer click en el boton Inicio
        startButton.addEventListener('click', () => {
            recognition.start();
        });

        // Detener el reconocimiento de voz al hacer click en Detener
        stopButton.addEventListener('click', () => {
            recognition.stop();
        });

        // Limpiar el contenido del campo del texto
        clearButton.addEventListener('click', () => {
            resultText.value = '';
        });

        // Inicialmente deshabilitar el botón de detener y ocultar el contenedor de puntos
        stopButton.disabled = true;
        dotsContainer.style.display = 'none';
    }
});

document.addEventListener('DOMContentLoaded', (event) => {
    const startButton = document.getElementById('start-btn');
    const stopButton = document.getElementById('stop-btn');
    const clearButton = document.getElementById('clear-btn');
    const copyButton = document.getElementById('copy-btn'); // Nuevo botón de copiar
    const resultText = document.getElementById('result-text');
    const dotsContainer = document.querySelector('.dots-container');

    if (!('webkitSpeechRecognition' in window)) {
        alert("Tu navegador no soporta la API de reconocimiento de voz. :(");
    } else {
        const recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = 'es-ES';

        recognition.onstart = () => {
            startButton.disabled = true;
            stopButton.disabled = false;
            dotsContainer.style.display = 'flex';
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
            dotsContainer.style.display = 'none';
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

        // Copiar el texto al portapapeles
        copyButton.addEventListener('click', () => {
            resultText.select();
            document.execCommand('copy');
            alert('Texto copiado al portapapeles!');
        });

        stopButton.disabled = true;
        dotsContainer.style.display = 'none';
    }
});