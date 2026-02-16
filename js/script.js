// ========================================
// NAVEGAÇÃO MOBILE (HAMBURGER MENU)
// ========================================
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

// Verifica se os elementos existem antes de adicionar event listeners
if (hamburger && navLinks) {
    // Adiciona um listener para o clique no ícone hamburger
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active'); // Alterna a classe 'active' para mostrar/esconder o menu
        hamburger.classList.toggle('active'); // Alterna a classe 'active' para animar o ícone
        document.body.classList.toggle('no-scroll'); // Impede o scroll no body quando o menu mobile está aberto
    });

    // Fecha o menu ao clicar em um link de navegação
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active'); // Esconde o menu
            hamburger.classList.remove('active'); // Desativa a animação do ícone
            document.body.classList.remove('no-scroll'); // Permite o scroll novamente
        });
    });
}

// ========================================
// SCROLL SUAVE PARA LINKS ÂNCORA
// ========================================
// Seleciona todos os links que começam com '#' (âncoras)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault(); // Previne o comportamento padrão do link (salto imediato)

        const targetId = this.getAttribute('href'); // Obtém o ID do destino (ex: #home)
        const target = document.querySelector(targetId); // Seleciona o elemento de destino

        if (target) {
            // Ajusta a posição do scroll para considerar a altura da navbar fixa
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - navbarHeight;

            // Realiza o scroll suave para a posição calculada
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// ANIMAÇÃO DAS BARRAS DE COMPETÊNCIAS AO SCROLL
// ========================================
const skillsSection = document.querySelector('.skills');

if (skillsSection) {
    const progressBars = skillsSection.querySelectorAll('.skill-progress');

    // Função que aplica as larguras das barras
    const fillSkillBars = () => {
        progressBars.forEach(bar => {
            const progress = bar.getAttribute('data-progress');
            bar.style.width = progress + '%';
        });
    };

    // Se IntersectionObserver existir, usa animação ao entrar na tela
    if ('IntersectionObserver' in window) {
        const animateSkills = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    fillSkillBars();
                    observer.unobserve(entry.target);
                }
            });
        };

        const skillObserver = new IntersectionObserver(animateSkills, {
            threshold: 0.2,
            rootMargin: '0px 0px -20px 0px'
        });

        skillObserver.observe(skillsSection);
    } else {
        // Fallback: se não suportar IntersectionObserver, já preenche de cara
        fillSkillBars();
    }
}


// ========================================
// EFEITO DE DIGITAÇÃO NO TÍTULO HERO
// ========================================
const typingEffectElement = document.querySelector('.typing-effect');

// Verifica se o elemento de digitação existe
if (typingEffectElement) {
    const textToType = typingEffectElement.getAttribute('data-text'); // Ex: "Olá, sou o Maurício Ito"
    const nameToHighlight = 'Maurício Ito'; // Nome a destacar
    const nameStart = textToType.indexOf(nameToHighlight); // Posição onde o nome começa
    let i = 0; // Contador para a posição do caractere
    let currentText = ''; // Texto atualmente exibido
    const typingSpeed = 100; // Velocidade de digitação (ms por caractere)

    // Função principal do efeito de digitação
    function typeWriter() {
        currentText = textToType.substring(0, i + 1);

        // Se encontrarmos o nome dentro do texto, aplicamos o highlight independente de espaços antes
        if (nameStart !== -1 && i >= nameStart) {
            const preName = currentText.substring(0, nameStart);
            const namePart = currentText.substring(nameStart, Math.min(currentText.length, nameStart + nameToHighlight.length));
            const postName = currentText.substring(nameStart + namePart.length);

            typingEffectElement.innerHTML = `
                <span>${preName}</span>
                <span class="name-highlight">${namePart}</span>
                <span>${postName}</span>
            `;
        } else {
            // Enquanto ainda não chegou na parte do nome
            typingEffectElement.innerHTML = `<span>${currentText}</span>`;
        }

        // Continua digitando se ainda houver caracteres
        if (i < textToType.length - 1) {
            i++;
            setTimeout(typeWriter, typingSpeed);
        } else {
            // Terminou de digitar: adiciona classes para o efeito de salto e brilho, e remove o cursor
            typingEffectElement.classList.add('finished-typing');
            typingEffectElement.classList.add('no-cursor');
        }
    }

    // Inicia o efeito de digitação após um pequeno atraso inicial
    setTimeout(typeWriter, 500);
}

// ========================================
// FORMULÁRIO DE CONTACTO (EmailJS)
// ========================================
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

