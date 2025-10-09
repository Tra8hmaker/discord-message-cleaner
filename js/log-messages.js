// Log Messages - ログメッセージの一元管理

// ============================================
// 区切り線
// ============================================

const DIVIDER = '━━━━━━━━━━━━━━━━━━━━━━━━━━━';

function logDivider(type = 'info') {
    log(DIVIDER, type);
}

// ============================================
// 認証関連
// ============================================

function logAuthenticating() {
    log(t('authenticating'), 'info');
}

function logAuthSuccess(username) {
    log(`${t('authSuccess')}: ${username}`, 'success');
}

function logUserId(userId) {
    log(`${t('userId')}: ${userId}`, 'debug');
}

function logAuthFailed(errorMessage) {
    log(`${t('authFailed')}: ${errorMessage}`, 'error');
}

function logLoggedOut() {
    log(t('loggedOut'), 'info');
}

function logErrorToken() {
    log(t('errorToken'), 'error');
}

// ============================================
// サーバー/チャンネル関連
// ============================================

function logFetchingServers() {
    log(t('fetchingServers'), 'info');
}

function logServersFetched(count) {
    log(`${count} ${t('fetchedServers')}`, 'success');
}

function logServerSelected(serverName) {
    log(`${t('serverSelected')}: ${serverName}`, 'info');
}

function logChannelFetching(targetName) {
    log(`${t('channelFetching')}: ${targetName}`, 'info');
}

function logDMChannelsFetched(count) {
    log(`${count} ${t('dmChannelsFetched')}`, 'success');
}

function logTextVoiceChannelsFetched(textCount, voiceCount) {
    log(`${textCount}${t('textVoiceChannelsFetched')}${voiceCount}${t('voiceChannelsFetched')}`, 'success');
}

function logChannelSelected(channelName) {
    log(`${t('channelSelected')}: ${channelName}`, 'info');
}

function logSelectedItem(itemName) {
    log(`${t('selected')}: ${itemName}`, 'info');
}

function logSelectedItemWithId(itemName, itemId) {
    log(`${t('selected')}: ${itemName} (ID: ${itemId})`, 'success');
}

// ============================================
// ユーザー検証関連
// ============================================

function logUserIdRequired() {
    log(t('enterUserId'), 'error');
}

function logAuthRequired() {
    log(t('authenticationRequired'), 'error');
}

function logUserVerified(username) {
    log(`${t('userVerified')}: ${username}`, 'success');
}

function logUserVerifyFailed(errorMessage) {
    log(`${t('userVerifyFailed')}: ${errorMessage}`, 'error');
}

// ============================================
// メッセージ削除関連
// ============================================

function logDeleteSuccess(messageId) {
    log(`${t('deleteSuccess')}: ${messageId}`, 'success');
}

function logDeleteFailed(messageId, status = '') {
    const statusText = status ? ` (${status})` : '';
    log(`${t('deleteFailed')}: ${messageId}${statusText}`, 'error');
}

function logDeleteFailedWithError(messageId, errorMessage) {
    log(`${t('deleteFailed')}: ${messageId} - ${errorMessage}`, 'error');
}

function logRateLimit(retryAfter) {
    log(`${t('rateLimit')}: ${retryAfter} ${t('waitingSeconds')}`, 'warning');
}

function logPermissionError() {
    log(t('permissionError'), 'error');
}

// ============================================
// 削除プロセス関連
// ============================================

function logSearchTarget(target, userId = '') {
    const userIdText = userId ? ` (${userId})` : '';
    log(`${t('searchTarget')}: ${target}${userIdText}`, 'info');
}

function logErrorMessage(key) {
    log(`${t('errorMessage')}: ${t(key)}`, 'error');
}

function logDateFilter(date, type) {
    const filterType = type === 'after' ? t('filterAfter') : t('filterBefore');
    log(`${t('filterFrom')} ${date} ${filterType}`, 'info');
}

function logStep1() {
    logDivider('info');
    log(t('step1'), 'info');
    logDivider('info');
}

