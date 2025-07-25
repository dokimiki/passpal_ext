document.addEventListener('DOMContentLoaded', () => {
  // --- 1. 要素の取得とSVGアイコンの定義 ---
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const togglePasswordBtn = document.getElementById('toggle-password');
  const darkModeToggle = document.getElementById('dark-mode-toggle');

  const EYE_SLASH_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z"/></svg>`;
  const EYE_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z"/></svg>`;

  let actualPassword = '';
  let isPasswordVisible = false;
  let maskTimeout = null;
  let saveTimeout = null;

  const saveData = () => {
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(() => {
          chrome.storage.sync.set({
              username: usernameInput.value.trim(),
              password: actualPassword
          });
      }, 500);
  };

  const initialize = () => {
    chrome.storage.sync.get(['username', 'password'], (data) => {
      if (data.username) usernameInput.value = data.username;
      if (data.password) {
        actualPassword = data.password;
        updateInputView({ cursorPos: actualPassword.length });
      }
    });

    chrome.storage.local.get('theme', (data) => {
        const currentTheme = data.theme || 'light';
        updateThemeUI(currentTheme);
    });

    usernameInput.addEventListener('input', saveData);
  };

  const updateThemeUI = (theme) => {
    document.body.classList.toggle('dark-mode', theme === 'dark');
  };

  const updateInputView = (options = {}) => {
    const { isPeeking = false, cursorPos = passwordInput.selectionStart } = options;
    clearTimeout(maskTimeout);
    togglePasswordBtn.innerHTML = isPasswordVisible ? EYE_SLASH_ICON_SVG : EYE_ICON_SVG;

    if (isPasswordVisible) {
      passwordInput.type = 'text';
      passwordInput.value = actualPassword;
    } else {
      if (isPeeking && actualPassword.length > 0) {
        passwordInput.type = 'text';
        passwordInput.value = '●'.repeat(actualPassword.length - 1) + actualPassword.slice(-1);
        maskTimeout = setTimeout(() => {
          updateInputView({ cursorPos: passwordInput.selectionStart });
        }, 1000);
      } else {
        passwordInput.type = 'password';
        passwordInput.value = actualPassword;
      }
    }
    passwordInput.setSelectionRange(cursorPos, cursorPos);
  };

  // --- イベントリスナー ---
  // ... (パスワード関連のイベントリスナーは変更なし) ...
  usernameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey) {
      e.preventDefault();
      passwordInput.focus();
    }
  });

  togglePasswordBtn.addEventListener('click', (e) => {
    e.preventDefault();
    isPasswordVisible = !isPasswordVisible;
    updateInputView({ cursorPos: passwordInput.selectionStart });
    passwordInput.focus();
  });

  passwordInput.addEventListener('input', () => {
    if (isPasswordVisible) {
      actualPassword = passwordInput.value;
      saveData();
    }
  });

  const handleMaskedInput = (newPassword, newCursorPosOptions) => {
    actualPassword = newPassword;
    updateInputView(newCursorPosOptions);
    saveData();
  };
  passwordInput.addEventListener('beforeinput', e => {
    if (isPasswordVisible) return;
    const { inputType, data } = e;
    if (!['insertText', 'deleteContentBackward', 'deleteContentForward'].includes(inputType)) return;
    e.preventDefault();
    let { selectionStart, selectionEnd } = passwordInput;
    let newPassword = actualPassword;
    let newCursorPos = selectionStart;
    if (inputType === 'insertText') {
      newPassword = actualPassword.slice(0, selectionStart) + data + actualPassword.slice(selectionEnd);
      newCursorPos = selectionStart + data.length;
    } else if (inputType === 'deleteContentBackward') {
      if (selectionStart === 0 && selectionEnd === 0) return;
      const delStart = (selectionStart === selectionEnd) ? selectionStart - 1 : selectionStart;
      newPassword = actualPassword.slice(0, delStart) + actualPassword.slice(selectionEnd);
      newCursorPos = delStart;
    } else if (inputType === 'deleteContentForward') {
      if (selectionStart === actualPassword.length) return;
      const delEnd = (selectionStart === selectionEnd) ? selectionEnd + 1 : selectionEnd;
      newPassword = actualPassword.slice(0, selectionStart) + actualPassword.slice(delEnd);
      newCursorPos = selectionStart;
    }
    handleMaskedInput(newPassword, { isPeeking: true, cursorPos: newCursorPos });
  });
  passwordInput.addEventListener('cut', e => {
    if (isPasswordVisible) return;
    e.preventDefault();
    const { selectionStart, selectionEnd } = passwordInput;
    if (selectionStart === selectionEnd) return;
    const cutText = actualPassword.substring(selectionStart, selectionEnd);
    navigator.clipboard.writeText(cutText);
    const newPassword = actualPassword.slice(0, selectionStart) + actualPassword.slice(selectionEnd);
    handleMaskedInput(newPassword, { cursorPos: selectionStart });
  });
  passwordInput.addEventListener('copy', e => {
    if (isPasswordVisible) return;
    e.preventDefault();
    const { selectionStart, selectionEnd } = passwordInput;
    const selectedText = actualPassword.substring(selectionStart, selectionEnd);
    if (selectedText) navigator.clipboard.writeText(selectedText);
  });
  passwordInput.addEventListener('paste', e => {
    if (isPasswordVisible) return;
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData('text');
    if (text.includes('●')) return;
    const { selectionStart, selectionEnd } = passwordInput;
    const newPassword = actualPassword.slice(0, selectionStart) + text + actualPassword.slice(selectionEnd);
    const newCursorPos = selectionStart + text.length;
    handleMaskedInput(newPassword, { isPeeking: true, cursorPos: newCursorPos });
  });


  // ★★★ ここからが修正箇所 ★★★
  darkModeToggle.addEventListener('click', () => {
    const isDark = document.body.classList.contains('dark-mode');
    const newTheme = isDark ? 'light' : 'dark';
    
    // 1. 拡張機能のストレージに新しいテーマを保存
    chrome.storage.local.set({ theme: newTheme });
    
    // 2. ポップアップ自身の見た目を更新
    updateThemeUI(newTheme);

    // 3. 現在アクティブなタブに、テーマが変更されたことを通知する
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0] && tabs[0].id) {
            // content_script (dark_mode.js) にメッセージを送信
            chrome.tabs.sendMessage(tabs[0].id, {
                action: "updateTheme",
                theme: newTheme
            });
        }
    });
  });
  // ★★★ ここまでが修正箇所 ★★★

  initialize();
});