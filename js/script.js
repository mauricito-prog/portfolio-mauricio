// ========================================
// NAVEGAÇÃO MOBILE (HAMBURGER MENU)
// ========================================
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

// Verifica se os elementos do hamburger e dos links de navegação existem
if (hamburger && navLinks) {
    // Adiciona um listener para o clique no ícone hamburger
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active'); // Ativa/desativa a visibilidade dos links
        hamburger.classList.toggle('active'); // Ativa/desativa a animação do ícone hamburger
        document.body.classList.toggle('no-scroll'); // Impede o scroll do body quando o menu mobile está aberto
    });

    // Fecha o menu ao clicar em um link (para melhor UX em mobile)
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    });
}

// ========================================
// SCROLL SUAVE PARA ÂNCORAS
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault(); // Previne o comportamento padrão do link (salto imediato)

        const targetId = this.getAttribute('href'); // Obtém o ID do alvo (ex: "#about")
        const target = document.querySelector(targetId); // Seleciona o elemento alvo

        if (target) {
            // Calcula a posição do alvo, ajustando para a altura da navbar fixa
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
                    fillSkillBars(); // Chama a função para preencher as barras
                    observer.unobserve(entry.target); // Desconecta o observador após animar para evitar re-animações
                }
            });
        };

        const skillObserver = new IntersectionObserver(animateSkills, {
            threshold: 0.2, // Inicia a animação quando 20% da secção está visível
            rootMargin: '0px 0px -20px 0px' // Começa a observar um pouco antes de entrar na tela
        });

        skillObserver.observe(skillsSection); // Começa a observar a secção de competências
    } else {
        // Fallback para navegadores sem IntersectionObserver: preenche as barras imediatamente
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
// CAROUSEL DE CERTIFICADOS (NAVEGAÇÃO)
// ========================================
// Declaramos certificatesCarousel aqui, no escopo global, para ser usado em múltiplos blocos
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
// EFEITO "VER" EM CERTIFICADOS (MOBILE E DESKTOP) & INDICADOR DE SCROLL
// ========================================
const certificateItems = document.querySelectorAll('.certificate-item');
// A variável 'certificatesCarousel' já foi declarada acima, então não a redeclaramos aqui.
const scrollIndicator = document.getElementById('scrollIndicator'); // Pega a seta de scroll

const isTouchDevice =
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0;

if (certificateItems.length > 0) {
    if (isTouchDevice) {
        let activeCertificate = null;

        certificateItems.forEach(item => {
            // Usamos 'click' para o primeiro toque/clique no mobile
            // Isso garante que o overlay só apareça ao interagir intencionalmente
            item.addEventListener('click', (e) => {
                // Se já houver outro ativo e não for este, fecha o anterior
                if (activeCertificate && activeCertificate !== item) {
                    activeCertificate.classList.remove('active');
                    activeCertificate = null;
                }

                // Se este já estiver ativo, é o segundo clique: deixa o link funcionar normalmente
                if (item.classList.contains('active')) {
                    activeCertificate = null;
                    // O evento de clique padrão do <a> vai acontecer
                } else {
                    // Primeiro clique: só mostra o overlay e bloqueia a navegação
                    e.preventDefault(); // Impede que o link abra no primeiro clique
                    item.classList.add('active');
                    activeCertificate = item;
                }
            });

            // Fecha o overlay clicando fora
            document.addEventListener('click', (e) => {
                if (activeCertificate && !activeCertificate.contains(e.target)) {
                    activeCertificate.classList.remove('active');
                    activeCertificate = null;
                }
            });
        });

        // Lógica para esconder a seta de scroll quando o usuário rolar o carrossel
        if (certificatesCarousel && scrollIndicator) {
            let scrollTimeout;
            certificatesCarousel.addEventListener('scroll', () => {
                scrollIndicator.style.opacity = '0'; // Esconde a seta ao começar a rolar
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    // Se o carrossel não estiver no início, esconde a seta permanentemente
                    // Ou pode reaparecer se voltar ao início, dependendo da UX desejada
                    if (certificatesCarousel.scrollLeft > 0) {
                        scrollIndicator.style.display = 'none';
                    } else {
                        scrollIndicator.style.opacity = '0.8'; // Reaparece se voltar ao início
                    }
                }, 1500); // Esconde após 1.5s de inatividade no scroll
            });

            // Oculta a seta se o carrossel já estiver rolado na carga da página
            if (certificatesCarousel.scrollLeft > 0) {
                scrollIndicator.style.display = 'none';
            }
        }

    } else {
        // Desktop: hover + clique normal
        certificateItems.forEach(item => {
            item.classList.add('no-touch');
        });
        // Esconde a seta de scroll no desktop
        if (scrollIndicator) {
            scrollIndicator.style.display = 'none';
        }
    }
}
