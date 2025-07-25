// @description  Shibbolethログインページで自動的にログインします。
// @match        https://shib.chukyo-u.ac.jp/cloudlink/module.php/core/loginuserpass.php*

(function() {
    'use strict';
    
    /**
     * ログイン処理を実行します。
     */
    function autoLogin(username, password) {
        // エラーメッセージが表示されているか確認
        if (document.querySelector(".c-message") !== null) {
            console.log("ログインエラーメッセージが検出されたため、自動ログインを中断します。");
            return; // エラーがあれば処理を中断
        }

        // フォームの要素を取得
        const usernameInput = document.querySelector("#username");
        const passwordInput = document.querySelector("#password");
        const loginButton = document.querySelector("#login");

        // 必要な要素がすべて揃っているか確認
        if (usernameInput && passwordInput && loginButton) {
            // ユーザー名とパスワードを入力
            usernameInput.value = username;
            passwordInput.value = password;

            // ログインボタンをクリック
            loginButton.click();
        } else {
            console.log("ログインフォームが見つかりませんでした。");
        }
    }

    // 拡張機能のストレージからIDとパスワードを取得して実行
    chrome.storage.sync.get(['username', 'password'], (result) => {
        if (result.username && result.password) {
            // IDとパスワードが保存されている場合のみログイン処理を実行
            autoLogin(result.username, result.password);
        } else {
            console.log("IDまたはパスワードが設定されていません。拡張機能アイコンから設定してください。");
        }
    });

})();