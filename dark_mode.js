(function() {
    'use strict';

    // このスクリプトが動作しているフレームの現在のテーマ状態を保持する変数
    let currentTheme = 'light';

    // テーマを適用するコア関数
    function applyThemeToBody() {
        if (!document.body) return; // bodyがなければ何もしない

        // 現在のbodyのクラス状態と、保持しているテーマ状態が違う場合のみクラスを操作
        const isBodyDark = document.body.classList.contains('dark-mode');
        if (currentTheme === 'dark' && !isBodyDark) {
            document.body.classList.add('dark-mode');
        } else if (currentTheme === 'light' && isBodyDark) {
            document.body.classList.remove('dark-mode');
        }
    }

    // --- メインロジック ---

    // 1. 起動時にストレージから一度だけテーマを取得し、変数に保存して適用する
    try {
        chrome.storage.local.get('theme', (data) => {
            // エラーチェック: chrome.runtime.lastErrorは、非同期APIのエラーを捕捉する
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError.message);
                return;
            }
            currentTheme = data.theme || 'light';
            applyThemeToBody();
        });
    } catch (e) {
        // コンテキストが無効になった後の同期エラーを捕捉
        console.warn('拡張機能のコンテキストが無効です。これは再読み込み時に発生することがあります。', e);
    }


    // 2. MutationObserverでDOMの動的な変更を監視
    //    API呼び出しをせず、保持しているテーマを再適用するだけなので軽量
    const observer = new MutationObserver(() => {
        applyThemeToBody();
    });
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
    });


    // 3. ポップアップや他のフレームからの変更を監視
    chrome.storage.onChanged.addListener((changes, namespace) => {
        if (namespace === 'local' && changes.theme) {
            // 新しいテーマを変数に保存し、適用する
            currentTheme = changes.theme.newValue || 'light';
            applyThemeToBody();
        }
    });

})();