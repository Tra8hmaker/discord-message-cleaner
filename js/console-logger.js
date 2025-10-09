// Console Logger Module

function log(message, type = 'info') {
    const console = document.getElementById('console');
    const line = document.createElement('div');
    line.className = `console-line ${type}`;
    const timestamp = new Date().toLocaleTimeString('ja-JP', { hour12: false });
    line.textContent = `[${timestamp}] ${message}`;
    console.appendChild(line);
    
    // 500行を超えた場合、古い行から削除
    const lines = console.querySelectorAll('.console-line');
    if (lines.length > 500) {
        lines[0].remove();
    }
    
    console.scrollTop = console.scrollHeight;
}

function clearConsole() {
    const consoleElement = document.getElementById('console');
    
    // コンソールラインのみを削除
    const consoleLines = consoleElement.querySelectorAll('.console-line');
    consoleLines.forEach(line => line.remove());
    
    log(translations.consoleCleared[window.appState.currentLanguage], 'info');
}

