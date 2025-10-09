// Utility Functions

const API_BASE = 'https://discord.com/api/v10';

// Discord snowflake ID とタイムスタンプの変換
function snowflakeToTimestamp(snowflake) {
    const DISCORD_EPOCH = 1420070400000;
    return Number(BigInt(snowflake) >> 22n) + DISCORD_EPOCH;
}

function timestampToSnowflake(timestamp) {
    const DISCORD_EPOCH = 1420070400000;
    return String((BigInt(timestamp - DISCORD_EPOCH) << 22n));
}

// 翻訳を取得するヘルパー関数
function t(key) {
    // 空文字列の場合は警告せずに空文字列を返す
    if (!key || key === '') {
        return '';
    }
    // translationsがまだ読み込まれていない場合
    if (typeof translations === 'undefined') {
        return key;
    }
    const lang = window.appState?.currentLanguage || 'en';
    return translations[key] && translations[key][lang] ? translations[key][lang] : key;
}

// スリープ関数
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// グローバル状態管理
window.appState = {
    userToken: '',
    currentUser: null,
    guilds: [],
    channels: [],
    isDeleting: false,
    shouldStop: false,
    currentSortOrder: 'oldest',
    currentLanguage: 'en', // 初期言語: 英語
    currentTheme: 'dark',   // 初期テーマ: ダーク
    selectedGuildId: null,
    selectedChannelId: null
};

