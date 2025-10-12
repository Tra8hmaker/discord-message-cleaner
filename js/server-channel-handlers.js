// Server and Channel Handlers - サーバー/チャンネル選択UI

async function loadGuilds() {
    // デバッグ: 関数が呼ばれたことを確認
    console.log('[loadGuilds] Function called');
    console.log('[loadGuilds] API_BASE:', API_BASE);
    console.log('[loadGuilds] userToken exists:', !!window.appState.userToken);
    
    logFetchingServers();

    try {
        const response = await fetch(`${API_BASE}/users/@me/guilds`, {
            headers: { 
                'Authorization': window.appState.userToken,
                'Content-Type': 'application/json'
            }
        });

        console.log('[loadGuilds] Response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.log('[loadGuilds] Error response:', errorText);
            throw new Error(`サーバー取得失敗: HTTP ${response.status} - ${errorText}`);
        }

        window.appState.guilds = await response.json();
        const selectButton = document.getElementById('serverSelectButton');
        const selectItems = document.getElementById('serverSelectItems');
        
        selectItems.innerHTML = '';

        // DMオプションを最初に追加
        const dmItem = document.createElement('div');
        dmItem.className = 'select-item';
        dmItem.dataset.guildId = 'DM';
        dmItem.style.borderBottom = '1px solid #2b2d31';
        dmItem.style.marginBottom = '8px';
        dmItem.innerHTML = `
            <div class="select-item-icon-placeholder" style="background: #5865f2;">💬</div>
            <div class="select-item-content">
                <div class="select-item-name" style="font-weight: 600;">${t('directMessages')}</div>
                <div class="select-item-id">@me</div>
            </div>
        `;
        dmItem.addEventListener('click', () => selectDM());
        selectItems.appendChild(dmItem);

        window.appState.guilds.forEach(guild => {
            const item = document.createElement('div');
            item.className = 'select-item';
            item.dataset.guildId = guild.id;
            
            // アイコン
            let iconHtml = '';
            if (guild.icon) {
                const iconExtension = guild.icon.startsWith('a_') ? 'gif' : 'png';
                const iconUrl = `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.${iconExtension}?size=64`;
                iconHtml = `<img src="${iconUrl}" class="select-item-icon" alt="">`;
            } else {
                const initial = guild.name.charAt(0).toUpperCase();
                iconHtml = `<div class="select-item-icon-placeholder">${initial}</div>`;
            }
            
            item.innerHTML = `
                ${iconHtml}
                <div class="select-item-content">
                    <div class="select-item-name">${guild.name}</div>
                    <div class="select-item-id">${guild.id}</div>
                </div>
            `;
            
            item.addEventListener('click', () => selectServer(guild));
            selectItems.appendChild(item);
        });

        // ドロップダウンの開閉（既存のリスナーをクリア）
        const newSelectButton = selectButton.cloneNode(true);
        selectButton.parentNode.replaceChild(newSelectButton, selectButton);
        
        newSelectButton.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            // 他のドロップダウンを閉じる
            const channelDropdown = document.getElementById('channelSelectItems');
            if (channelDropdown && !channelDropdown.classList.contains('hidden')) {
                channelDropdown.classList.add('hidden');
            }
            // このドロップダウンをトグル
            document.getElementById('serverSelectItems').classList.toggle('hidden');
        });

        console.log('[loadGuilds] Guilds loaded:', window.appState.guilds.length);
        logServersFetched(window.appState.guilds.length);
        document.getElementById('serverSection').classList.remove('hidden');
    } catch (error) {
        console.error('[loadGuilds] Error:', error);
        logError(error.message);
        throw error; // エラーを再スローして上位で捕捉
    }
}

