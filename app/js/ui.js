// ui.js - Versão corrigida com comportamento específico
console.log("📦 UI.js carregado");

// Variáveis globais
let currentRoute = null;
let isNavigating = false;
let tourSteps = ['objetivos', 'missao', 'tecnologias', 'jornada', 'assistente'];
let currentTourIndex = -1;

// Elementos DOM
const chat = document.getElementById("chat");
const menu = document.getElementById("menu");
const chatbotSection = document.getElementById("chatbot-section") || (() => {
    const section = document.createElement('section');
    section.id = 'chatbot-section';
    section.className = 'tela';
    section.style.cssText = 'position: absolute; inset: 0; display: none; justify-content: center; align-items: center;';
    
    const chatbotDiv = document.createElement('div');
    chatbotDiv.className = 'chatbot';
    
    const chatContainer = chat || document.createElement('div');
    if (!chat) {
        chatContainer.id = 'chat';
    }
    
    chatbotDiv.appendChild(chatContainer);
    section.appendChild(chatbotDiv);
    document.body.appendChild(section);
    return section;
})();

window.speechSynthesisAllowed = true;

/* ======================
   VOZ (APENAS PARA VOICE)
====================== */
function speak(text) {
    if ("speechSynthesis" in window && window.speechSynthesisAllowed) {
        window.speechSynthesis.cancel();
        const msg = new SpeechSynthesisUtterance(text);
        msg.lang = "pt-BR";
        msg.rate = 1;
        msg.pitch = 1;
        window.speechSynthesis.speak(msg);
        console.log("🔊 Falando:", text.substring(0, 50) + "...");
    }
}

/* ======================
   CHAT
====================== */
function clearChat() {
    if (chat) chat.innerHTML = "";
}

function renderTypingMessage(text, speed = 35, shouldSpeak = false) {
    if (!chat) return;
    
    const p = document.createElement("p");
    p.classList.add("message");
    chat.appendChild(p);

    let i = 0;
    function type() {
        if (i < text.length) {
            p.textContent += text[i++];
            setTimeout(type, speed);
        } else if (shouldSpeak) {
            speak(text); // SÓ fala se shouldSpeak for true
        }
    }
    type();
}

/* ======================
   BOTÕES
====================== */
function renderBackButton() {
    if (!chat) return;
    
    if (document.querySelector('.btn-voltar')) return;
    
    const btn = document.createElement("button");
    btn.classList.add("btn-voltar");
    btn.textContent = "← Voltar ao Menu";

    btn.onclick = () => {
        clearChat();
        menu.classList.add("tela-ativa");
        chatbotSection.style.display = 'none';
        window.speechSynthesis.cancel();
        currentRoute = null;
        currentTourIndex = -1;
    };

    chat.appendChild(btn);
}

function renderContinueButton() {
    if (!chat) return;
    
    if (document.querySelector('.btn-continuar')) return;
    
    const btn = document.createElement("button");
    btn.classList.add("btn-continuar");
    btn.textContent = "Continuar Tour →";
    
    btn.onclick = () => {
        if (currentTourIndex < tourSteps.length - 1) {
            currentTourIndex++;
            navigate(tourSteps[currentTourIndex], true);
        } else {
            clearChat();
            renderTypingMessage("🎉 Tour concluído! Espero que tenha gostado da jornada pela Lunar Code.", 40, false);
            setTimeout(renderBackButton, 2000);
        }
    };
    
    chat.appendChild(btn);
}

/* ======================
   NAVEGAÇÃO (CORRIGIDA)
====================== */
function navigate(routeKey, isTourStep = false) {
    if (isNavigating) return;
    isNavigating = true;
    
    clearChat();
    
    const data = window.routes[routeKey];
    if (!data) {
        console.warn("Rota não encontrada:", routeKey);
        renderTypingMessage("Conteúdo em desenvolvimento. Esta seção será atualizada em breve.", 40, false);
        setTimeout(renderBackButton, 2000);
        isNavigating = false;
        return;
    }
    
    currentRoute = routeKey;
    
    // Esconde menu e mostra chatbot
    menu.classList.remove("tela-ativa");
    menu.classList.add("tela");
    chatbotSection.style.display = 'flex';
    chatbotSection.classList.add("tela-ativa");
    
    // =========================================
    // 1. TOUR GUIADO (botão "Iniciar Tour")
    // =========================================
    if (isTourStep) {
        console.log("🚀 Tour Step:", routeKey);
        
        // A) VOZ: fala APENAS o resumo (data.voice)
        if (data.voice) {
            speak(data.voice);
        }
        
        // B) TEXTO: mostra APENAS a mensagem (data.message)
        if (data.message) {
            renderTypingMessage(data.message, 45, false); // false = NÃO fala
        }
        
        // C) Botão "Continuar"
        setTimeout(() => {
            renderContinueButton();
            isNavigating = false;
        }, 1500);
    } 
    // =========================================
    // 2. NAVEGAÇÃO NORMAL (cards individuais)
    // =========================================
    else {
        console.log("🧭 Navegação normal:", routeKey);
        
        // A) VOZ: fala APENAS o resumo (data.voice)
        if (data.voice) {
            speak(data.voice);
        }
        
        // B) TEXTO: mostra APENAS a mensagem (data.message) - SEM voz
        if (data.message) {
            renderTypingMessage(data.message, 45, false); // false = NÃO fala
        }
        
        // C) DETALHES: mostra APENAS texto - SEM voz
        if (data.details) {
            data.details.forEach((detail, index) => {
                setTimeout(() => {
                    renderTypingMessage(`• ${detail}`, 40, false); // false = NÃO fala
                }, 800 + (index * 1200));
            });
        }
        
        // D) TEXTO LONGO: mostra APENAS texto - SEM voz
        if (data.longText) {
            setTimeout(() => {
                renderTypingMessage(data.longText, 35, false); // false = NÃO fala
            }, 3000);
        }
        
        // E) Botão "Voltar"
        setTimeout(() => {
            renderBackButton();
            isNavigating = false;
        }, 4000);
    }
}

/* ======================
   CLIQUE NOS CARDS
====================== */
document.addEventListener("click", (event) => {
    const card = event.target.closest(".menu-card");
    if (!card || isNavigating) return;
    
    const section = card.dataset.section;
    if (!section) return;
    
    console.log("🧭 Card clicado (navegação normal):", section);
    event.stopPropagation();
    navigate(section, false); // false = NÃO é tour
});

/* ======================
   BOTÃO TOUR
====================== */
document.addEventListener('DOMContentLoaded', () => {
    const btnTour = document.getElementById('btnTour');
    if (btnTour) {
        btnTour.addEventListener('click', (event) => {
            event.stopPropagation();
            console.log("🚀 Iniciando Tour Guiado");
            currentTourIndex = 0;
            navigate(tourSteps[0], true); // true = É tour
        });
    }
});

// Verificar se routes foram carregadas
if (!window.routes) {
    console.warn("Aguardando carregamento de routes...");
    setTimeout(() => {
        if (!window.routes) {
            console.error("Routes não carregadas. Verifique data.js.");
        }
    }, 1000);
}

// Exportar funções (opcional)
window.navigate = navigate;
window.clearChat = clearChat;
window.renderTypingMessage = renderTypingMessage;