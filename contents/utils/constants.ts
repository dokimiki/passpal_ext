// Domain constants
export const DOMAINS = {
    MANABO: "manabo.cnc.chukyo-u.ac.jp",
    SHIBBOLETH: "shib.chukyo-u.ac.jp",
    ALBO: "cubics-pt-out.mng.chukyo-u.ac.jp",
    CUBICS: "cubics-as-out.mng.chukyo-u.ac.jp",
} as const;

// URL constants
export const URLS = {
    MANABO_AUTH: `https://${DOMAINS.MANABO}/auth/shibboleth/`,
    MANABO_LOGOUTED: `https://${DOMAINS.MANABO}/close`,
    ALBO_LOGIN: `https://${DOMAINS.ALBO}/uniprove_pt/UnLoginControl`,
} as const;

// Common selectors
export const SELECTORS = {
    // Shibboleth login
    SHIBBOLETH: {
        USERNAME: "input#username",
        PASSWORD: "input#password",
        LOGIN_BUTTON: "button#login",
        ERROR_MESSAGE: ".c-message",
    },

    // Manabo selectors
    MANABO: {
        PASSWORD_INPUT: "#input-password",
        BLAND_ICON: "header .navbar-brand",
    },

    // Albo selectors
    ALBO: {
        ERROR_TITLE: "h1",
        LOGOUT_MESSAGE: "#contents_main .message.information .message_bg p",
    },

    // Video controller
    VIDEO: {
        FOCUSED_CONTROLS: ".v-ctrl-wrap.v-ctrl-focused",
        FEEDBACK_DISPLAY: ".v-ctrl-feedback",
        INITIALIZED_ATTR: "data-video-controller-initialized",
    },

    // Common
    BODY: "body",
} as const;

// Messages
export const MESSAGES = {
    ALBO: {
        LOGOUT_TEXT: "ログアウト",
        INTERNAL_ERROR_TEXT: "Internal Server Error",
        HELLO_PAGE_TEXT: "It works!",
    },
} as const;

// Storage keys
export const STORAGE_KEYS = {
    THEME: "theme",
} as const;

// UI constants
export const UI = {
    DARK_MODE_TOGGLE_ID: "dark-mode-toggle",
    DARK_MODE_TEXT_ID: "dark-mode-toggle-text",
} as const;

export const VIDEO_CONFIG = {
    // 再生速度設定
    MIN_RATE: 0.25,
    MAX_RATE: 16.0,
    RATE_STEP: 0.25,

    // 音量設定
    VOLUME_STEP: 0.1,

    // シーク設定
    SEEK_SMALL: 5, // 矢印キー
    SEEK_LARGE: 10, // j/lキー

    // UI設定
    FEEDBACK_DISPLAY_DURATION: 250,
    BUTTON_HIGHLIGHT_DURATION: 200,

    // DOM属性
    INITIALIZED_ATTR: "data-v-ctrl-init",

    // CSS クラス
    CLASSES: {
        WRAP: "v-ctrl-wrap",
        FOCUSED: "v-ctrl-focused",
        HIGHLIGHT: "v-ctrl-highlight",
        FEEDBACK_CONTAINER: "v-ctrl-feedback-container",
        SPEED_CONTAINER: "v-ctrl-speed-container",
        PIP_CONTAINER: "v-ctrl-pip-container",
    },
} as const;