function selectDM() {
    window.appState.selectedGuildId = 'DM';
    
    const selectButton = document.getElementById('serverSelectButton');
    const selectItems = document.getElementById('serverSelectItems');
    
    selectButton.innerHTML = `<div class="select-item-icon-placeholder" style="width: 24px; height: 24px; font-size: 12px; background: #5865f2;">💬</div><span>${t('directMessages')}</span>`;
    selectItems.classList.add('hidden');
    
    logServerSelected(t('directMessages'));
    loadDMChannels();
}

function selectServer(guild) {
    window.appState.selectedGuildId = guild.id;
    
    const selectButton = document.getElementById('serverSelectButton');
    const selectItems = document.getElementById('serverSelectItems');
    
    // ボタンの表示を更新
    let iconHtml = '';
    if (guild.icon) {
        const iconExtension = guild.icon.startsWith('a_') ? 'gif' : 'png';
        const iconUrl = `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.${iconExtension}?size=64`;
        iconHtml = `<img src="${iconUrl}" class="select-item-icon" alt="" style="width: 24px; height: 24px;">`;
    } else {
        const initial = guild.name.charAt(0).toUpperCase();
        iconHtml = `<div class="select-item-icon-placeholder" style="width: 24px; height: 24px; font-size: 12px;">${initial}</div>`;
    }
    
    selectButton.innerHTML = `${iconHtml}<span>${guild.name}</span>`;
    selectItems.classList.add('hidden');
    
    logServerSelected(guild.name);
    loadChannels();
}

async function loadDMChannels() {
    logChannelFetching(t('directMessages'));

    try {
        const response = await fetch(`${API_BASE}/users/@me/channels`, {
            headers: { 
                'Authorization': window.appState.userToken,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`${t('channelFetchFailed')}: HTTP ${response.status}`);
        }

        const dmChannels = await response.json();
        const selectButton = document.getElementById('channelSelectButton');
        const selectItems = document.getElementById('channelSelectItems');
        
        selectItems.innerHTML = '';

        // カスタムチャンネルオプションを追加
        const customItem = document.createElement('div');
        customItem.className = 'select-item';
        customItem.dataset.channelId = 'CUSTOM';
        customItem.style.borderBottom = '1px solid #2b2d31';
        customItem.style.marginBottom = '8px';
        customItem.innerHTML = `
            <div class="channel-icon">🔧</div>
            <div class="select-item-content">
                <div class="select-item-name" style="font-weight: 600;">${t('customChannel')}</div>
                <div class="select-item-id" data-lang="customChannelDesc">ID input support (threads, etc.)</div>
            </div>
        `;
        customItem.addEventListener('click', () => selectCustomChannel());
        selectItems.appendChild(customItem);

        dmChannels.forEach(channel => {
            const item = document.createElement('div');
            item.className = 'select-item';
            item.dataset.channelId = channel.id;
            
            const recipient = channel.recipients ? channel.recipients[0] : null;
            let displayName = 'Unknown User';
            let avatarHtml = '<div class="select-item-icon-placeholder">?</div>';
            
            if (recipient) {
                displayName = recipient.global_name || recipient.username;
                if (recipient.avatar) {
                    const avatarUrl = `https://cdn.discordapp.com/avatars/${recipient.id}/${recipient.avatar}.png?size=64`;
                    avatarHtml = `<img src="${avatarUrl}" class="select-item-icon" alt="" style="width: 24px; height: 24px; border-radius: 50%;">`;
                } else {
                    const defaultAvatar = parseInt(recipient.discriminator || '0') % 5;
                    const defaultAvatarUrl = `https://cdn.discordapp.com/embed/avatars/${defaultAvatar}.png`;
                    avatarHtml = `<img src="${defaultAvatarUrl}" class="select-item-icon" alt="" style="width: 24px; height: 24px; border-radius: 50%;">`;
                }
            }
            
            item.innerHTML = `
                ${avatarHtml}
                <div class="select-item-content">
                    <div class="select-item-name">${displayName}</div>
                    <div class="select-item-id">${channel.id}</div>
                </div>
            `;
            
            item.addEventListener('click', () => selectChannel(channel));
            selectItems.appendChild(item);
        });

        window.appState.channels = dmChannels;
        
        // ドロップダウンの開閉（既存のリスナーをクリア）
        const newChannelButton = selectButton.cloneNode(true);
        selectButton.parentNode.replaceChild(newChannelButton, selectButton);
        
        newChannelButton.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            // 他のドロップダウンを閉じる
            const serverDropdown = document.getElementById('serverSelectItems');
            if (serverDropdown && !serverDropdown.classList.contains('hidden')) {
                serverDropdown.classList.add('hidden');
            }
            // このドロップダウンをトグル
            document.getElementById('channelSelectItems').classList.toggle('hidden');
        });
        
        logDMChannelsFetched(dmChannels.length);
        document.getElementById('channelSection').classList.remove('hidden');
        document.getElementById('searchSection').classList.remove('hidden');
        document.getElementById('sortSection').classList.remove('hidden');
        document.getElementById('dateSection').classList.remove('hidden');
        document.getElementById('deleteOptionsSection').classList.remove('hidden');
        document.getElementById('deleteActionSection').classList.remove('hidden');
    } catch (error) {
        logError(error.message);
    }
}

