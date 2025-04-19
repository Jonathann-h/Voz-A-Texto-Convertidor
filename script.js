document.addEventListener('DOMContentLoaded', (event) => {
    // Elementos del DOM
    const startButton = document.getElementById('start-btn');
    const stopButton = document.getElementById('stop-btn');
    const clearButton = document.getElementById('clear-btn');
    const copyButton = document.getElementById('copy-btn');
    const saveButton = document.getElementById('save-btn');
    const savePdfButton = document.getElementById('save-pdf-btn');
    const resultText = document.getElementById('result-text');
    const statusIndicator = document.getElementById('status-indicator');
    const wordCountElement = document.getElementById('word-count');
    const { jsPDF } = window.jspdf;

    // Actualizar contador de palabras
    function updateWordCount() {
        const text = resultText.value.trim();
        const wordCount = text === '' ? 0 : text.split(/\s+/).length;
        wordCountElement.textContent = `${wordCount} ${wordCount === 1 ? 'palabra' : 'palabras'}`;
    }

    // Verificar compatibilidad del navegador
    if (!('webkitSpeechRecognition' in window)) {
        alert("Tu navegador no soporta la API de reconocimiento de voz. Por favor, usa Chrome o Edge.");
    } else {
        const recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = 'es-ES';

        // Evento al iniciar el reconocimiento
        recognition.onstart = () => {
            startButton.disabled = true;
            stopButton.disabled = false;
            statusIndicator.classList.add('listening');
            statusIndicator.querySelector('.status-text').textContent = 'Escuchando...';
            console.log('Reconocimiento de voz iniciado');
        };

        // Evento al recibir resultados
        recognition.onresult = (event) => {
            let transcript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                if (event.results[i].isFinal) {
                    transcript += event.results[i][0].transcript;
                }
            }
            
            if (transcript) {
                // Agregar con formato (nueva línea si ya hay contenido)
                resultText.value += resultText.value ? `\n${transcript}` : transcript;
                updateWordCount();
                
                // Auto-scroll al final del textarea
                resultText.scrollTop = resultText.scrollHeight;
            }
        };

        // Evento de error
        recognition.onerror = (event) => {
            console.error('Error en el reconocimiento de voz:', event.error);
            statusIndicator.querySelector('.status-text').textContent = `Error: ${event.error}`;
            setTimeout(() => {
                if (!recognition.isListening) {
                    statusIndicator.querySelector('.status-text').textContent = 'Inactivo';
                }
            }, 3000);
        };

        // Evento al detener el reconocimiento
        recognition.onend = () => {
            startButton.disabled = false;
            stopButton.disabled = true;
            statusIndicator.classList.remove('listening');
            statusIndicator.querySelector('.status-text').textContent = 'Inactivo';
            console.log('Reconocimiento de voz detenido');
        };

        // Event listeners
        startButton.addEventListener('click', () => {
            resultText.focus();
            recognition.start();
        });

        stopButton.addEventListener('click', () => {
            recognition.stop();
        });

        clearButton.addEventListener('click', () => {
            resultText.value = '';
            updateWordCount();
            // Mostrar confirmación solo si hay texto
            if (resultText.value.length > 0) {
                if (confirm('¿Estás seguro de que quieres borrar la transcripción?')) {
                    resultText.value = '';
                    updateWordCount();
                }
            }
        });

        copyButton.addEventListener('click', () => {
            if (resultText.value.trim() === '') {
                alert('No hay texto para copiar');
                return;
            }
            
            resultText.select();
            document.execCommand('copy');
            
            // Feedback visual
            const originalText = copyButton.innerHTML;
            copyButton.innerHTML = '<i class="fas fa-check"></i> Copiado!';
            setTimeout(() => {
                copyButton.innerHTML = originalText;
            }, 2000);
        });

        saveButton.addEventListener('click', () => {
            if (resultText.value.trim() === '') {
                alert('No hay texto para guardar');
                return;
            }
            
            const blob = new Blob([resultText.value], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `transcripcion_${new Date().toISOString().slice(0, 10)}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });

        savePdfButton.addEventListener('click', () => {
            if (resultText.value.trim() === '') {
                alert('No hay texto para guardar como PDF');
                return;
            }
            
            const doc = new jsPDF();
            const lines = doc.splitTextToSize(resultText.value, 180);
            doc.text(lines, 10, 10);
            doc.save(`transcripcion_${new Date().toISOString().slice(0, 10)}.pdf`);
        });

        // Actualizar contador cuando el usuario escribe manualmente
        resultText.addEventListener('input', updateWordCount);
    }
});