// Verifica se o formulário e o elemento de status existem
if (contactForm && formStatus) {
    // Inicializa o EmailJS com sua chave pública
    // Substitua "CgRxqMNBIdcxLRc4G" pela sua chave pública real do EmailJS
    emailjs.init("CgRxqMNBIdcxLRc4G");

    // Adiciona um listener para o evento de submissão do formulário
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault(); // Previne o comportamento padrão de submissão do formulário

        const submitBtn = this.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;

        // Atualiza o texto do botão e desabilita-o durante o envio
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        formStatus.style.display = 'none'; // Esconde mensagens de status anteriores

        // Coleta os dados do formulário
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            subject: document.getElementById('subject').value.trim(),
            message: document.getElementById('message').value.trim()
        };

        // Validação básica de campos
        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            displayFormStatus('Por favor, preencha todos os campos.', 'error');
            resetButton(submitBtn, originalBtnText);
            return;
        }

        // Validação de formato de e-mail
        const emailPattern = /[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}/;
        if (!emailPattern.test(formData.email)) {
            displayFormStatus('Por favor, insira um e-mail válido.', 'error');
            resetButton(submitBtn, originalBtnText);
            return;
        }

        try {
            // Verifica se emailjs.send está disponível antes de chamar
            if (typeof emailjs !== 'undefined' && emailjs.send) {
                // Envia o e-mail usando o EmailJS
                await emailjs.send('service_l1y2sh4', 'template_4x2z9je', {
                    from_name: formData.name,
                    from_email: formData.email,
                    subject: formData.subject,
                    message: formData.message,
                    to_email: 'mauricio33ito@gmail.com' // Seu e-mail de destino configurado no EmailJS
                });
                displayFormStatus('✅ Mensagem enviada com sucesso! Responderei em breve.', 'success');
                contactForm.reset(); // Limpa o formulário após o sucesso
            } else {
                // Fallback se EmailJS não estiver carregado ou inicializado corretamente
                console.warn('EmailJS não está disponível. Envio de formulário desativado.');
                displayFormStatus('Erro ao enviar mensagem. O serviço de e-mail não está disponível. Por favor, envie diretamente para: mauricio33ito@gmail.com', 'error');
            }
        } catch (error) {
            console.error('❌ Erro ao enviar:', error);
            let errorMessage = 'Erro ao enviar mensagem. ';
            if (error.text) {
                errorMessage += 'Detalhes: ' + error.text + '. ';
            }
            errorMessage += 'Por favor, envie directamente para: mauricio33ito@gmail.com';
            displayFormStatus(errorMessage, 'error');
        } finally {
            resetButton(submitBtn, originalBtnText); // Restaura o botão
            setTimeout(() => {
                formStatus.style.display = 'none'; // Esconde a mensagem de status após 8 segundos
            }, 8000);
        }
    });
}

// Função auxiliar para exibir o status do formulário
function displayFormStatus(message, type) {
    formStatus.textContent = message;
    formStatus.className = `form-status ${type}`; // Adiciona classe para estilização (success/error)
    formStatus.style.display = 'block'; // Torna a mensagem visível
}

// Função auxiliar para resetar o botão de submissão
function resetButton(button, originalText) {
    button.textContent = originalText;
    button.disabled = false;
    button.classList.remove('loading');
}

// ========================================
// NAVBAR FIXA E ESTILO AO SCROLL
// ========================================
const navbar = document.querySelector('.navbar');

// Verifica se a navbar existe
if (navbar) {
    // Função para adicionar/remover a classe 'scrolled' na navbar
    const handleScroll = () => {
        if (window.scrollY > 50) { // Se a página for rolada mais de 50px
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll); // Adiciona listener para o evento de scroll
    handleScroll(); // Chama a função na carga da página para verificar a posição inicial
}

// ========================================
// CAROUSEL DE CERTIFICADOS
// ========================================
const certificatesCarousel = document.querySelector('.certificates-carousel');
const certPrev = document.getElementById('certPrev');
const certNext = document.getElementById('certNext');

// Verifica se os elementos do carrossel existem
if (certificatesCarousel && certPrev && certNext) {
    const scrollAmount = 250; // Quantidade de pixels para rolar por clique

    // Listener para o botão "Próximo"
    certNext.addEventListener('click', () => {
        certificatesCarousel.scrollBy({
            left: scrollAmount, // Rola para a direita
            behavior: 'smooth'
        });
    });

    // Listener para o botão "Anterior"
    certPrev.addEventListener('click', () => {
        certificatesCarousel.scrollBy({
            left: -scrollAmount, // Rola para a esquerda
            behavior: 'smooth'
        });
    });

    // Opcional: Adicionar navegação por teclado (setas)
    certificatesCarousel.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            certificatesCarousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        } else if (e.key === 'ArrowLeft') {
            certificatesCarousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        }
    });
}

// ========================================
// EFEITO "VER" EM CERTIFICADOS (MOBILE E DESKTOP)
// ========================================
const certificateItems = document.querySelectorAll('.certificate-item');
const isTouchDevice =
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0;

if (certificateItems.length > 0) {
    if (isTouchDevice) {
        let activeCertificate = null;

        certificateItems.forEach(item => {
            const link = item.querySelector('.certificate-link');

            // No mobile vamos trabalhar apenas com o toque no ITEM
            item.addEventListener('touchstart', (e) => {
                // Se já houver outro ativo e não for este, fecha o anterior
                if (activeCertificate && activeCertificate !== item) {
                    activeCertificate.classList.remove('active');
                    activeCertificate = null;
                }

                // Se este já estiver ativo, é o segundo toque: deixa o link funcionar normalmente
                if (item.classList.contains('active')) {
                    activeCertificate = null;
                    // NÃO chamamos preventDefault aqui — o <a> abre o PDF
                } else {
                    // Primeiro toque: só mostra o overlay e bloqueia a navegação
                    e.preventDefault();
                    item.classList.add('active');
                    activeCertificate = item;
                }
            }, { passive: false });

            // Fecha o overlay tocando fora
            document.addEventListener('touchstart', (e) => {
                if (activeCertificate && !activeCertificate.contains(e.target)) {
                    activeCertificate.classList.remove('active');
                    activeCertificate = null;
                }
            }, { passive: true });
        });
    } else {
        // Desktop: hover + clique normal
        certificateItems.forEach(item => {
            item.classList.add('no-touch');
        });
    }
}