async function loadChannels() {
    const selectedGuild = window.appState.guilds.find(g => g.id === window.appState.selectedGuildId);
    logChannelFetching(selectedGuild.name);

    try {
        const response = await fetch(`${API_BASE}/guilds/${window.appState.selectedGuildId}/channels`, {
            headers: { 
                'Authorization': window.appState.userToken,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`${t('channelFetchFailed')}: HTTP ${response.status}`);
        }

        const allChannels = await response.json();
        const selectButton = document.getElementById('channelSelectButton');
        const selectItems = document.getElementById('channelSelectItems');
        
        selectItems.innerHTML = '';

        const CHANNEL_TYPES = {
            GUILD_TEXT: 0,
            GUILD_VOICE: 2,
            GUILD_CATEGORY: 4,
            GUILD_NEWS: 5,
            GUILD_STAGE_VOICE: 13,
            GUILD_FORUM: 15
        };

        const categories = allChannels.filter(ch => ch.type === CHANNEL_TYPES.GUILD_CATEGORY)
            .sort((a, b) => a.position - b.position);
        
        const textChannels = allChannels.filter(ch => 
            ch.type === CHANNEL_TYPES.GUILD_TEXT || 
            ch.type === CHANNEL_TYPES.GUILD_NEWS ||
            ch.type === CHANNEL_TYPES.GUILD_FORUM
        );
        
        const voiceChannels = allChannels.filter(ch => 
            ch.type === CHANNEL_TYPES.GUILD_VOICE || 
            ch.type === CHANNEL_TYPES.GUILD_STAGE_VOICE
        );

        // サーバー全体オプションを最初に追加
        const serverWideItem = document.createElement('div');
        serverWideItem.className = 'select-item';
        serverWideItem.dataset.channelId = 'SERVER_WIDE';
        serverWideItem.style.borderBottom = '1px solid #2b2d31';
        serverWideItem.style.marginBottom = '8px';
        serverWideItem.innerHTML = `
            <div class="channel-icon">🌐</div>
            <div class="select-item-content">
                <div class="select-item-name" style="font-weight: 600;">${t('serverWide')}</div>
                <div class="select-item-id">${t('allChannels')}</div>
            </div>
        `;
        serverWideItem.addEventListener('click', () => selectServerWide());
        selectItems.appendChild(serverWideItem);

        // カスタムチャンネルオプションを追加
        const customItem = document.createElement('div');
        customItem.className = 'select-item';
        customItem.dataset.channelId = 'CUSTOM';
        customItem.style.borderBottom = '1px solid #2b2d31';
        customItem.style.marginBottom = '8px';
        customItem.innerHTML = `
            <div class="channel-icon">🔧</div>
            <div class="select-item-content">
                <div class="select-item-name" style="font-weight: 600;">${t('customChannel')}</div>
                <div class="select-item-id" data-lang="customChannelDesc">ID input support (threads, etc.)</div>
            </div>
        `;
        customItem.addEventListener('click', () => selectCustomChannel());
        selectItems.appendChild(customItem);

        // カテゴリなしのチャンネルを追加
        const channelsWithoutCategory = textChannels.filter(ch => !ch.parent_id)
            .sort((a, b) => a.position - b.position);
        
        channelsWithoutCategory.forEach(channel => {
            const item = createChannelItem(channel, 'text');
            selectItems.appendChild(item);
        });
        
        // カテゴリなしのボイスチャンネルを追加
        const voiceChannelsWithoutCategory = voiceChannels.filter(ch => !ch.parent_id)
            .sort((a, b) => a.position - b.position);
        
        voiceChannelsWithoutCategory.forEach(channel => {
            const item = createChannelItem(channel, 'voice');
            selectItems.appendChild(item);
        });

        // カテゴリごとにチャンネルを表示
        categories.forEach(category => {
            // カテゴリヘッダーを追加
            const categoryHeader = document.createElement('div');
            categoryHeader.className = 'category-header';
            categoryHeader.textContent = category.name.toUpperCase();
            selectItems.appendChild(categoryHeader);
            
            // カテゴリ内のテキストチャンネルを追加
            const channelsInCategory = textChannels.filter(ch => ch.parent_id === category.id)
                .sort((a, b) => a.position - b.position);
            
            channelsInCategory.forEach(channel => {
                const item = createChannelItem(channel, 'text', true); // true = インデント
                selectItems.appendChild(item);
            });
            
            // カテゴリ内のボイスチャンネルを追加
            const voiceChannelsInCategory = voiceChannels.filter(ch => ch.parent_id === category.id)
                .sort((a, b) => a.position - b.position);
            
            voiceChannelsInCategory.forEach(channel => {
                const item = createChannelItem(channel, 'voice', true); // true = インデント
                selectItems.appendChild(item);
            });
        });

        window.appState.channels = textChannels;
        
        // ドロップダウンの開閉（既存のリスナーをクリア）
        const newChannelButton = selectButton.cloneNode(true);
        selectButton.parentNode.replaceChild(newChannelButton, selectButton);
        
        newChannelButton.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            // 他のドロップダウンを閉じる
            const serverDropdown = document.getElementById('serverSelectItems');
            if (serverDropdown && !serverDropdown.classList.contains('hidden')) {
                serverDropdown.classList.add('hidden');
            }
            // このドロップダウンをトグル
            document.getElementById('channelSelectItems').classList.toggle('hidden');
        });
        
        logTextVoiceChannelsFetched(textChannels.length, voiceChannels.length);
        document.getElementById('channelSection').classList.remove('hidden');
    } catch (error) {
        logError(error.message);
    }
}

