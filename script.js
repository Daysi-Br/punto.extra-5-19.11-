// Inicializar EmailJS con tu Public Key
emailjs.init("ioeOTFoxcV74jYCfy");

document.addEventListener('DOMContentLoaded', function() {
    initializeFormHandlers();
    initializeAnimations();
    createParticles();
});

function initializeFormHandlers() {
    // Formulario de Datos Personales
    const personalForm = document.getElementById('personalDataForm');
    if (personalForm) {
        personalForm.addEventListener('submit', handlePersonalFormSubmit);
    }

    // Formulario de Encuesta
    const surveyForm = document.getElementById('surveyForm');
    if (surveyForm) {
        surveyForm.addEventListener('submit', handleSurveyFormSubmit);
    }

    // Efectos de validación en tiempo real
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });

        input.addEventListener('input', function() {
            validateField(this);
        });

        input.addEventListener('change', function() {
            validateField(this);
        });
    });

    // Validación específica para email
    document.getElementById('correo')?.addEventListener('blur', function() {
        const email = this.value.trim();
        if (email && !isValidEmail(email)) {
            this.style.borderColor = 'var(--error-color)';
            showMessage('Por favor, ingresa un correo electrónico válido.', 'error');
        }
    });

    // Validación de fecha de nacimiento
    document.getElementById('fechaNacimiento')?.addEventListener('change', function() {
        const birthDate = new Date(this.value);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        
        if (age < 18) {
            this.style.borderColor = 'var(--error-color)';
            showMessage('Debes ser mayor de 18 años para completar este formulario.', 'error');
        } else if (age > 120) {
            this.style.borderColor = 'var(--error-color)';
            showMessage('Por favor, ingresa una fecha de nacimiento válida.', 'error');
        } else {
            this.style.borderColor = 'var(--success-color)';
        }
    });
}

