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
// EFEITO "VER" EM CERTIFICADOS (MOBILE E DESKTOP)
// ========================================
const certificateItems = document.querySelectorAll('.certificate-item');
// A variável 'certificatesCarousel' já foi declarada acima, então não a redeclaramos aqui.

const isTouchDevice =
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0;

if (certificateItems.length > 0) {
    let activeCertificateTimeout = null; // Variável para armazenar o timeout do certificado ativo

    certificateItems.forEach(item => {
        // Adiciona um listener de clique para todos os dispositivos
        item.addEventListener('click', (e) => {
            // Se for um dispositivo touch OU se o item já estiver ativo (para desktop, um segundo clique)
            if (isTouchDevice || item.classList.contains('active')) {
                // Se já houver um timeout ativo, limpa-o para evitar conflitos
                if (activeCertificateTimeout) {
                    clearTimeout(activeCertificateTimeout);
                    activeCertificateTimeout = null;
                }

                // Se o item já estiver ativo, significa que é o segundo clique (ou um clique em desktop)
                // e o usuário quer realmente abrir o link.
                if (item.classList.contains('active')) {
                    // Permite que o evento padrão do link ocorra
                    return;
                } else {
                    // Primeiro clique em mobile: mostra o overlay e impede a navegação imediata
                    e.preventDefault(); // Impede que o link abra no primeiro clique
                    item.classList.add('active'); // Ativa o overlay

                    // Define um timeout para remover a classe 'active' após 3 segundos
                    activeCertificateTimeout = setTimeout(() => {
                        item.classList.remove('active');
                        activeCertificateTimeout = null; // Limpa a referência do timeout
                    }, 3000); // 3000 milissegundos = 3 segundos
                }
            }
            // Para desktop, o CSS com :hover já cuida do efeito ao passar o mouse.
            // O clique normal em desktop deve abrir o link diretamente, o que é o comportamento padrão do <a>.
            // A lógica acima garante que em desktop, se o item já estiver ativo (o que não deve acontecer com hover),
            // ou se for um clique normal, o link funcione.
        });

        // Adiciona um listener para o caso de o usuário clicar fora do certificado ativo em mobile
        if (isTouchDevice) {
            document.addEventListener('click', (e) => {
                // Se houver um certificado ativo e o clique não foi nele
                if (item.classList.contains('active') && !item.contains(e.target)) {
                    item.classList.remove('active'); // Remove o overlay
                    if (activeCertificateTimeout) {
                        clearTimeout(activeCertificateTimeout); // Limpa o timeout se o usuário fechar manualmente
                        activeCertificateTimeout = null;
                    }
                }
            });
        }
    });
}

// ========================================
// EFEITO DE ZOOM NA FOTO DE PERFIL (MOBILE E DESKTOP)
// ========================================
const profilePhotoWrapper = document.querySelector('.profile-photo-wrapper');

if (profilePhotoWrapper) {
    const isTouchDevice =
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        navigator.msMaxTouchPoints > 0;

    if (isTouchDevice) {
        // Para dispositivos touch: zoom ao clicar
        profilePhotoWrapper.addEventListener('click', (e) => {
            e.stopPropagation(); // Impede que o clique se propague para o documento
            profilePhotoWrapper.classList.toggle('active'); // Ativa/desativa a classe 'active'
        });

        // Fecha o zoom ao clicar fora da imagem
        document.addEventListener('click', (e) => {
            if (profilePhotoWrapper.classList.contains('active') && !profilePhotoWrapper.contains(e.target)) {
                profilePhotoWrapper.classList.remove('active');
            }
        });
    }
    // Para desktop, o CSS com :hover já cuida do efeito.
    // Não precisamos de JS adicional para desktop aqui.
}
// ========================================
// ANIMAÇÃO DE VÍDEO NOS PROJETOS AO HOVER
// ========================================
const projectCards = document.querySelectorAll('.project-card');

if (projectCards.length > 0) {
    projectCards.forEach(card => {
        const video = card.querySelector('.project-video');

        if (video) {
            // Ao passar o mouse sobre o cartão
            card.addEventListener('mouseenter', () => {
                video.currentTime = 0; // Reinicia o vídeo
                video.play();          // Inicia a reprodução
            });

            // Ao tirar o mouse do cartão
            card.addEventListener('mouseleave', () => {
                video.pause();         // Pausa o vídeo
                video.currentTime = 0; // Volta para o início (opcional, mas bom para consistência)
            });
        }
    });
}