function createChannelItem(channel, type, isIndented = false) {
    const item = document.createElement('div');
    item.className = `select-item channel-item ${type === 'voice' ? 'voice-channel' : ''} ${isIndented ? 'indented-channel' : ''}`;
    item.dataset.channelId = channel.id;
    
    let icon = '#';
    if (type === 'voice') {
        icon = channel.type === 13 ? '🎙️' : '🔊';
    } else if (channel.type === 5) {
        icon = '📢';
    } else if (channel.type === 15) {
        icon = '💬';
    }
    
    item.innerHTML = `
        <div class="channel-icon">${icon}</div>
        <div class="select-item-content">
            <div class="select-item-name">${channel.name}</div>
            <div class="select-item-id">${channel.id}</div>
        </div>
    `;
    
    item.addEventListener('click', () => selectChannel(channel));
    return item;
}

function selectServerWide() {
    window.appState.selectedChannelId = 'SERVER_WIDE';
    
    const selectButton = document.getElementById('channelSelectButton');
    const selectItems = document.getElementById('channelSelectItems');
    
    selectButton.innerHTML = `<div class="channel-icon">🌐</div><span>${t('serverWide')}</span>`;
    selectItems.classList.add('hidden');
    
    document.getElementById('customChannelForm').classList.add('hidden');
    
    logSelectedItem(t('serverWide'));
    
    document.getElementById('searchSection').classList.remove('hidden');
    document.getElementById('sortSection').classList.remove('hidden');
    document.getElementById('dateSection').classList.remove('hidden');
    document.getElementById('urlSection').classList.remove('hidden');
    document.getElementById('deleteOptionsSection').classList.remove('hidden');
    document.getElementById('deleteActionSection').classList.remove('hidden');
    
    updateSearchUrl();
}

