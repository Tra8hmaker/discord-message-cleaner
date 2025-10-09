// Message API Module - メッセージ取得・削除処理

async function deleteMessage(channelId, messageId) {
    console.log(`[deleteMessage] Attempting to delete message ${messageId} in channel ${channelId}`);
    try {
        const response = await fetch(`${API_BASE}/channels/${channelId}/messages/${messageId}`, {
            method: 'DELETE',
            headers: { 
                'Authorization': window.appState.userToken,
                'Content-Type': 'application/json'
            }
        });

        console.log(`[deleteMessage] Response status for ${messageId}:`, response.status);

        if (response.status === 429) {
            const retryAfter = response.headers.get('Retry-After') || 5;
            console.log(`[deleteMessage] Rate limited! Retry-After: ${retryAfter} seconds`);
            logRateLimit(retryAfter);
            await sleep(retryAfter * 1000);
            console.log(`[deleteMessage] Retrying after rate limit for ${messageId}`);
            return await deleteMessage(channelId, messageId);
        }

        if (response.status === 403) {
            console.log(`[deleteMessage] Permission error for ${messageId}`);
            logPermissionError();
            return 'permission_error';
        }

        if (response.ok || response.status === 204) {
            console.log(`[deleteMessage] Successfully deleted ${messageId}`);
            logDeleteSuccess(messageId);
            return true;
        }

        console.log(`[deleteMessage] Failed to delete ${messageId}, status: ${response.status}`);
        logDeleteFailed(messageId, response.status);
        return false;
    } catch (error) {
        console.log(`[deleteMessage] Exception while deleting ${messageId}:`, error.message);
        logDeleteFailedWithError(messageId, error.message);
        return false;
    }
}