function initializeAnimations() {
    // Mensaje de bienvenida personalizado
    const welcomeMessage = document.getElementById('welcome-message');
    if (welcomeMessage) {
        const hour = new Date().getHours();
        let greeting = '¡Bienvenido al Sistema de Formularios!';
        
        if (hour < 12) greeting = '¡Buenos días! Bienvenido al Sistema';
        else if (hour < 18) greeting = '¡Buenas tardes! Bienvenido al Sistema';
        else greeting = '¡Buenas noches! Bienvenido al Sistema';
        
        welcomeMessage.textContent = greeting;
    }

    // Animaciones escalonadas
    const animatedElements = document.querySelectorAll('.form-section, .form-btn');
    animatedElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.1}s`;
    });
}

function handlePersonalFormSubmit(event) {
    event.preventDefault();
    
    if (!this.checkValidity()) {
        showMessage('Por favor, completa todos los campos obligatorios correctamente.', 'error');
        return;
    }

    showMessage('<i class="fas fa-spinner fa-spin"></i> Enviando datos personales...', 'loading');

    const formData = {
        ci: document.getElementById('ci').value.trim(),
        nombre: document.getElementById('nombre').value.trim(),
        apellido: document.getElementById('apellido').value.trim(),
        direccion: document.getElementById('direccion').value.trim(),
        sexo: document.querySelector('input[name="sexo"]:checked').value,
        ciudad: document.getElementById('ciudad').value,
        telefono: document.getElementById('telefono').value.trim(),
        fechaNacimiento: document.getElementById('fechaNacimiento').value,
        correo: document.getElementById('correo').value.trim(),
        fecha: new Date().toLocaleString('es-ES'),
        tipo: 'Datos Personales'
    };

    // Enviar a EmailJS
    emailjs.send("service_lmyzuvt", "template_oxf4bgk", formData)
    .then(() => {
        showConfetti();
        showMessage(
            '<i class="fas fa-check-circle"></i> ¡Datos personales enviados con éxito!<br>' +
            'Hemos recibido tu información correctamente.',
            'success'
        );
        
        this.reset();
        
        setTimeout(() => {
            const statusMessage = document.getElementById('status-message');
            if (statusMessage) statusMessage.style.display = 'none';
        }, 5000);
    })
    .catch((error) => {
        console.error("Error al enviar datos personales:", error);
        showMessage(
            '<i class="fas fa-exclamation-triangle"></i> Error al enviar los datos.<br>' +
            'Por favor, intenta nuevamente.',
            'error'
        );
        
        setTimeout(() => {
            const statusMessage = document.getElementById('status-message');
            if (statusMessage) statusMessage.style.display = 'none';
        }, 5000);
    });
}

function handleSurveyFormSubmit(event) {
    event.preventDefault();
    
    // Validar que al menos un checkbox esté seleccionado en cada sección
    const musicaSelected = document.querySelectorAll('input[name="musica"]:checked').length > 0;
    const deportesSelected = document.querySelectorAll('input[name="deportes"]:checked').length > 0;
    
    if (!musicaSelected || !deportesSelected) {
        showMessage('Por favor, selecciona al menos una opción en cada sección de gustos.', 'error');
        return;
    }

    showMessage('<i class="fas fa-spinner fa-spin"></i> Enviando encuesta...', 'loading');

    const formData = {
        // Gustos Musicales
        musica: Array.from(document.querySelectorAll('input[name="musica"]:checked')).map(cb => cb.value).join(', '),
        artistaFavorito: document.getElementById('artistaFavorito').value.trim(),
        
        // Gustos Deportivos
        deportes: Array.from(document.querySelectorAll('input[name="deportes"]:checked')).map(cb => cb.value).join(', '),
        equipoFavorito: document.getElementById('equipoFavorito').value.trim(),
        
        // Estudios
        nivelEstudios: document.getElementById('nivelEstudios').value,
        areaEstudio: document.getElementById('areaEstudio').value.trim(),
        
        // Laboral
        situacionLaboral: document.getElementById('situacionLaboral').value,
        sectorTrabajo: document.getElementById('sectorTrabajo').value.trim(),
        
        // Otros
        hobbies: document.getElementById('hobbies').value.trim(),
        metas: document.getElementById('metas').value.trim(),
        
        fecha: new Date().toLocaleString('es-ES'),
        tipo: 'Encuesta de Gustos'
    };

    // Enviar a EmailJS
    emailjs.send("service_lmyzuvt", "template_oxf4bgk", formData)
    .then(() => {
        showConfetti();
        showMessage(
            '<i class="fas fa-check-circle"></i> ¡Encuesta enviada con éxito!<br>' +
            'Gracias por compartir tus gustos e intereses.',
            'success'
        );
        
        this.reset();
        
        setTimeout(() => {
            const statusMessage = document.getElementById('status-message');
            if (statusMessage) statusMessage.style.display = 'none';
        }, 5000);
    })
    .catch((error) => {
        console.error("Error al enviar encuesta:", error);
        showMessage(
            '<i class="fas fa-exclamation-triangle"></i> Error al enviar la encuesta.<br>' +
            'Por favor, intenta nuevamente.',
            'error'
        );
        
        setTimeout(() => {
            const statusMessage = document.getElementById('status-message');
            if (statusMessage) statusMessage.style.display = 'none';
        }, 5000);
    });
}

function validateField(field) {
    const parent = field.parentElement;
    
    if (field.checkValidity()) {
        parent.classList.remove('error');
        parent.classList.add('success');
        field.style.borderColor = 'var(--success-color)';
        return true;
    } else {
        parent.classList.remove('success');
        parent.classList.add('error');
        field.style.borderColor = 'var(--error-color)';
        return false;
    }
}

function showMessage(message, type) {
    const statusMessage = document.getElementById('status-message');
    if (!statusMessage) return;
    
    statusMessage.className = `status-message ${type}`;
    statusMessage.innerHTML = message;
    statusMessage.style.display = 'block';
    
    statusMessage.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function createParticles() {
    const colors = ['#667eea', '#764ba2', '#6b46c1', '#553c9a', '#9f7aea'];
    const body = document.body;
    
    for (let i = 0; i < 10; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.width = Math.random() * 6 + 2 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.top = Math.random() * 100 + 'vh';
        particle.style.opacity = Math.random() * 0.3 + 0.1;
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '-1';
        
        particle.style.animation = `float ${Math.random() * 10 + 10}s linear infinite`;
        body.appendChild(particle);
    }
}

function showConfetti() {
    const confettiColors = ['#667eea', '#764ba2', '#6b46c1', '#553c9a', '#9f7aea'];
    
    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '8px';
        confetti.style.height = '8px';
        confetti.style.background = confettiColors[Math.floor(Math.random() * confettiColors.length)];
        confetti.style.borderRadius = '50%';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-10px';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '9999';
        confetti.style.animation = `confettiFall ${Math.random() * 3 + 2}s linear forwards`;
        
        document.body.appendChild(confetti);
        
        setTimeout(() => {
            if (confetti.parentNode) {
                confetti.remove();
            }
        }, 5000);
    }
}

// Agregar keyframes dinámicamente
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0%, 100% {
            transform: translate(0, 0) rotate(0deg);
        }
        25% {
            transform: translate(${Math.random() * 50 - 25}px, ${Math.random() * 50 - 25}px) rotate(90deg);
        }
        50% {
            transform: translate(${Math.random() * 50 - 25}px, ${Math.random() * 50 - 25}px) rotate(180deg);
        }
        75% {
            transform: translate(${Math.random() * 50 - 25}px, ${Math.random() * 50 - 25}px) rotate(270deg);
        }
    }
    
    @keyframes confettiFall {
        to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