function selectCustomChannel() {
    window.appState.selectedChannelId = 'CUSTOM';
    
    const selectButton = document.getElementById('channelSelectButton');
    const selectItems = document.getElementById('channelSelectItems');
    
    selectButton.innerHTML = `<div class="channel-icon">🔧</div><span>${t('customChannel')}</span>`;
    selectItems.classList.add('hidden');
    
    document.getElementById('customChannelForm').classList.remove('hidden');
    
    logSelectedItem(t('customChannel'));
}

function selectChannel(channel) {
    window.appState.selectedChannelId = channel.id;
    
    const selectButton = document.getElementById('channelSelectButton');
    const selectItems = document.getElementById('channelSelectItems');
    
    // DMチャンネルの場合の処理
    if (window.appState.selectedGuildId === 'DM') {
        const recipient = channel.recipients ? channel.recipients[0] : null;
        let displayName = 'Unknown User';
        let avatarUrl = '';
        
        if (recipient) {
            displayName = recipient.global_name || recipient.username;
            if (recipient.avatar) {
                avatarUrl = `https://cdn.discordapp.com/avatars/${recipient.id}/${recipient.avatar}.png?size=24`;
            } else {
                avatarUrl = `https://cdn.discordapp.com/embed/avatars/${parseInt(recipient.discriminator || '0') % 5}.png`;
            }
        }
        
        selectButton.innerHTML = `<img src="${avatarUrl}" class="select-item-icon" alt="" style="width: 24px; height: 24px; border-radius: 50%;"><span>${displayName}</span>`;
    } else {
        // 通常のサーバーチャンネルの場合
        let icon = '#';
        if (channel.type === 2) {
            icon = '🔊';
        } else if (channel.type === 13) {
            icon = '🎙️';
        } else if (channel.type === 5) {
            icon = '📢';
        } else if (channel.type === 15) {
            icon = '💬';
        }
        
        selectButton.innerHTML = `<div class="channel-icon">${icon}</div><span>${channel.name}</span>`;
    }
    
    selectItems.classList.add('hidden');
    document.getElementById('customChannelForm').classList.add('hidden');
    
    const logName = channel.name || (channel.recipients ? (channel.recipients[0]?.global_name || channel.recipients[0]?.username || 'Unknown') : 'Unknown');
    logChannelSelected(logName);
    
    document.getElementById('searchSection').classList.remove('hidden');
    document.getElementById('sortSection').classList.remove('hidden');
    document.getElementById('dateSection').classList.remove('hidden');
    document.getElementById('urlSection').classList.remove('hidden');
    document.getElementById('deleteOptionsSection').classList.remove('hidden');
    document.getElementById('deleteActionSection').classList.remove('hidden');
    
    updateSearchUrl();
}

