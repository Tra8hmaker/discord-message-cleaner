// Main Application Initialization

// URLパラメータからreferrer情報を取得
const urlParams = new URLSearchParams(window.location.search);
const referrerPage = urlParams.get('from') || 'direct';

// Referrer情報を保存
sessionStorage.setItem('lastPage', 'index');
if (referrerPage) {
    sessionStorage.setItem('referrerPage', referrerPage);
}

// ============================================
// Settings - 言語/テーマ切り替え
// ============================================

function updateLanguage() {
    const { currentLanguage, isDeleting, selectedGuildId, selectedChannelId } = window.appState;
    
    // すべてのdata-lang要素を更新（ただし、選択されたサーバー/チャンネルとURLは除外）
    document.querySelectorAll('[data-lang]').forEach(element => {
        const key = element.getAttribute('data-lang');
        
        // 言語コードが直接指定されている場合（token-help用）
        if (key === 'ja' || key === 'en') {
            if (key === currentLanguage) {
                element.style.display = '';
                element.classList.remove('lang-hidden');
            } else {
                element.style.display = 'none';
                element.classList.add('lang-hidden');
            }
            return;
        }
        
        // 翻訳キーが指定されている場合（通常のコンテンツ用）
        if (translations[key] && translations[key][currentLanguage]) {
            // サーバー選択ボタンとチャンネル選択ボタンの場合は、選択状態をチェック
            if (element.id === 'serverSelectButton') {
                // サーバーが選択されていない場合のみデフォルトテキストを更新
                if (!selectedGuildId) {
                    element.textContent = translations[key][currentLanguage];
                }
            } else if (element.id === 'channelSelectButton') {
                // チャンネルが選択されていない場合のみデフォルトテキストを更新
                if (!selectedChannelId) {
                    element.textContent = translations[key][currentLanguage];
                }
            } else if (element.id === 'generatedUrl') {
                // URL要素の場合は、生成中の状態の場合のみテキストを更新
                if (element.textContent.includes('生成中') || element.textContent.includes('Generating')) {
                    element.textContent = translations[key][currentLanguage];
                }
            } else if (element.id === 'mainActionBtn') {
                // 削除ボタンの場合は、状態に応じてテキストを更新
                if (isDeleting) {
                    // 削除中の場合は「停止」テキストを表示
                    element.textContent = translations.stop[currentLanguage];
                } else if (element.disabled && (element.textContent.includes('停止中') || element.textContent.includes('Stopping'))) {
                    // 停止中の場合は「停止中...」テキストを表示
                    element.textContent = translations.stopping[currentLanguage];
                } else {
                    // 通常の場合は「削除開始」テキストを表示
                    element.textContent = translations[key][currentLanguage];
                }
            } else if (element.id === 'loginBtn') {
                // ログインボタンの場合は、状態に応じてテキストを更新
                if (element.classList.contains('logout-btn')) {
                    // ログアウトボタンの場合
                    element.textContent = translations.logout[currentLanguage];
                } else if (element.classList.contains('secondary') && (element.textContent.includes('リセット') || element.textContent.includes('Reset'))) {
                    // リセットボタンの場合
                    element.textContent = translations.reset[currentLanguage];
                } else {
                    // 通常のログインボタンの場合
                    element.textContent = translations[key][currentLanguage];
                }
            } else {
                // その他の要素は通常通り更新
                element.textContent = translations[key][currentLanguage];
            }
        }
    });
    
    // プレースホルダーを更新
    document.querySelectorAll('[data-lang-placeholder]').forEach(element => {
        const key = element.getAttribute('data-lang-placeholder');
        if (translations[key] && translations[key][currentLanguage]) {
            element.placeholder = translations[key][currentLanguage];
        }
    });
}

function toggleLanguage() {
    window.appState.currentLanguage = window.appState.currentLanguage === 'ja' ? 'en' : 'ja';
    
    // 言語表示を更新
    updateLanguageButton();
    
    // すべてのテキストを更新
    updateLanguage();
    
    // Aboutセクションが表示されている場合、READMEを再読み込み
    const aboutSection = document.getElementById('aboutSection');
    if (aboutSection && !aboutSection.classList.contains('hidden')) {
        console.log('Language changed, reloading README...');
        const aboutContent = document.getElementById('aboutContent');
        aboutContent.innerHTML = '<p>Loading...</p>';
        aboutContent.dataset.loadedLanguage = '';
        
        // 少し遅延してから再読み込み
        setTimeout(() => {
            loadAboutContent();
        }, 100);
    }
    
    // localStorageに保存
    localStorage.setItem('language', window.appState.currentLanguage);
}