async function deleteMessagesInChannel(guildId, channelId) {
    console.log('[deleteMessagesInChannel] Called with:', guildId, channelId);
    let totalMessages = 0;
    let deletedCount = 0;
    let failedCount = 0;

    const { currentUser } = window.appState;
    
    if (!currentUser || !currentUser.id) {
        console.log('[deleteMessagesInChannel] No current user or user ID');
        logUserIdNotAvailable();
        return { totalMessages, deletedCount, failedCount };
    }
    
    console.log('[deleteMessagesInChannel] Current user ID:', currentUser.id);

    // 検索対象を取得
    const searchTargetElement = document.querySelector('input[name="searchTarget"]:checked');
    let searchTarget, authorId;
    
    if (!searchTargetElement) {
        console.log('[deleteMessagesInChannel] No search target selected, defaulting to self');
        searchTarget = 'self';
        authorId = currentUser.id;
        logSearchTarget(t('myMessages'), currentUser.id);
    } else {
        searchTarget = searchTargetElement.value;
        console.log('[deleteMessagesInChannel] Search target:', searchTarget);
        
        if (searchTarget === 'self') {
            authorId = currentUser.id;
            logSearchTarget(t('myMessages'), currentUser.id);
        } else if (searchTarget === 'other') {
            authorId = document.getElementById('otherUserId').value.trim();
            if (!authorId) {
                logErrorMessage('userIdRequired');
                return { totalMessages, deletedCount, failedCount };
            }
            logSearchTarget(t('otherUserMessages'), authorId);
        } else {
            logSearchTarget(t('allUserMessages'));
        }
    }
    
    console.log('[deleteMessagesInChannel] Author ID:', authorId);

    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    let minId = null;
    let maxId = null;
    
    if (startDate) {
        const startTimestamp = new Date(startDate + 'T00:00:00').getTime();
        minId = timestampToSnowflake(startTimestamp);
        logDateFilter(startDate, 'after');
    }
    if (endDate) {
        const endTimestamp = new Date(endDate + 'T23:59:59').getTime();
        maxId = timestampToSnowflake(endTimestamp);
        logDateFilter(endDate, 'before');
    }

    logStep1();
    
    // ソート順序を取得
    const deleteOldFirst = window.appState.currentSortOrder === 'oldest';
    
    let offset = 0;
    const limit = 25;
    let hasMorePages = true;
    let totalResultsFromAPI = null;
    
    console.log('[deleteMessagesInChannel] Starting pagination loop...');
    
    while (hasMorePages && !window.appState.shouldStop) {
        console.log('[deleteMessagesInChannel] Loop iteration, offset:', offset);
        try {
            // 生成されたURLからメッセージを取得（DMの場合は直接channels、サーバーの場合はguildsエンドポイントを使用）
            let url;
            let params = [];
            
            if (guildId === 'DM') {
                // DMの場合は直接channelsエンドポイントを使用
                url = `${API_BASE}/channels/${channelId}/messages/search`;
            } else {
                // サーバーの場合はguildsエンドポイントを使用
                url = `${API_BASE}/guilds/${guildId}/messages/search`;
                if (channelId !== 'SERVER_WIDE') {
                    params.push(`channel_id=${channelId}`);
                }
            }
            if (authorId) params.push(`author_id=${authorId}`);
            if (minId) params.push(`min_id=${minId}`);
            if (maxId) params.push(`max_id=${maxId}`);
            
            // 古い順に削除するオプション
            const sortOrder = deleteOldFirst ? 'asc' : 'desc';
            params.push(`sort_by=timestamp`);
            params.push(`sort_order=${sortOrder}`);
            params.push(`offset=${offset}`);
            
            url += '?' + params.join('&');
            
            console.log('[deleteMessagesInChannel] Request URL:', url);

            logFetchingPage(offset);

            let attempts = 0;
            const maxAttempts = 3;
            let response;

            while (attempts < maxAttempts) {
                console.log('[deleteMessagesInChannel] Fetch attempt:', attempts + 1);
                response = await fetch(url, {
                    headers: { 
                        'Authorization': window.appState.userToken,
                        'Content-Type': 'application/json'
                    }
                });

                console.log('[deleteMessagesInChannel] Response status:', response.status);

                if (response.status === 429) {
                    const retryAfter = response.headers.get('Retry-After') || 5;
                    logRateLimit(retryAfter);
                    await sleep(retryAfter * 1000);
                    attempts++;
                    continue;
                } else if (response.status === 400) {
                    // 400エラーの詳細を取得
                    try {
                        const errorData = await response.json();
                        logHttp400Error(errorData.message || 'Bad Request');
                        logHttp400Details(JSON.stringify(errorData));
                    } catch (e) {
                        logHttp400Error('Bad Request (詳細取得失敗)');
                    }
                    throw new Error(`HTTP ${response.status}`);
                } else if (!response.ok) {
                    // その他のエラー
                    throw new Error(`HTTP ${response.status}`);
                }
                
                // 成功した場合はループを抜ける
                console.log('[deleteMessagesInChannel] Fetch successful');
                break;
            }

            const data = await response.json();
            console.log('[deleteMessagesInChannel] API Response:', data);
            console.log('[deleteMessagesInChannel] total_results:', data.total_results);
            console.log('[deleteMessagesInChannel] messages count:', data.messages?.length);

            if (totalResultsFromAPI === null && data.total_results !== undefined) {
                totalResultsFromAPI = data.total_results;
                const totalPages = Math.ceil(totalResultsFromAPI / limit);
                const maxPagesAPILimit = Math.floor(10000 / limit);
                
                if (totalPages > maxPagesAPILimit) {
                    logTotalPagesWarning(totalPages, maxPagesAPILimit);
                    logActualTotalMessages(totalResultsFromAPI);
                }
                
                totalMessages = Math.min(totalResultsFromAPI, maxPagesAPILimit * limit);
                document.getElementById('totalCount').textContent = totalMessages;
            } else if (data.total_results !== undefined) {
                // total_resultsを毎回更新（削除により減少するため）
                totalResultsFromAPI = data.total_results;
                console.log('[deleteMessagesInChannel] Updated total_results to:', totalResultsFromAPI);
            } else if (totalResultsFromAPI === null) {
                logSearchResult(data.messages?.length || 0);
                totalMessages = data.messages ? data.messages.length : 0;
                document.getElementById('totalCount').textContent = totalMessages;
            }
            
            if (!data.messages || data.messages.length === 0) {
                console.log('[deleteMessagesInChannel] No messages in response');
                logNoMoreMessages();
                hasMorePages = false;
                break;
            }

            console.log('[deleteMessagesInChannel] Messages before flatten:', data.messages.length);
            
            // メッセージをフラット化して取得
            const messages = data.messages.flat().filter(msg => msg && msg.id && msg.channel_id);
            
            console.log('[deleteMessagesInChannel] Messages after flatten/filter:', messages.length);
            
            if (messages.length === 0) {
                console.log('[deleteMessagesInChannel] No valid messages after filtering');
                logNoValidMessages();
                hasMorePages = false;
                break;
            }

            const foundInPage = messages.length;
            logFoundInPage(foundInPage);
            
            logStep2();
            
            console.log('[deleteMessagesInChannel] Starting deletion loop for', messages.length, 'messages');
            
            // 各メッセージIDから削除を実行
            for (let i = 0; i < messages.length; i++) {
                const msg = messages[i];
                console.log(`[deleteMessagesInChannel] Deleting message ${i + 1}/${messages.length}, ID: ${msg.id}, Channel: ${msg.channel_id}`);
                
                if (window.appState.shouldStop) {
                    console.log('[deleteMessagesInChannel] shouldStop flag is true, stopping...');
                    logStoppedByUser();
                    return { totalMessages, deletedCount, failedCount };
                }
                
                const success = await deleteMessage(msg.channel_id, msg.id);
                console.log(`[deleteMessagesInChannel] Delete result for ${msg.id}:`, success);
                
                if (success === 'permission_error') {
                    // 権限エラーが発生したら即座に停止
                    console.log('[deleteMessagesInChannel] Permission error, stopping...');
                    window.appState.shouldStop = true;
                    return { totalMessages, deletedCount, failedCount };
                } else if (success) {
                    deletedCount++;
                    document.getElementById('deletedCount').textContent = deletedCount;
                } else {
                    failedCount++;
                    document.getElementById('errorCount').textContent = failedCount;
                }

                // 進捗バーを更新
                const progress = totalMessages > 0 ? Math.round(((deletedCount + failedCount) / totalMessages) * 100) : 0;
                const fill = document.getElementById('progressFill');
                fill.style.width = progress + '%';
                document.getElementById('progressText').textContent = `${deletedCount + failedCount} / ${totalMessages} (${progress}%)`;

                // 削除速度設定から待機時間を取得
                const deleteSpeed = parseInt(document.getElementById('deleteSpeed').value);
                console.log('[deleteMessagesInChannel] Waiting', deleteSpeed, 'ms before next delete');
                await sleep(deleteSpeed);
            }
            
            console.log('[deleteMessagesInChannel] Deletion loop completed. Deleted:', deletedCount, 'Failed:', failedCount);

            logNextPagePreparation();
            
            // 古い順削除の場合はoffsetを0に戻す（削除したメッセージが消えるため）
            if (deleteOldFirst) {
                console.log('[deleteMessagesInChannel] Oldest-first mode: resetting offset to 0 (deleted messages removed from list)');
                offset = 0;
            } else {
                // 次のページへ（新しい順の場合は通常通りoffsetを増やす）
                offset += foundInPage;
                console.log('[deleteMessagesInChannel] Newest-first mode: incrementing offset to', offset);
            }
            
            // offset制限をチェック
            if (!deleteOldFirst && offset > 9975) {
                console.log('[deleteMessagesInChannel] Offset limit reached:', offset);
                logOffsetLimitReached();
                hasMorePages = false;
            }
            // ページ数が想定より少ない場合は終了（ただしtotal_resultsも考慮）
            else if (foundInPage < limit) {
                console.log('[deleteMessagesInChannel] Found fewer messages than limit. foundInPage:', foundInPage, 'limit:', limit);
                
                // total_resultsがある場合、まだメッセージが残っているかチェック
                if (totalResultsFromAPI !== null) {
                    const remainingMessages = totalResultsFromAPI - deletedCount - failedCount;
                    console.log('[deleteMessagesInChannel] Remaining messages based on total_results:', remainingMessages);
                    
                    if (remainingMessages > 0) {
                        // まだメッセージが残っている場合は続行
                        console.log('[deleteMessagesInChannel] Messages still remain, continuing...');
                        hasMorePages = true;
                    } else {
                        // 本当に終了
                        if (deleteOldFirst) {
                            logOldestFirstComplete();
                        } else {
                            logLastPageReached();
                        }
                        hasMorePages = false;
                    }
                } else {
                    // total_resultsがない場合は従来通り終了
                    if (deleteOldFirst) {
                        logOldestFirstComplete();
                    } else {
                        logLastPageReached();
                    }
                    hasMorePages = false;
                }
            }
            
            console.log('[deleteMessagesInChannel] Moving to next page, offset:', offset, 'hasMorePages:', hasMorePages);
            logMoveToNextPage(offset);
            await sleep(2000); // ページ間の待機
        } catch (error) {
            logError(error.message);
            hasMorePages = false;
        }
    }

    return { totalMessages, deletedCount, failedCount };
}

