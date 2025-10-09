// URL Builder Module

function updateSearchUrl() {
    const { selectedGuildId, selectedChannelId, currentUser, currentSortOrder } = window.appState;
    
    if (!selectedGuildId || !selectedChannelId) {
        return;
    }

    const searchTarget = document.querySelector('input[name="searchTarget"]:checked').value;
    let authorId = null;
    
    if (searchTarget === 'self' && currentUser) {
        authorId = currentUser.id;
    } else if (searchTarget === 'other') {
        authorId = document.getElementById('otherUserId').value.trim();
    }

    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    let minId = null;
    let maxId = null;
    
    if (startDate) {
        const startTimestamp = new Date(startDate + 'T00:00:00').getTime();
        minId = timestampToSnowflake(startTimestamp);
    }
    if (endDate) {
        const endTimestamp = new Date(endDate + 'T23:59:59').getTime();
        maxId = timestampToSnowflake(endTimestamp);
    }

    // URLを生成（DMの場合は直接channels、サーバーの場合はguildsエンドポイントを使用）
    let url;
    let params = [];
    
    if (selectedGuildId === 'DM') {
        // DMの場合は直接channelsエンドポイントを使用
        url = `${API_BASE}/channels/${selectedChannelId}/messages/search`;
    } else {
        // サーバーの場合はguildsエンドポイントを使用
        url = `${API_BASE}/guilds/${selectedGuildId}/messages/search`;
        if (selectedChannelId !== 'SERVER_WIDE') {
            params.push(`channel_id=${selectedChannelId}`);
        }
    }
    if (authorId) params.push(`author_id=${authorId}`);
    if (minId) params.push(`min_id=${minId}`);
    if (maxId) params.push(`max_id=${maxId}`);
    params.push(`sort_by=timestamp`);
    params.push(`sort_order=${currentSortOrder === 'oldest' ? 'asc' : 'desc'}`);
    params.push(`offset=0`);
    
    url += '?' + params.join('&');

    document.getElementById('generatedUrl').textContent = url;
}

