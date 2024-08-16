document.addEventListener('DOMContentLoaded', (event) => {
    const startButton = document.getElementById('start-btn');
    const stopButton = document.getElementById('stop-btn');
    const clearButton = document.getElementById('clear-btn');
    const copyButton = document.getElementById('copy-btn');
    const saveButton = document.getElementById('save-btn'); // Botón de guardar
    const resultText = document.getElementById('result-text');
    const dotsContainer = document.querySelector('.dots-container');

            //PDF
    const { jsPDF } = window.jspdf;

    // Evento que descarga el texto en formato PDF
    document.getElementById('save-pdf-btn').addEventListener('click', () => {
        const doc = new jsPDF();
        doc.text(resultText.value, 10, 10);
        doc.save('transcripcion.pdf');
    });

    //Se verifica que el navegador soporta la API de reconocimiento de voz.
    if (!('webkitSpeechRecognition' in window)) {
        alert("Tu navegador no soporta la API de reconocimiento de voz. :(");
    } else {
        //Se crea una instancia de webkitSpeechRecognition
        const recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = 'es-ES'; //Se establece el idioma a español.

        //Funcion que se ejecuta al iniciar el reconocimiento de Voz.
        recognition.onstart = () => {
            startButton.disabled = true;            //Desactivar el botón de Iniciar
            stopButton.disabled = false;            //Activar el Botoón de detener.
            dotsContainer.style.display = 'flex';   //Se muestra la animación
            console.log('Reconocimiento de voz iniciado');
        };

        //Función que se ejecuta al recibir resultados del reconocimiento de voz.
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

        //En caso de error en el reconocimiento
        recognition.onerror = (event) => {
            console.error('Error en el reconocimiento de voz:', event.error);
        };

        //Función que se ejecuts cuando se detiene el reconocimiento de voz
        recognition.onend = () => {
            startButton.disabled = false;                   //Se activa el botón de iniciar
            stopButton.disabled = true;                     //Se desactiva el boton de detener
            dotsContainer.style.display = 'none';           //Se oculta la animación
            console.log('Reconocimiento de voz detenido');
        };

        //Evento que inicia el reconocimiento de voz
        startButton.addEventListener('click', () => {
            recognition.start();
        });

        //Evento que detiene el reconocimiento de voz
        stopButton.addEventListener('click', () => {
            recognition.stop();
        });

        //Evento que limpia el área de texto
        clearButton.addEventListener('click', () => {
            resultText.value = '';
        });

        //Evento que copia el texto al portapapeles
        copyButton.addEventListener('click', () => {
            resultText.select();            //Seleccionar texto
            document.execCommand('copy');   //Comando copiar
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

        //Configuración inicial
        stopButton.disabled = true;
        dotsContainer.style.display = 'none';
    }
});