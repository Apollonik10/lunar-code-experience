// chatbot.js - apenas para controle de voz
let speechUnlocked = false;

export function initChatbot() {
    const chat = document.getElementById("chat");
    
    if (!chat) return;
    
    // Desbloquear voz no primeiro clique no chat
    chat.addEventListener("click", () => {
        if (!speechUnlocked) {
            speechUnlocked = true;
            window.speechSynthesisAllowed = true;
            console.log("🔊 Voz desbloqueada");
        }
    }, { once: true });
}

// Inicializar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatbot);
} else {
    initChatbot();
}