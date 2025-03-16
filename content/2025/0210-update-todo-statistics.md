+++
title = "ツリーのカットペースト時に統計情報を更新する"
author = ["Takaaki ISHIKAWA"]
date = 2025-02-10T16:23:00+09:00
lastmod = 2025-03-01T14:30:00+09:00
tags = ["emacs", "orgmode"]
categories = ["emacs"]
draft = false
+++

org-refile を使ってサブツリーを移動するのもいいですが、シンプルにサブツリーをカット＆ペーストするのも直感的で良いですよね。  

[スピードコマンド](https://qiita.com/takaxp/items/a5a3383d7358c58240d0)を有効にしていれば、カット＆ペーストは、ツリー（見出し）の行頭で `k` と `y` で簡単できます（ `y` で `org-yank` を呼ぶ設定は自分で追加が必要です）。  

{{< x user="takaxp" id="1888932890878333092" >}}  

今回は、下記ように `kill-region` と `org-yank` に advice する設定を加えることで、カットまたはペースト時に、親ツリーの見出しに表示している統計情報を更新するようにしました。  

Note(2025-02-22):  orgバッファでの通常のコピペ(`C-k`, `C-y`)時に、コピー対象がツリーを含む場合にも対応して、処理を簡略化しました。  

```emacs-lisp
(with-eval-after-load "org"

  ;; ツリーをカットする時に、カレントサブツリーと親の統計情報を更新する
  (defun my--kill-update-todo-statistics (_b _d &optional _arg)
    (when (and (derived-mode-p 'org-mode) ;; org 以外での発動を抑制
               (org-kill-is-subtree-p))
      (save-excursion
        (save-restriction
          (unless (eq 1 (point))
            (backward-char 1))
          (ignore-errors (outline-up-heading 1))
          (org-update-statistics-cookies nil)
          (org-update-parent-todo-statistics)))))
  (advice-add 'kill-region :after #'my--kill-update-todo-statistics)

  ;; ツリーをペーストする時に、カレントサブツリーと親の統計情報を更新する
  (defun my--yank-update-todo-statistics (&optional _arg)
    (when (and (derived-mode-p 'org-mode)
               (org-kill-is-subtree-p))
      (save-excursion
        (save-restriction
          (unless (eq 1 (point))
            (backward-char 1))
          (org-update-statistics-cookies nil)
          (org-update-parent-todo-statistics)))))
  (advice-add 'org-yank :after #'my--yank-update-todo-statistics))
```

次のコマンドを使えば、バッファ全体で統計情報を更新できますが、数万行のファイルの場合は重くて頻繁に使えません。今回加えた設定のように、細かい単位で変化のあったツリーの統計情報を適宜更新するのが良さそうです。  

```emacs-lisp
(org-update-statistics-cookies 'all)
```


## volatile-highlights.el {#volatile-highlights-dot-el}

kill時に<code>[0/0]</code>の色が変わるのが気になる場合は、volatile-highlights ロード後に `kill-region` から `vhl/.advice-callback-fn/.make-vhl-on-kill-region` を advice-remove します。  

```emacs-lisp
(with-eval-after-load "volatile-highlights"
  (advice-remove 'kill-region
                 #'vhl/.advice-callback-fn/.make-vhl-on-kill-region))
```


## previous code {#previous-code}

```emacs-lisp
(with-eval-after-load "org"

  ;; "k" でツリーをカットする時に、カレントサブツリーと親の統計情報を更新する
  (defun my--k-update-todo-statistics (f &rest args)
    (org-update-statistics-cookies nil)
    (let ((p (point))
          (not-last-subtree-p (funcall 'org-get-next-sibling)))
      (goto-char p)
      (apply f args)
      (if not-last-subtree-p
          (org-update-parent-todo-statistics)
        (org-previous-visible-heading 1)
        (org-update-parent-todo-statistics)
        (org-next-visible-heading 1))))
  (advice-add 'org-cut-subtree :around #'my--k-update-todo-statistics)

  ;; "y" でツリーをペーストする時に、カレントサブツリーと親の統計情報を更新する
  (defun my--y-update-todo-statistics (&optional _arg)
    (when (and (org-kill-is-subtree-p)
               (or (bolp)
                   (and (looking-at "[ \t]*$")
                        (string-match
                         "\\`\\*+\\'"
                         (buffer-substring (point-at-bol) (point))))))
      (org-previous-visible-heading 1)
      (org-update-statistics-cookies nil)
      (org-update-parent-todo-statistics)
      (org-next-visible-heading 1)))
  (advice-add 'org-yank :after #'my--y-update-todo-statistics))
```
