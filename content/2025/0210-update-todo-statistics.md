+++
title = "ツリーのカットペースト時に統計情報を更新する"
author = ["Takaaki ISHIKAWA"]
date = 2025-02-10T16:23:00+09:00
tags = ["emacs", "orgmode"]
categories = ["emacs"]
draft = false
+++

org-refile を使ってサブツリーを移動するのもいいですが、シンプルにサブツリーをカット＆ペーストするのもよいです。  

スピードコマンドを有効にしていれば、カット＆ペーストは、ツリー（見出し）の行頭で `k` と `y` で簡単できます。  

今回は、下記の設定を加えることで、カットまたはペースト時に、親ツリーの見出しに表示している統計情報を更新するようにしました。  

```emacs-lisp
;; "k" でツリーをカットする時に、カレントサブツリーと親の統計情報を更新する
(defun my-k-update-todo-statistics (f &rest n)
  (org-update-statistics-cookies nil)
  (let ((p (point))
  (not-last-subtree-p (funcall 'org-get-next-sibling)))
    (goto-char p)
    (apply f n)
    (if not-last-subtree-p
  (org-update-parent-todo-statistics)
      (org-previous-visible-heading 1)
      (org-update-statistics-cookies nil)
      (org-update-parent-todo-statistics)
      (org-next-visible-heading 1))))
(advice-add 'org-cut-subtree :around #'my-k-update-todo-statistics)

;; "y" でツリーをペーストする時に、カレントサブツリーと親の統計情報を更新する
(defun my-y-update-todo-statistics (&optional _arg)
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
(advice-add 'org-yank :after #'my-y-update-todo-statistics)
```

次のコマンドを使えば、バッファ全体で統計情報を更新できますが、数万行のファイルの場合は重くて頻繁に使えません。今回加えた設定のように、細かい単位で変化のあったツリーの統計情報を適宜更新するのが良さそうです。  

```emacs-lisp
(org-update-statistics-cookies 'all)
```