function logStep2() {
    logDivider('info');
    log(t('step2'), 'info');
    logDivider('info');
}

function logFetchingPage(offset) {
    log(`${t('fetchingPage')} (offset: ${offset})...`, 'info');
}

function logSearchResult(count) {
    log(`${t('searchResult')} ${count} ${t('messagesFound')}`, 'success');
}

function logNoMoreMessages() {
    log(t('noMoreMessages'), 'info');
}

function logNoValidMessages() {
    log(t('noValidMessages'), 'info');
}

function logFoundInPage(count) {
    log(`${t('foundInPage')} ${count} ${t('messagesRetrieved')}`, 'success');
}

function logStoppedByUser() {
    log(t('stoppedByUser'), 'warning');
}

function logNextPagePreparation() {
    logDivider('info');
    log(t('nextPagePreparation'), 'info');
    logDivider('info');
}

function logOffsetLimitReached() {
    log(t('offsetLimitReached'), 'warning');
}

function logOldestFirstComplete() {
    log(t('oldestFirstComplete'), 'info');
}

function logLastPageReached() {
    log(t('lastPageReached'), 'info');
}

function logMoveToNextPage(offset) {
    log(`${t('moveToNextPage')} (offset: ${offset})`, 'info');
}

function logHttp400Error(errorMessage = 'Bad Request') {
    log(`${t('http400Error')}: ${errorMessage}`, 'error');
}

function logHttp400Details(details) {
    log(`${t('details')}: ${details}`, 'error');
}

function logTotalPagesWarning(totalPages, maxPages) {
    const warningMsg = t('totalPagesLimitWarning')
        .replace('{totalPages}', totalPages)
        .replace('{maxPages}', maxPages);
    log(warningMsg, 'warning');
}

function logActualTotalMessages(count) {
    log(`${t('actualTotalMessages')}: ${count}`, 'warning');
}

// ============================================
// 削除開始/完了関連
// ============================================

function logServerNotSelected() {
    log(t('serverNotSelected'), 'error');
}

function logChannelNotSelected() {
    log(t('channelNotSelected'), 'error');
}

function logAuthRequiredForDeletion() {
    log(t('authRequired'), 'error');
}

function logDeletionStartHeader(targetName) {
    logDivider('warning');
    log(`${t('deletionStarting')}: ${targetName}`, 'warning');
    log(t('cannotUndo'), 'warning');
}

function logDeletionSettings(deleteSpeed, isOldestFirst) {
    const orderText = isOldestFirst ? t('oldestFirst') : t('newestFirst');
    log(`${t('deleteSpeed')}: ${deleteSpeed}ms | ${t('deleteOrder')}: ${orderText}`, 'info');
}

function logStartingDeletion() {
    logDivider('warning');
    log(t('startingDeletion'), 'info');
}

function logDeletionComplete() {
    logDivider('success');
    log(t('deletionComplete'), 'success');
    logDivider('success');
}

function logStatistics(totalMessages, deletedCount, failedCount) {
    log(`${t('statistics')}:`, 'info');
    log(`  ${t('totalMessages')}: ${totalMessages}`, 'info');
    log(`  ${t('deleted')}: ${deletedCount}`, 'success');
    log(`  ${t('failed')}: ${failedCount}`, failedCount > 0 ? 'error' : 'info');
    
    const successRate = totalMessages > 0 
        ? Math.round((deletedCount / totalMessages) * 100) 
        : 0;
    log(`  ${t('successRate')}: ${successRate}%`, 'info');
    logDivider('success');
}

function logStoppingDeletion() {
    log(t('stoppingDeletion'), 'warning');
}

// ============================================
// エラー関連
// ============================================

function logError(errorMessage) {
    log(`${t('error')}: ${errorMessage}`, 'error');
}

function logUserIdNotAvailable() {
    log(t('userIdNotAvailable'), 'error');
}

// ============================================
// デバッグ用（開発時のみ使用）
// ============================================

function logDebug(message) {
    if (window.DEBUG_MODE) {
        console.log(`[DEBUG] ${message}`);
    }
}

