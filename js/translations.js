// Discord Message Cleaner - Translation Data

const translations = {
    title: { en: 'Discord Message Cleaner', ja: 'Discord Message Cleaner' },
    subtitle: { en: 'Tool to delete messages', ja: 'メッセージを削除するためのツール' },
    auth: { en: 'Authentication', ja: '認証' },
    authDescription: { en: 'A Discord user token is required to use this tool.', ja: 'このツールを使用するには、Discord ユーザートークンが必要です。' },
    tokenPlaceholder: { en: 'Enter user token', ja: 'ユーザートークンを入力' },
    login: { en: 'Login', ja: 'ログイン' },
    logout: { en: 'Logout', ja: 'ログアウト' },
    reset: { en: 'Reset', ja: 'リセットする' },
    tokenHelp: { en: 'How to Get Token', ja: 'トークンの取得方法' },
    about: { en: 'About', ja: 'このツールについて' },
    aboutDescription: { 
        en: 'This tool allows you to delete your Discord messages in bulk. Select a server and channel, configure your search options, and start the deletion process. All operations are performed directly from your browser using your Discord token.',
        ja: 'このツールを使用すると、Discordのメッセージを一括削除できます。サーバーとチャンネルを選択し、検索オプションを設定して、削除処理を開始してください。すべての操作は、あなたのDiscordトークンを使用してブラウザから直接実行されます。'
    },
    tokenHelpTitle: { en: 'How to Get Discord User Token', ja: 'Discord ユーザートークンの取得方法' },
    serverSelect: { en: 'Select Server', ja: 'サーバー選択' },
    selectServer: { en: 'Select a server...', ja: 'サーバーを選択...' },
    channelSelect: { en: 'Select Channel', ja: 'チャンネル選択' },
    selectChannel: { en: 'Select a channel...', ja: 'チャンネルを選択...' },
    serverWide: { en: 'Server Wide', ja: 'サーバー全体' },
    allChannels: { en: 'All channels', ja: '全チャンネル対象' },
    searchTarget: { en: 'Search Target', ja: '検索対象' },
    myMessages: { en: 'My Messages', ja: '自分のメッセージ' },
    otherUser: { en: 'Other User', ja: '他のユーザー' },
    allMessages: { en: 'All Messages', ja: '全員のメッセージ' },
    userIdPlaceholder: { en: 'Enter user ID', ja: 'ユーザーIDを入力' },
    verify: { en: 'Verify', ja: '確認' },
    verifying: { en: 'Verifying...', ja: '確認中...' },
    dateRange: { en: 'Date Range (Optional)', ja: '日時範囲 (オプション)' },
    startDate: { en: 'Start Date', ja: '開始日' },
    endDate: { en: 'End Date', ja: '終了日' },
    deleteOptions: { en: 'Delete Options', ja: '削除オプション' },
    deleteSpeed: { en: 'Delete Speed', ja: '削除速度' },
    deleteSpeedUnit: { en: 'ms', ja: 'ms' },
    fast: { en: 'Fast', ja: '高速' },
    slow: { en: 'Slow', ja: '低速' },
    deleteOldFirst: { en: 'Delete oldest first', ja: '古い順に削除する' },
    generatedUrl: { en: 'Generated URL', ja: '生成されたURL' },
    generatingUrl: { en: 'Generating URL...', ja: 'URLを生成中...' },
    urlInfo: { en: 'Messages obtained from the URL above will be deleted. The URL updates in real-time as selections change.', ja: '上記のURLで得たメッセージを削除します。選択内容を変更すると、URLがリアルタイムで更新されます。' },
    startDeletion: { en: 'Start Deletion', ja: '削除開始' },
    stop: { en: 'Stop', ja: '停止' },
    stopping: { en: 'Stopping...', ja: '停止中...' },
    statistics: { en: 'Statistics', ja: '統計情報' },
    totalMessages: { en: 'Total Messages', ja: '総メッセージ数' },
    deleted: { en: 'Deleted', ja: '削除成功' },
    failed: { en: 'Failed', ja: '削除失敗' },
    progress: { en: 'Progress', ja: '進捗' },
    console: { en: 'Console', ja: 'コンソール' },
    clearConsole: { en: 'Clear', ja: 'クリア' },
    systemInit: { en: '[System] Discord Message Cleaner initialized', ja: '[システム] Discord Message Cleaner 初期化完了' },
    waitingAuth: { en: 'Waiting for authentication...', ja: '認証を待っています...' },
    authenticating: { en: 'Authenticating...', ja: '認証中...' },
    authSuccess: { en: 'Authentication successful', ja: '認証成功' },
    authFailed: { en: 'Authentication failed', ja: '認証失敗' },
    userId: { en: 'User ID', ja: 'ユーザーID' },
    errorToken: { en: 'Error: Please enter token', ja: 'エラー: トークンを入力してください' },
    fetchingServers: { en: 'Fetching server list...', ja: 'サーバー一覧を取得中...' },
    fetchedServers: { en: 'servers fetched', ja: '個のサーバーを取得しました' },
    serverFetchFailed: { en: 'Server fetch failed', ja: 'サーバー取得失敗' },
    fetchingChannels: { en: 'Fetching channels', ja: 'チャンネル取得中' },
    channelFetchFailed: { en: 'Channel fetch failed', ja: 'チャンネル取得失敗' },
    fetchedChannels: { en: 'text channels,', ja: '個のテキストチャンネル、' },
    voiceChannels: { en: 'voice channels fetched', ja: '個のボイスチャンネルを取得しました' },
    errorMessage: { en: 'Error', ja: 'エラー' },
    channelSelected: { en: 'Channel selected', ja: 'チャンネルを選択' },
    selected: { en: 'Selected', ja: '選択' },
    userIdRequired: { en: 'Please enter user ID', ja: 'ユーザーIDを入力してください' },
    authRequired: { en: 'Authentication required', ja: '認証が必要です' },
    userVerified: { en: 'User verified', ja: 'ユーザーを確認' },
    userVerifyFailed: { en: 'User verification failed', ja: 'ユーザー確認失敗' },
    userNotFound: { en: 'User not found', ja: 'ユーザーが見つかりません' },
    languageChanged: { en: '言語を変更しました:', ja: 'Language changed to' },
    themeChanged: { en: 'Theme changed:', ja: 'テーマを変更しました:' },
    consoleCleared: { en: 'Console cleared', ja: 'コンソールをクリアしました' },
    serverNotSelected: { en: 'Server not selected', ja: 'サーバーが選択されていません' },
    channelNotSelected: { en: 'Channel not selected', ja: 'チャンネルが選択されていません' },
    deletionStarting: { en: 'Starting deletion', ja: '削除を開始します' },
    cannotUndo: { en: 'This action cannot be undone', ja: 'この操作は取り消せません' },
    deleteOrder: { en: 'Delete order', ja: '削除順' },
    oldestFirst: { en: 'Oldest first', ja: '古い順' },
    newestFirst: { en: 'Newest first', ja: '新しい順' },
    startingDeletion: { en: 'Starting deletion process...', ja: '削除処理を開始します...' },
    deletionComplete: { en: 'Deletion complete', ja: '削除処理完了' },
    successRate: { en: 'Success rate', ja: '成功率' },
    stoppingDeletion: { en: 'Stopping deletion...', ja: '削除処理を停止中...' },
    otherUserMessages: { en: 'Other user', ja: '他のユーザー' },
    allUserMessages: { en: 'All messages', ja: '全員のメッセージ' },
    filterFrom: { en: 'Filter:', ja: 'フィルター:' },
    filterAfter: { en: 'After', ja: '以降' },
    filterBefore: { en: 'Before', ja: '以前' },
    step1: { en: 'Step 1: Search and retrieve messages', ja: 'ステップ1: メッセージを検索・取得' },
    fetchingPage: { en: 'Fetching page', ja: 'ページ取得中' },
    searchResult: { en: 'Search result: Total', ja: '検索結果: 合計' },
    messagesFound: { en: 'messages found', ja: '件のメッセージが見つかりました' },
    noMoreMessages: { en: 'No more messages found', ja: 'これ以上メッセージが見つかりませんでした' },
    noValidMessages: { en: 'No valid messages', ja: '有効なメッセージがありません' },
    foundInPage: { en: 'Found', ja: 'このページで' },
    messagesRetrieved: { en: 'messages in this page', ja: '件のメッセージを取得' },
    step2: { en: 'Step 2: Execute deletion from message IDs', ja: 'ステップ2: メッセージIDから削除実行' },
    stoppedByUser: { en: 'Stopped by user', ja: 'ユーザーによって停止されました' },
    deleteSuccess: { en: 'Delete success', ja: '削除成功' },
    deleteFailed: { en: 'Delete failed', ja: '削除失敗' },
    rateLimit: { en: 'Rate limit', ja: 'レート制限' },
    waitingSeconds: { en: 'seconds wait...', ja: '秒待機...' },
    step3: { en: 'Step 3: Move to next page', ja: 'ステップ3: 次のページに進む' },
    loggedOut: { en: 'Logged out', ja: 'ログアウトしました' },
    serverSelected: { en: 'Server selected', ja: 'サーバーを選択' },
    channelFetching: { en: 'Fetching channels', ja: 'チャンネル取得中' },
    serverWideTarget: { en: 'Server Wide', ja: 'サーバー全体' },
    directMessages: { en: 'Direct Messages', ja: 'ダイレクトメッセージ' },
    selectDM: { en: 'Select DM...', ja: 'DMを選択...' },
    dmChannelsFetched: { en: 'DM channels fetched', ja: '個のDMチャンネルを取得しました' },
    textVoiceChannelsFetched: { en: 'text channels,', ja: '個のテキストチャンネル、' },
    voiceChannelsFetched: { en: 'voice channels fetched', ja: '個のボイスチャンネルを取得しました' },
    moveToNextPage: { en: 'Move to next page', ja: '次のページへ移動' },
    dark: { en: 'Dark', ja: 'ダーク' },
    light: { en: 'Light', ja: 'ライト' },
    customChannel: { en: 'Custom Channel', ja: 'カスタムチャンネル' },
    customChannelDesc: { en: 'ID input support (threads, etc.)', ja: 'ID入力対応（threadなど）' },
    enterChannelId: { en: 'Enter Channel ID', ja: 'チャンネルIDを入力' },
    channelIdPlaceholder: { en: 'e.g.: 123456789012345678', ja: '例: 123456789012345678' },
    validateChannel: { en: 'Validate Channel', ja: 'チャンネル確認' },
    channelExists: { en: 'Channel exists', ja: 'チャンネルが存在します' },
    channelNotFound: { en: 'Channel not found', ja: 'チャンネルが見つかりません' },
    invalidChannelId: { en: 'Invalid channel ID', ja: '無効なチャンネルID' },
    deleteOldestFirst: { en: 'Delete oldest first', ja: '古い順に削除' },
    sortOrder: { en: 'Sort Order', ja: 'ソート順序' },
    newestFirstDesc: { en: 'Delete from newest messages', ja: '最新のメッセージから削除' },
    oldestFirstDesc: { en: 'Delete from oldest messages', ja: '古いメッセージから削除' },
    totalPagesLimitWarning: { en: 'Warning: Total pages is {totalPages}, but API limit allows only {maxPages} pages to be processed', ja: '注意: 総ページ数が{totalPages}ですが、API制限により最大{maxPages}ページまでしか処理できません' },
    actualTotalMessages: { en: 'Actual total messages', ja: '実際の総メッセージ数' },
    searchingMessages: { en: 'Searching and retrieving messages...', ja: 'メッセージを検索・取得中...' },
    executingDeletionFromIds: { en: 'Executing deletion from message IDs...', ja: 'メッセージIDから削除実行中...' },
    
    // Additional messages for log-messages.js
    enterUserId: { en: 'Please enter user ID', ja: 'ユーザーIDを入力してください' },
    authenticationRequired: { en: 'Authentication required', ja: '認証が必要です' },
    nextPagePreparation: { en: 'Preparing for next page...', ja: '次のページに進む準備中...' },
    offsetLimitReached: { en: 'API limit: Cannot exceed offset 9975, stopping process', ja: 'API制限により、offset 9975を超えるため処理を終了します' },
    oldestFirstComplete: { en: 'Oldest first deletion complete: Reached last page', ja: '古い順削除完了：最後のページに到達' },
    lastPageReached: { en: 'Reached last page', ja: '最後のページに到達しました' },
    http400Error: { en: 'HTTP 400 Error', ja: 'HTTP 400 エラー' },
    details: { en: 'Details', ja: '詳細' },
    authTokenNotSet: { en: 'Authentication token is not set', ja: '認証トークンが設定されていません' },
    error: { en: 'Error', ja: 'エラー' },
    userIdNotAvailable: { en: 'Error: User ID is not available', ja: 'エラー: ユーザーIDが利用できません' },
    serverListError: { en: 'Server list fetch error', ja: 'サーバーリスト取得エラー' },
    permissionError: { en: 'Permission Error: You do not have permission to delete this message. Stopping process.', ja: '権限エラー: このメッセージを削除する権限がありません。処理を停止します' }
};

// 古い形式(translations[language][key])をサポートするための互換性レイヤー
// 新しい形式: translations[key][language]
// 古い形式もサポート: translations[language][key]
const translationsProxy = new Proxy(translations, {
    get(target, prop) {
        // 言語コード('en' または 'ja')の場合、古い形式をサポート
        if (prop === 'en' || prop === 'ja') {
            return new Proxy({}, {
                get(_, key) {
                    return target[key] && target[key][prop] ? target[key][prop] : key;
                }
            });
        }
        // それ以外は新しい形式でアクセス
        return target[prop];
    }
});

// 元のtranslationsオブジェクトを上書き
if (typeof window !== 'undefined') {
    window.translations = translationsProxy;
} else if (typeof global !== 'undefined') {
    global.translations = translationsProxy;
}

