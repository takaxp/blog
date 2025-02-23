+++
title = "orgバッファと専用編集バッファのコードの見た目を揃える"
author = ["Takaaki ISHIKAWA"]
date = 2025-02-22T15:38:00+09:00
tags = ["emacs", "orgmode"]
categories = ["emacs"]
draft = false
+++

2025年にもなってタブスペースで悩むという貴重な体験をしましたが、無事に好みの設定にできました。  

まず、普段編集する emacs-lisp-mode のファイルですが、他人様のファイルで特に指定のない状態ではインデントがタブ8で書かれていることも多いです。これは単純に `tab-width` のデフォルト値が `8` だけという理由だと思いますが、emacs-lisp-mode のファイルを編集するだけならなんら問題ないです。  

問題なのは、 org バッファ内の emacs lisp コードです。私は普段は、インデントはスペース2で統一しているので、org バッファ内の emacs lisp コードを `org-edit-special (C-c ')` を呼び、専用バッファを emacs-lisp-mode で編集してから org バッファに戻ってくると、レイアウトが壊れることになります。タブで表現された箇所が幅8から幅2に縮むためですね。  

解決策は、org バッファに戻る時に、タブ8をスペース2に変換してしまう、というシンプルなもので、次のようにしてみました。これで普段の見た目も維持され、さらにGitHubに配置するファイルの表示や、エクスポートしたHTMLファイルのレイアウトも崩れなくなりました。  

```emacs-lisp
(with-eval-after-load "org-src"
  ;; tab-width=8, indent-tabs-mode=t
  (advice-add 'org-edit-special :after #'my-format-emacs-lisp-buffer)
  ;; tab-width=2, indent-tabs-mode=nil
  (advice-add 'org-edit-src-abort :before #'my-format-emacs-lisp-for-org-buffer)
  (advice-add 'org-edit-src-exit :before #'my-format-emacs-lisp-for-org-buffer))
```

```emacs-lisp
;;;###autoload
(defun my-format-emacs-lisp-buffer ()
  (interactive)
  (when (eq major-mode 'emacs-lisp-mode)
    (my-emacs-lisp-mode-conf)
    (save-excursion
      (save-restriction
        (widen)
        (untabify (point-min) (point-max))
        (tabify (point-min) (point-max))
        (indent-region (point-min) (point-max))))))

;;;###autoload
(defun my-format-emacs-lisp-for-org-buffer ()
  (interactive)
  (when (eq major-mode 'emacs-lisp-mode)
    (setq-local indent-tabs-mode nil)
    (setq-local tab-width 2)
    (setq indent-line-function 'org-indent-line)
    (save-excursion
      (save-restriction
        (widen)
        (untabify (point-min) (point-max))
        (indent-region (point-min) (point-max))))))
```

```emacs-lisp
;;;###autoload
(defun my-emacs-lisp-mode-conf ()
  (setq-local indent-tabs-mode t)
  (setq-local tab-width 8)
  (setq indent-line-function 'lisp-indent-line))

(when (autoload-if-found '(emacs-lisp-mode)
                         "elisp-mode" nil t)
  (push '("\\.el\\'" . emacs-lisp-mode) auto-mode-alist)
  (add-hook 'emacs-lisp-mode-hook #'my-emacs-lisp-mode-conf))
```
