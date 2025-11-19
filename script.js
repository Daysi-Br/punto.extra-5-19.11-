// Inicializar EmailJS con tu Public Key
emailjs.init("ioeOTFoxcV74jYCfy");

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const statusMessage = document.getElementById('status-message');
    const charCount = document.getElementById('charCount');
    const messageTextarea = document.getElementById('message');

    // Contador de caracteres para el mensaje
    if (messageTextarea && charCount) {
        messageTextarea.addEventListener('input', function() {
            const length = this.value.length;
            charCount.textContent = length;
            
            if (length > 500) {
                this.value = this.value.substring(0, 500);
                charCount.textContent = 500;
                charCount.style.color = 'var(--error-color)';
            } else if (length > 400) {
                charCount.style.color = 'var(--warning-color)';
            } else {
                charCount.style.color = 'var(--text-light)';
            }
        });
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

        // Validación en tiempo real
        input.addEventListener('input', function() {
            validateField(this);
        });

        input.addEventListener('change', function() {
            validateField(this);
        });
    });

    // Manejar envío del formulario
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Validar todo el formulario
        let isValid = true;
        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });

        if (!isValid) {
            showMessage('Por favor, corrige los errores en el formulario antes de enviar.', 'error');
            return;
        }

        // Mostrar estado de carga
        showMessage('<i class="fas fa-spinner fa-spin"></i> Enviando mensaje...', 'loading');

        // Preparar datos del formulario
        const formData = {
            firstName: document.getElementById('firstName').value.trim(),
            lastName: document.getElementById('lastName').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value.trim(),
            urgency: document.querySelector('input[name="urgency"]:checked').value,
            contactMethods: Array.from(document.querySelectorAll('input[name="contactMethod"]:checked')).map(cb => cb.value),
            newsletter: document.getElementById('newsletter').checked ? 'Sí' : 'No',
            fecha: new Date().toLocaleString('es-ES'),
            userAgent: navigator.userAgent
        };

        console.log('Datos a enviar:', formData);

        // Enviar email usando EmailJS con tus credenciales
        emailjs.send("service_lmyzuvt", "template_oxf4bgk", formData)
        .then(() => {
            // Éxito - Mostrar confeti y mensaje de éxito
            showConfetti();
            showMessage(
                '<i class="fas fa-check-circle"></i> ¡Mensaje enviado con éxito!<br>' +
                'Te contactaremos pronto. Revisa tu correo electrónico.',
                'success'
            );
            
            // Limpiar formulario
            form.reset();
            charCount.textContent = '0';
            charCount.style.color = 'var(--text-light)';
            
            // Ocultar mensaje después de 5 segundos
            setTimeout(() => {
                statusMessage.style.display = 'none';
            }, 5000);
        })
        .catch((error) => {
            // Error
            console.error("Error al enviar el mensaje:", error);
            showMessage(
                '<i class="fas fa-exclamation-triangle"></i> Hubo un error al enviar el mensaje.<br>' +
                'Por favor, intenta nuevamente o contacta al soporte técnico.',
                'error'
            );
            
            // Ocultar mensaje después de 5 segundos
            setTimeout(() => {
                statusMessage.style.display = 'none';
            }, 5000);
        });
    });

    // Función para validar campos individuales
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

    // Función para mostrar mensajes
    function showMessage(message, type) {
        statusMessage.className = `status-message ${type}`;
        statusMessage.innerHTML = message;
        statusMessage.style.display = 'block';
        
        // Scroll suave al mensaje
        statusMessage.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
    }

    // Validación específica para email
    document.getElementById('email')?.addEventListener('blur', function() {
        const email = this.value.trim();
        if (email && !isValidEmail(email)) {
            this.style.borderColor = 'var(--error-color)';
            showMessage('Por favor, ingresa un correo electrónico válido.', 'error');
        }
    });

    // Efecto de partículas decorativas
    createParticles();
});

// Función para validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Efecto de partículas en el fondo
function createParticles() {
    const colors = ['#667eea', '#764ba2', '#6b46c1', '#553c9a', '#9f7aea'];
    const body = document.body;
    
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.width = Math.random() * 6 + 2 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.top = Math.random() * 100 + 'vh';
        particle.style.opacity = Math.random() * 0.4 + 0.1;
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '-1';
        
        particle.style.animation = `float ${Math.random() * 10 + 10}s linear infinite`;
        body.appendChild(particle);
    }
}

// Efecto de confeti al enviar exitosamente
function showConfetti() {
    const confettiColors = ['#667eea', '#764ba2', '#6b46c1', '#553c9a', '#9f7aea'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
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

// Agregar keyframes dinámicamente para animaciones
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

// Efectos adicionales para mejorar la UX
document.addEventListener('DOMContentLoaded', function() {
    // Agregar clase de carga inicial
    document.body.classList.add('loaded');
    
    // Efecto de aparición escalonada para los elementos del formulario
    const formSections = document.querySelectorAll('.form-section');
    formSections.forEach((section, index) => {
        section.style.animationDelay = `${index * 0.2}s`;
    });
});
