// Authentication Module

async function login() {
    console.log('[login] Function called');
    const token = document.getElementById('tokenInput').value.trim();
    
    if (!token) {
        console.log('[login] No token provided');
        logErrorToken();
        return;
    }

    console.log('[login] Token length:', token.length);
    logAuthenticating();
    document.getElementById('loginBtn').disabled = true;

    try {
        console.log('[login] Fetching user data...');
        const response = await fetch(`${API_BASE}/users/@me`, {
            method: 'GET',
            headers: { 
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            // ログイン失敗時はボタンを有効化
            document.getElementById('loginBtn').disabled = false;
            
            if (response.status === 401) {
                throw new Error('無効または期限切れのトークンです');
            } else if (response.status === 403) {
                throw new Error('アクセスが拒否されました');
            } else {
                throw new Error(`HTTP ${response.status}`);
            }
        }

        const userData = await response.json();
        console.log('[login] User data received:', userData);
        
        window.appState.currentUser = userData;
        window.appState.userToken = token;
        console.log('[login] appState updated, userToken length:', token.length);

        const username = userData.discriminator && userData.discriminator !== '0'
            ? `${userData.username}#${userData.discriminator}` 
            : userData.username;
        
        console.log('[login] Username:', username);
        logAuthSuccess(username);
        logUserId(userData.id);
        
        // プロフィール情報を表示
        document.getElementById('userProfile').classList.remove('hidden');
        document.getElementById('profileAvatar').src = `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png?size=40`;
        document.getElementById('profileName').textContent = userData.global_name || userData.username;
        document.getElementById('profileId').textContent = `${username} | ${userData.id}`;
        
        // ログインボタンを非表示にし、ログアウトボタンを表示
        document.getElementById('loginButtonWrapper').classList.add('hidden');
        document.getElementById('logoutButtonWrapper').classList.remove('hidden');
        
        // 自分のユーザーIDを検索対象セクションに表示
        document.getElementById('myUserIdDisplay').textContent = '';
        
        document.getElementById('loginStatus').classList.add('active');
        
        console.log('[login] About to call loadGuilds()...');
        
        // サーバーリストを読み込み（エラーはloadGuilds内で処理）
        try {
            await loadGuilds();
            console.log('[login] loadGuilds() completed successfully');
        } catch (guildError) {
            // サーバー取得エラーはログに出力（認証は成功しているので認証失敗とは表示しない）
            console.error('[login] loadGuilds() error:', guildError);
            logError(`${t('serverListError')}: ${guildError.message}`);
        }
    } catch (error) {
        logAuthFailed(error.message);
        document.getElementById('loginBtn').disabled = false;
    }
}

function logout() {
    // 削除処理を停止
    if (window.appState.isDeleting) {
        window.appState.shouldStop = true;
        window.appState.isDeleting = false;
        logStoppingDeletion();
    }
    
    window.appState.userToken = '';
    window.appState.currentUser = null;
    window.appState.guilds = [];
    window.appState.channels = [];
    window.appState.selectedGuildId = null;
    window.appState.selectedChannelId = null;
    
    // UIをリセット - ログアウトボタンを非表示にし、ログインボタンを表示
    document.getElementById('logoutButtonWrapper').classList.add('hidden');
    document.getElementById('loginButtonWrapper').classList.remove('hidden');
    
    // ログインボタンを有効化
    document.getElementById('loginBtn').disabled = false;
    
    // プロフィール情報を非表示にしてクリア
    document.getElementById('userProfile').classList.add('hidden');
    document.getElementById('profileAvatar').src = '';
    document.getElementById('profileName').textContent = '';
    document.getElementById('profileId').textContent = '';
    
    // 自分のユーザーID表示をクリア
    document.getElementById('myUserIdDisplay').textContent = '';
    document.getElementById('serverSection').classList.add('hidden');
    document.getElementById('channelSection').classList.add('hidden');
    document.getElementById('searchSection').classList.add('hidden');
    document.getElementById('sortSection').classList.add('hidden');
    document.getElementById('dateSection').classList.add('hidden');
    document.getElementById('deleteOptionsSection').classList.add('hidden');
    document.getElementById('urlSection').classList.add('hidden');
    document.getElementById('deleteActionSection').classList.add('hidden');
    document.getElementById('statsSection')?.classList.add('hidden');
    document.getElementById('customChannelForm').classList.add('hidden');
    
    // カスタムチャンネルフォームをリセット
    document.getElementById('customChannelId').value = '';
    document.getElementById('channelValidationResult').classList.add('hidden');
    
    document.getElementById('loginStatus').classList.remove('active');
    document.getElementById('tokenInput').value = '';
    
    logLoggedOut();
}

function toggleLoginLogout() {
    const { userToken, currentUser } = window.appState;
    
    if (userToken && currentUser) {
        // ログイン中なのでログアウト
        logout();
    } else {
        // ログインしていないのでログイン実行
        login();
    }
}

