+++
title = "define-key から keymap-set に移行"
author = ["Takaaki ISHIKAWA"]
date = 2025-02-22T15:01:00+09:00
tags = ["emacs"]
categories = ["emacs"]
draft = false
+++

Emacs 29.1からキーバインドの設定には `define-key` ではなく `keymap-set` を使うように変更(推奨)されています。[自分の設定](https://takaxp.github.io/init.html)も変更してみました。(see [What’s New in Emacs 29.1?](https://www.masteringemacs.org/article/whats-new-in-emacs-29-1))

<div class="table-caption">
  <span class="table-number">Table 1</span>:
  before/after
</div>

| 変更前                    | 変更後               |
|------------------------|-------------------|
| define-key                | keymap-set           |
| global-set-key            | keymap-global-set    |
| local-set-key             | keymap-local-set     |
| global-unset-key          | keymap-global-unset  |
| local-unset-key           | keymap-local-unset   |
| substitute-key-definition | keymap-substitute    |
| define-key-after          | keymap-set-after     |
| lookup-key                | keymap-lookup        |
| kye-binding               | keymap-lookup        |
| locak-key-binding         | keymap-local-lookup  |
| global-key-binding        | keymap-global-lookup |

これまで kbd を挟んでいましたが、単純な置き換えではうまく行かないパターンもあったので、 `SPC` などの指定は、 `"SPC"`, `"RET"`, `"<tab>"`, `"S-<tab>"`, `"<delete>"` を kbd を挟まずに指定することでうまくいきました。

例えばこんな設定になります。

```emacs-lisp
;; (global-set-key (kbd "M-v") 'yank)
(keymap-global-set "M-v" 'yank)

;; (global-set-key [delete] 'delete-char)
(keymap-global-set "<delete>" 'delete-char) ;; "delete" ではダメ。

;; (global-set-key (kbd "M-SPC") 'my-toggle-ime-ns)
(keymap-global-set "M-SPC" 'my-toggle-ime-ns)

;; (define-key isearch-mode-map (kbd "S-SPC") 'my-toggle-ime-ns)
(keymap-set isearch-mode-map "S-SPC" 'my-toggle-ime-ns)

;; (global-set-key (kbd "C-M-t") 'beginning-of-buffer)
(keymap-global-set "C-M-t" 'beginning-of-buffer)

;; (global-set-key (kbd "C-t") 'scroll-down)
(keymap-global-set "C-t" 'scroll-down)

;; (global-set-key (kbd "C-c g") 'goto-line)
(keymap-global-set "C-c g" 'goto-line)

;; (global-set-key (kbd "M-]") 'bs-cycle-next)
(keymap-global-set "M-]" 'bs-cycle-next)

;; (global-set-key (kbd "RET") 'electric-newline-and-maybe-indent)
(keymap-global-set "RET" 'electric-newline-and-maybe-indent)

;; (global-set-key (kbd "M-=") 'count-words)
(keymap-global-set "M-=" 'count-words)

;; (global-set-key (kbd "C-;") 'comment-dwim) ;; M-; is the defualt
(keymap-global-set "C-;" 'comment-dwim) ;; M-; is the defualt

;; (global-set-key (kbd "C-c f m") 'moom-fill-band)
(keymap-global-set "C-c f m" 'moom-fill-band)

;; (define-key counsel-mode-map [remap find-file]  nil)
;; (substitute-key-definition 'find-file nil counsel-mode-map)
(keymap-substitute counsel-mode-map 'find-file nil nil)

;; (define-key KEYMAP [remap OLDDEF] NEWDEF)
;; (define-key counsel-mode-map [remap find-file] nil)
;; (substitute-key-definition OLDDEF NEWDEF KEYMAP &optional OLDMAP)
;; (substitute-key-definition 'find-file nil counsel-mode-map)
```