function updateLanguageButton() {
    const languageText = document.getElementById('languageText');
    const languageTextShort = document.getElementById('languageTextShort');
    if (window.appState.currentLanguage === 'ja') {
        languageText.textContent = '日本語';
        languageTextShort.textContent = '日';
    } else {
        languageText.textContent = 'English';
        languageTextShort.textContent = 'EN';
    }
}

function toggleTheme() {
    window.appState.currentTheme = window.appState.currentTheme === 'dark' ? 'light' : 'dark';
    
    // テーマを適用
    if (window.appState.currentTheme === 'light') {
        document.body.classList.add('light-theme');
    } else {
        document.body.classList.remove('light-theme');
    }
    
    // テーマボタンを更新
    updateThemeButton();
    
    // localStorageに保存
    localStorage.setItem('theme', window.appState.currentTheme);
}

function updateThemeButton() {
    const themeText = document.getElementById('themeText');
    if (window.appState.currentTheme === 'dark') {
        themeText.textContent = '🌙';
    } else {
        themeText.textContent = '☀️';
    }
}

function setSortOrder(order) {
    window.appState.currentSortOrder = order;
    
    // アクティブ状態を更新
    document.getElementById('newestFirstOption').classList.toggle('active', order === 'newest');
    document.getElementById('oldestFirstOption').classList.toggle('active', order === 'oldest');
    
    // URLを更新
    updateSearchUrl();
}