async function validateCustomChannel() {
    const channelIdInput = document.getElementById('customChannelId');
    const validateBtn = document.querySelector('.validate-btn');
    const resultDiv = document.getElementById('channelValidationResult');
    
    const channelId = channelIdInput.value.trim();
    
    if (!channelId) {
        showValidationResult('error', t('invalidChannelId'));
        return;
    }
    
    if (!/^\d{17,19}$/.test(channelId)) {
        showValidationResult('error', t('invalidChannelId'));
        return;
    }
    
    validateBtn.disabled = true;
    validateBtn.textContent = '確認中...';
    
    try {
        const response = await fetch(`${API_BASE}/channels/${channelId}`, {
            headers: { 
                'Authorization': window.appState.userToken,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const channelData = await response.json();
            const channelName = channelData.name || `Channel ${channelId}`;
            showValidationResult('success', `${t('channelExists')}: ${channelName}`);
            
            window.appState.selectedChannelId = channelId;
            
            const selectButton = document.getElementById('channelSelectButton');
            const selectItems = document.getElementById('channelSelectItems');
            
            selectButton.innerHTML = `<div class="channel-icon">#</div><span>${channelName}</span>`;
            selectItems.classList.add('hidden');
            
            document.getElementById('searchSection').classList.remove('hidden');
            document.getElementById('sortSection').classList.remove('hidden');
            document.getElementById('dateSection').classList.remove('hidden');
            document.getElementById('urlSection').classList.remove('hidden');
            document.getElementById('deleteOptionsSection').classList.remove('hidden');
            document.getElementById('deleteActionSection').classList.remove('hidden');
            
            logSelectedItemWithId(channelName, channelId);
        } else if (response.status === 404) {
            showValidationResult('error', t('channelNotFound'));
        } else {
            showValidationResult('error', `HTTP ${response.status}`);
        }
    } catch (error) {
        showValidationResult('error', error.message);
    } finally {
        validateBtn.disabled = false;
        validateBtn.textContent = t('validateChannel');
    }
}

function showValidationResult(type, message) {
    const resultDiv = document.getElementById('channelValidationResult');
    resultDiv.className = `channel-validation-result ${type}`;
    resultDiv.textContent = message;
    resultDiv.classList.remove('hidden');
}

async function verifyUser() {
    const userId = document.getElementById('otherUserId').value.trim();
    
    if (!userId) {
        logUserIdRequired();
        return;
    }

    if (!window.appState.userToken) {
        logAuthRequired();
        return;
    }

    const btn = document.getElementById('verifyUserBtn');
    btn.disabled = true;
    btn.textContent = t('verifying');
    
    try {
        let userData = null;
        
        if (window.appState.selectedGuildId) {
            try {
                const response = await fetch(`${API_BASE}/guilds/${window.appState.selectedGuildId}/members/${userId}`, {
                    headers: { 
                        'Authorization': window.appState.userToken,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const memberData = await response.json();
                    userData = memberData.user;
                }
            } catch (error) {
                // ギルドメンバーから取得失敗した場合は次の方法へ
            }
        }
        
        if (!userData) {
            const response = await fetch(`${API_BASE}/users/${userId}`, {
                headers: { 
                    'Authorization': window.appState.userToken,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`ユーザーが見つかりません (HTTP ${response.status})`);
            }

            userData = await response.json();
        }

        // ユーザー情報を表示
        const avatarUrl = userData.avatar 
            ? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png?size=128`
            : `https://cdn.discordapp.com/embed/avatars/${parseInt(userData.discriminator || '0') % 5}.png`;
        
        const username = userData.discriminator && userData.discriminator !== '0'
            ? `${userData.username}#${userData.discriminator}` 
            : userData.username;
        
        document.getElementById('verifiedUserAvatar').src = avatarUrl;
        document.getElementById('verifiedUserName').textContent = userData.global_name || userData.username;
        document.getElementById('verifiedUsername').textContent = username;
        document.getElementById('verifiedUserId').textContent = userData.id;
        document.getElementById('userVerifyResult').classList.remove('hidden');
        
        logUserVerified(username);
        updateSearchUrl();
    } catch (error) {
        logUserVerifyFailed(error.message);
        document.getElementById('userVerifyResult').classList.add('hidden');
    } finally {
        btn.disabled = false;
        btn.innerHTML = `<span style="margin-right: 4px;">👤</span><span data-lang="verify">${t('verify')}</span>`;
    }
}

