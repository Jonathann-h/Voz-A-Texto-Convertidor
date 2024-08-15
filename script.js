document.addEventListener('DOMContentLoaded', (event) => {
    const startButton = document.getElementById('start-btn');
    const stopButton = document.getElementById('stop-btn');
    const clearButton = document.getElementById('clear-btn');
    const copyButton = document.getElementById('copy-btn');
    const saveButton = document.getElementById('save-btn'); // Botón de guardar
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

        copyButton.addEventListener('click', () => {
            resultText.select();
            document.execCommand('copy');
            alert('Texto copiado al portapapeles!');
        });

        // Guardar el texto generadocomo un archivo .txt
        saveButton.addEventListener('click', () => {
            const blob = new Blob([resultText.value], { type: 'text/plain' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'transcripcion.txt';
            link.click();
        });

        stopButton.disabled = true;
        dotsContainer.style.display = 'none';
    }
});