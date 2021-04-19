+++
title = "view-modeをorgバッファで違和感なく使う設定"
author = ["Takaaki ISHIKAWA"]
date = 2021-04-15T21:50:00+09:00
lastmod = 2021-04-17T23:10:00+09:00
tags = ["emacs", "org-mode", "view-mode"]
categories = ["emacs"]
draft = false
+++

`init.el` を `org-mode` で書いている関係から、一般的な設定ファイルと同じように、特定のorgファイルが簡単に書き換わってほしくない状態にあります。そういうファイルは `view-mode` で扱うのがよいですね。

ということで、いくつか独自の関数を設定して、 `n`, `p` に割り当てました。こうすることで、書き込み保護を維持したまま、例えば `n` 押下で、headingにいる場合は次の headingに移動し、そうでない場合は次の行にカーソルを移動できます。 `<tab>`, `S-<tab>`, にも機能を振りましたが、どうやらそうしなくても `org-cycle` は発動するようです。なので、発動しない場合にのみ適用してみてください。

```emacs-lisp
(defun my-org-view-next-heading ()
  (interactive)
  (if (and (derived-mode-p 'org-mode)
           (org-at-heading-p))
      (org-next-visible-heading 1)
    (next-line)))

(defun my-org-view-previous-heading ()
  (interactive)
  (if (and (derived-mode-p 'org-mode)
           (org-at-heading-p))
      (org-previous-visible-heading 1)
    (previous-line)))

(defun my-view-tab ()
  (interactive)
  (when (and (derived-mode-p 'org-mode)
             (or (org-at-heading-p)
                 (org-at-property-drawer-p)))
    (let ((view-mode nil))
      (org-cycle))))

(defun my-view-shifttab ()
  (interactive)
  (when (derived-mode-p 'org-mode)
    (let ((view-mode nil))
      (org-shifttab))))

(with-eval-after-load "view"
  (define-key view-mode-map (kbd "<tab>") 'my-view-tab)
  (define-key view-mode-map (kbd "S-<tab>") 'my-view-shifttab)
  (define-key view-mode-map (kbd "<SPC>") 'ignore)
  (define-key view-mode-map (kbd "i") 'View-exit-and-edit)
  (define-key view-mode-map (kbd "f") 'forward-char)
  (define-key view-mode-map (kbd "b") 'backward-char)
  (define-key view-mode-map (kbd "n") 'my-org-view-next-heading)
  (define-key view-mode-map (kbd "p") 'my-org-view-previous-heading))
```

なお、特定のファイルや特定のディレクトリ以下にあるファイルを自動的に `view-mode` で開く設定は、[5.24 viewモード](https://takaxp.github.io/init.html#org6b6c1c11)を参照してください。


## References {#references}

-   [5.24 viewモード](https://takaxp.github.io/init.html#org6b6c1c11)
