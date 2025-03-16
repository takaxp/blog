+++
title = "org 9.7から tab-width が 8 に限定される"
author = ["Takaaki ISHIKAWA"]
lastmod = 2025-03-02T00:00:00+09:00
tags = ["emacs", "orgmode"]
categories = ["emacs"]
draft = false
+++

Emacs 30.1に標準搭載されている org 9.7 では、 `tab-width` が `8` 指定になりました。[強制ではない](https://git.savannah.gnu.org/cgit/emacs/org-mode.git/tree/etc/ORG-NEWS?h=release%5F9.7.23&id=ec72678881b73d04f8cf4e574cbb7a470e9155d3#n54)ですが、 `8` 以外にカスタマイズしていると、次のように org-element がバグるので、実質的に `8` 強制ですね。  

```emacs-lisp
⛔ Warning (org-element): org-element--cache: Org parser error in next.org::26461. Resetting.
 The error was: (error "Tab width in Org files must be 8, not 2.  Please adjust your ‘tab-width’ settings for Org mode")
 Backtrace:
nil
 Please report this to Org mode mailing list (M-x org-submit-bug-report).
```

これまで私は `tab-width` を `2` 指定にして使ってきたのですが、今回しぶしぶ `8` 指定にしました。ところが、それでも上記のエラーが生じて困惑することに。色々と確認した結果、 `.editorconfig` の `indent_size` の値も書き換えておかないとダメでした。気をつけましょう。  

```emacs-lisp
[*.org]
charset = utf-8
end_of_line = lf
insert_final_newline = true
indent_style = space
indent_size = 8
trim_trailing_whitespace = false
```

なお、すでに `tab-width=2` で編集してあるバッファは、公式から提供されている次の関数で `tab-width=8` に変更できます。  

```emacs-lisp
(defun org-compat-adjust-tab-width-in-buffer (old-width)
    "Adjust visual indentation from `tab-width' equal OLD-WIDTH to 8."
    (interactive "nOld `tab-width': ")
    (cl-assert (derived-mode-p 'org-mode))
    (unless (= old-width 8)
      (org-with-wide-buffer
       (goto-char (point-min))
       (let (bound
       (repl (if (< old-width 8)
           (make-string old-width ?\s)
                     (concat "\t" (make-string (- old-width 8) ?\s)))))
   (while (re-search-forward "^ *\t" nil t)
     (skip-chars-forward " \t")
     (setq bound (point-marker))
     (forward-line 0)
     (while (search-forward "\t" bound t)
       (replace-match repl)))))))
```