// README読み込み処理を独立した関数として分離
async function loadAboutContent() {
    const aboutContent = document.getElementById('aboutContent');
    const currentLanguage = window.appState?.currentLanguage || 'en';
    const readmeFile = currentLanguage === 'ja' ? './README.ja.md' : './README.md';
    
    try {
        console.log(`About: ${readmeFile}を読み込み中...`);
        const response = await fetch(readmeFile);
        console.log('About: fetch response status =', response.status);
        console.log('About: fetch response ok =', response.ok);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const markdown = await response.text();
        console.log(`About: ${readmeFile}読み込み成功`, markdown.length, '文字');
        console.log('About: markdown content preview:', markdown.substring(0, 100) + '...');
        
        // 簡易的なマークダウン→HTML変換
        let html = markdown
            .replace(/^# (.+)$/gm, '<h2>$1</h2>')
            .replace(/^## (.+)$/gm, '<h3>$1</h3>')
            .replace(/^### (.+)$/gm, '<h4>$1</h4>')
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/⚠️/g, '<span class="warning-icon">⚠️</span>')
            .replace(/^- (.+)$/gm, '<li>$1</li>')
            .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/^(?!<[hul])/gm, '<p>')
            .replace(/([^>])\n/g, '$1</p>')
            .replace(/<p><\/p>/g, ''); // 空のpタグを削除
        
        aboutContent.innerHTML = html;
        aboutContent.dataset.loadedLanguage = currentLanguage;
        console.log('About: HTML変換完了');
    } catch (error) {
        console.error(`About: ${readmeFile}読み込みエラー:`, error);
        aboutContent.innerHTML = `<p>${readmeFile}の読み込みに失敗しました: ${error.message}</p>`;
    }
}

// グローバルスコープで利用可能にする
window.toggleAbout = async function toggleAbout() {
    console.log('toggleAbout: 関数が呼び出されました');
    const aboutSection = document.getElementById('aboutSection');
    const aboutContent = document.getElementById('aboutContent');
    
    console.log('toggleAbout: aboutSection =', aboutSection);
    console.log('toggleAbout: aboutContent =', aboutContent);
    
    // 既に表示されている場合は閉じる
    if (!aboutSection.classList.contains('hidden')) {
        console.log('toggleAbout: セクションを閉じます');
        aboutSection.classList.add('hidden');
        return;
    }
    
    // セクションを表示
    console.log('toggleAbout: セクションを表示します');
    aboutSection.classList.remove('hidden');
    
    // READMEを読み込む
    const contentText = aboutContent.innerHTML.trim();
    console.log('toggleAbout: trimmed content =', contentText);
    
    if (contentText === '<p>Loading...</p>' || contentText.includes('Loading...')) {
        await loadAboutContent();
    } else {
        // 既に読み込まれている場合、言語が変わったかチェック
        const currentLanguage = window.appState?.currentLanguage || 'en';
        const loadedLanguage = aboutContent.dataset.loadedLanguage;
        if (loadedLanguage !== currentLanguage) {
            console.log(`About: 言語が変更されました (${loadedLanguage} → ${currentLanguage})、再読み込みします`);
            aboutContent.innerHTML = '<p>Loading...</p>';
            aboutContent.dataset.loadedLanguage = '';
            await loadAboutContent();
        }
    }
};

function initializeSettings() {
    // localStorageから設定を読み込み
    const savedLanguage = localStorage.getItem('language');
    const savedTheme = localStorage.getItem('theme');
    
    if (savedLanguage && savedLanguage !== window.appState.currentLanguage) {
        window.appState.currentLanguage = savedLanguage;
    }
    updateLanguageButton();
    
    // すべてのテキストを初期化
    updateLanguage();
    
    if (savedTheme && savedTheme !== window.appState.currentTheme) {
        window.appState.currentTheme = savedTheme;
    }
    
    // テーマを適用（初期化時）
    if (window.appState.currentTheme === 'light') {
        document.body.classList.add('light-theme');
    } else {
        document.body.classList.remove('light-theme');
    }
    
    updateThemeButton();
}

// ============================================
// DOMContentLoaded時の初期化処理
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded');
    console.log('About button element:', document.getElementById('aboutBtn'));
    console.log('toggleAbout function:', typeof window.toggleAbout);
    // 設定を初期化
    initializeSettings();
    
    // Referrer情報をコンソールに出力（デバッグ用）
    if (referrerPage && referrerPage !== 'direct') {
        logDebug(`📍 Page referrer: ${referrerPage}`);
        // 必要に応じて、特定のページから来た場合の処理を追加できます
        // 例: if (referrerPage === 'token-help') { /* 特別な処理 */ }
    }
    
    // 保存されたトークンを自動読み込み
    const savedToken = localStorage.getItem('discordToken');
    if (savedToken) {
        document.getElementById('tokenInput').value = savedToken;
    }
    
    // トークン入力時に自動保存
    document.getElementById('tokenInput').addEventListener('input', (e) => {
        const token = e.target.value.trim();
        if (token) {
            localStorage.setItem('discordToken', token);
        }
    });
    
    // Enterキーでログイン
    document.getElementById('tokenInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            login();
        }
    });
    
    // ユーザーID入力でEnterキー
    document.getElementById('otherUserId').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            verifyUser();
        }
    });
    
    // 削除速度スライダー
    const speedSlider = document.getElementById('deleteSpeed');
    const speedValue = document.getElementById('speedValue');
    speedSlider.addEventListener('input', (e) => {
        speedValue.textContent = e.target.value;
    });
    
    // 検索対象の変更を監視
    const radios = document.querySelectorAll('input[name="searchTarget"]');
    radios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const otherUserField = document.getElementById('otherUserField');
            if (e.target.value === 'other') {
                otherUserField.classList.remove('hidden');
            } else {
                otherUserField.classList.add('hidden');
            }
            updateSearchUrl();
        });
    });
    
    // ドロップダウンを外側クリックで閉じる
    document.addEventListener('click', (e) => {
        const serverDropdown = document.getElementById('serverSelectItems');
        const channelDropdown = document.getElementById('channelSelectItems');
        
        // サーバー選択ドロップダウンを閉じる
        if (serverDropdown && !serverDropdown.classList.contains('hidden')) {
            if (!e.target.closest('#serverSelectWrapper')) {
                serverDropdown.classList.add('hidden');
            }
        }
        
        // チャンネル選択ドロップダウンを閉じる
        if (channelDropdown && !channelDropdown.classList.contains('hidden')) {
            if (!e.target.closest('#channelSelectWrapper')) {
                channelDropdown.classList.add('hidden');
            }
        }
    });
});

