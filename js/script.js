/*
    Script Principal - Portefólio Maurício
    Funcionalidades: Navegação, Animações, Formulário de Contacto
*/

// ========================================
// CONFIGURAÇÃO EMAILJS
// ========================================
(function() {
    emailjs.init("CgRxqMNBIdcxLRc4G");
})();

// ========================================
// NAVEGAÇÃO MOBILE
// ========================================
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Fechar menu ao clicar num link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}



// ========================================
// SCROLL SUAVE
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========================================
// ANIMAÇÃO DAS BARRAS DE COMPETÊNCIAS
// ========================================
const skillsSection = document.querySelector('.skills');
if (skillsSection) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBars = entry.target.querySelectorAll('.skill-progress');
                progressBars.forEach(bar => {
                    const progress = bar.getAttribute('data-progress');
                    bar.style.width = progress + '%';
                });
                // Desconecta após animar (evita conflitos)
                observer.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.3, // ← REDUZ DE 0.5 PARA 0.3 (mais sensível no mobile)
        rootMargin: '0px 0px -50px 0px' // ← ADICIONA MARGEM
    });

    observer.observe(skillsSection);
}

// ========================================
// FALLBACK: Anima as barras após 2 segundos (caso o observer falhe)
// ========================================
setTimeout(() => {
    const progressBars = document.querySelectorAll('.skill-progress');
    progressBars.forEach(bar => {
        const progress = bar.getAttribute('data-progress');
        if (bar.style.width === '0px' || bar.style.width === '') {
            bar.style.width = progress + '%';
        }
    });
}, 2000);


// ========================================
// FORMULÁRIO DE CONTACTO
// ========================================
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm && formStatus) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const submitBtn = this.querySelector('button[type="submit"]');
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        formStatus.style.display = 'none';

        // Captura dos dados do formulário
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            subject: document.getElementById('subject').value.trim(),
            message: document.getElementById('message').value.trim()
        };

        // Validação de campos vazios
        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            showError('Por favor, preenche todos os campos.');
            resetButton(submitBtn);
            return;
        }

        // Validação de e-mail
        const emailPattern = /[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
        if (!emailPattern.test(formData.email)) {
            showError('Por favor, insere um e-mail válido.');
            resetButton(submitBtn);
            return;
        }

        // Envio via EmailJS
        emailjs.send('service_l1y2sh4', 'template_4x2z9je', {
            from_name: formData.name,
            from_email: formData.email,
            subject: document.getElementById('subject').value.trim(),
            message: formData.message,
            to_email: 'mauricio33ito@gmail.com'
        })
        .then(response => {
            console.log('✅ Mensagem enviada:', response);
            showSuccess('✅ Mensagem enviada com sucesso! Responderei em breve.');
            contactForm.reset();

            // Esconder mensagem após 8 segundos
            setTimeout(() => {
                formStatus.style.display = 'none';
            }, 8000);
        })
        .catch(error => {
            console.error('❌ Erro ao enviar:', error);
            let errorMessage = 'Erro ao enviar mensagem. ';

            if (error.text) {
                errorMessage += 'Detalhes: ' + error.text + '. ';
            }

            errorMessage += 'Envia directamente para: mauricio33ito@gmail.com';
            showError(errorMessage);
        })
        .finally(() => {
            resetButton(submitBtn);
        });
    });
}

// Funções auxiliares para o formulário
function showError(message) {
    formStatus.textContent = message;
    formStatus.className = 'form-status error';
    formStatus.style.display = 'block';
}

function showSuccess(message) {
    formStatus.textContent = message;
    formStatus.className = 'form-status success';
    formStatus.style.display = 'block';
}

function resetButton(button) {
    button.classList.remove('loading');
    button.disabled = false;
}

// ========================================
// EFEITO DE DIGITAÇÃO NO TÍTULO + BRILHO
// ========================================
const glitchText = document.querySelector('.glitch');
if (glitchText) {
    const text = glitchText.textContent;
    glitchText.textContent = '';
    let i = 0;

    function typeWriter() {
        if (i < text.length) {
            glitchText.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        } else {
            // Após terminar a digitação, adiciona o efeito de brilho
            setTimeout(() => {
                glitchText.classList.add('typed');
            }, 500);
        }
    }

    // Inicia a digitação após 500ms
    setTimeout(typeWriter, 500);
}

// ========================================
// NAVBAR TRANSPARENTE AO SCROLL
// ========================================
const navbar = document.querySelector('.navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(10, 10, 10, 0.98)';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.95)';
        }
    });
}
