+++
title = "org-log-repeat を改良"
author = ["Takaaki ISHIKAWA"]
date = 2025-02-10T23:20:00+09:00
tags = ["emacs", "orgmode"]
categories = ["emacs"]
draft = false
+++

`org-log-repeat` を non-nil に設定すると、繰り返しタスクを一度完了(その後に自動でTODOに戻る)するたびに、次のような情報が記録されます。

```emacs-lisp
- State "DONE"       from "TODO"       [2025-02-10 Mon 22:55]
```

繰り返し頻度が高かったり、長期間に渡って完了開始を繰り返すタスクの場合には、記録されるデータがどんどん増えてしまいます。今のところ、私はこの記録をうまく活かせていないので停止することにしました。

ところが、 `org-log-repeat` を nil に設定すると、副作用で "LAST\_REPEAT" が記録されなくなります。完了開始を最後に実行したタイミングは残しておきたいので、次の設定を加えることで対応しました。

<要件まとめ>

-   (タスクを繰り返すたびに)最後に繰り返した日時をLAST\_REPEATに記録したい
-   ただし、繰り返すたびにState-from を(LOGBOOKに)記録したくはない

<!--listend-->

```emacs-lisp
(with-eval-after-load "org"

  ;; タスク繰り返し時にログを残さない
  (setq org-log-repeat nil)

  ;; タスク繰り返し時にログを残さないが、LAST_REPEAT は記録する。
  (advice-add 'org-todo :after #'my-org-last-repeat)

  (defun my-org-last-repeat (&optional _arg)
    (when (and (org-get-repeat)
               (org-entry-is-todo-p))
      (org-entry-put nil "LAST_REPEAT" (format-time-string
                                        (org-time-stamp-format t t))))))
```
