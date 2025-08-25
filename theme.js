// theme.js - alternância de modo claro/escuro
function applyTheme() {
    const theme = localStorage.getItem('theme') || 'dark';
    document.body.classList.toggle('light-mode', theme === 'light');
    const btn = document.getElementById('theme-toggle');
    if (btn) {
        btn.textContent = theme === 'light' ? '🌞 Modo Claro' : '🌙 Modo Escuro';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    applyTheme();
    const btn = document.getElementById('theme-toggle');
    if (btn) {
        btn.onclick = function() {
            const current = localStorage.getItem('theme') || 'dark';
            const next = current === 'dark' ? 'light' : 'dark';
            localStorage.setItem('theme', next);
            applyTheme();
        };
    }
});