async function startDeletion() {
    console.log('[startDeletion] Called');
    const { isDeleting, userToken, selectedChannelId, selectedGuildId, guilds, channels, currentSortOrder } = window.appState;
    console.log('[startDeletion] State:', { isDeleting, hasToken: !!userToken, selectedGuildId, selectedChannelId });
    
    if (isDeleting) {
        console.log('[startDeletion] Already deleting, returning');
        return;
    }

    // 認証トークンのチェック
    if (!userToken) {
        console.log('[startDeletion] No user token');
        logAuthRequiredForDeletion();
        return;
    }

    const channelId = selectedChannelId;
    const guildId = selectedGuildId;
    
    console.log('[startDeletion] Channel ID:', channelId, 'Guild ID:', guildId);
    
    if (!guildId) {
        console.log('[startDeletion] No guild selected');
        logServerNotSelected();
        return;
    }

    if (!channelId) {
        console.log('[startDeletion] No channel selected');
        logChannelNotSelected();
        return;
    }

    const selectedGuild = guilds.find(g => g.id === guildId);
    console.log('[startDeletion] selectedGuild:', selectedGuild);
    
    let targetName = '';
    try {
        if (channelId === 'SERVER_WIDE') {
            const guildName = selectedGuild ? selectedGuild.name : 'Unknown Server';
            targetName = `${t('serverWideTarget')} (${guildName})`;
            console.log('[startDeletion] targetName (SERVER_WIDE):', targetName);
        } else if (guildId === 'DM') {
            const selectedChannel = channels.find(ch => ch.id === channelId);
            if (selectedChannel && selectedChannel.recipients) {
                const recipient = selectedChannel.recipients[0];
                const displayName = recipient ? (recipient.global_name || recipient.username) : 'Unknown User';
                targetName = `DM: ${displayName}`;
            } else {
                targetName = 'DM: Unknown User';
            }
            console.log('[startDeletion] targetName (DM):', targetName);
        } else {
            const selectedChannel = channels.find(ch => ch.id === channelId) || { name: 'Unknown' };
            targetName = `#${selectedChannel.name}`;
            console.log('[startDeletion] targetName (channel):', targetName);
        }
    } catch (nameError) {
        console.error('[startDeletion] Error getting targetName:', nameError);
        targetName = 'Unknown Target';
    }
    
    console.log('[startDeletion] Setting isDeleting to true...');
    window.appState.isDeleting = true;
    window.appState.shouldStop = false;
    
    console.log('[startDeletion] Resetting stats...');
    // 統計カウンターをリセット
    document.getElementById('totalCount').textContent = '0';
    document.getElementById('deletedCount').textContent = '0';
    document.getElementById('errorCount').textContent = '0';
    document.getElementById('progressFill').style.width = '0%';
    document.getElementById('progressText').textContent = '0 / 0 (0%)';
    
    console.log('[startDeletion] Updating button...');
    // ボタンを停止ボタンに変更
    const btn = document.getElementById('mainActionBtn');
    btn.textContent = t('stop');
    btn.className = 'secondary main-action-btn';
    
    document.getElementById('statsSection').classList.remove('hidden');

    const deleteSpeed = parseInt(document.getElementById('deleteSpeed').value);
    const deleteOldFirst = currentSortOrder === 'oldest';
    
    console.log('[startDeletion] Logging deletion start...');
    logDeletionStartHeader(targetName);
    logDeletionSettings(deleteSpeed, deleteOldFirst);
    logStartingDeletion();
    
    console.log('[startDeletion] About to call deleteMessagesInChannel...');

    const result = await deleteMessagesInChannel(guildId, channelId);
    
    console.log('[startDeletion] deleteMessagesInChannel completed, result:', result);
    
    logDeletionComplete();
    logStatistics(result.totalMessages, result.deletedCount, result.failedCount);

    // ボタンを削除開始ボタンに戻す
    window.appState.isDeleting = false;
    window.appState.shouldStop = false;
    btn.textContent = t('startDeletion');
    btn.className = 'danger';
    btn.disabled = false;
}

function toggleDeletion() {
    console.log('[toggleDeletion] Called');
    const { isDeleting, shouldStop } = window.appState;
    console.log('[toggleDeletion] isDeleting:', isDeleting, 'shouldStop:', shouldStop);
    
    if (isDeleting && !shouldStop) {
        // 削除処理を停止
        console.log('[toggleDeletion] Stopping deletion...');
        window.appState.shouldStop = true;
        logStoppingDeletion();
        const btn = document.getElementById('mainActionBtn');
        btn.disabled = true;
        btn.textContent = t('stopping');
    } else {
        // 削除開始
        console.log('[toggleDeletion] Starting deletion...');
        startDeletion();
    }
}

