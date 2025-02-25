+++
title = "line-spacing を制御する"
author = ["Takaaki ISHIKAWA"]
date = 2019-11-16T18:56:00+09:00
lastmod = 2019-11-18T21:40:00+09:00
tags = ["emacs", "line-spacing"]
categories = ["emacs"]
draft = false
+++

`line-spacing` は、行間を制御する変数です。バッファローカルな変数なので、ミニバッファも含めて、各バッファの行間を個別に制御できます。  

これまでは起動時に `(set-default 'line-spacing 0.3)` としていましたが、 `bs.el` に関連した改良を進めるうちに、 `(message "1\n2")` で作られるミニバッファの改行において、行間を制御するのが困難なことがわかりました。  

症状としては、 `global` に設定された `0.3` を超えるような行間にはできるが、それを下回る値、具体的には行間を `nil` に戻すことができないことがわかりました（いやできる、という場合は教えて下さい〜）。なお、 `minibuffer-setup-hook` を使うことも考えられますが、やはり上手くいきません。  

で、最終的にたどり着いた解決策は、行間を `global` には指定せずに、バッファを開くたびに `line-spacing` を自動で指定するアプローチです。次のようにします。  

```emacs-lisp
(defun my-linespacing ()
  (unless (minibufferp)
    (setq-local line-spacing 0.3)))
(add-hook 'buffer-list-update-hook #'my-linespacing)
(add-hook 'org-src-mode-hook #'my-linespacing)
```

ポイントは、 `buffer-list-update-hook` です。個人的には初めて使う `hook` ですが、基本的にはカーソルが別バッファに移動したら呼ばれる `hook` として考えて良さそうです。例外的に `org mode` のソースブロックでは発火しないので、別途 `org-src-mode-hook` を設定しています。  

`my-linespacing` はシンプルに、 `global` ではなく `local` 変数の `line-spacing` を書き換えます。 `(minibufferp)` で括っているのは、ミニバッファの行間を `my-linespacing` に左右されずに制御するためです。  

先に示した `(message "1\n2")` の行間を制御するには `propertize` を使います。これは [Emacs JP の Slack](https://emacs-jp.github.io/) で教えてもらいました。ありがとうございます。  

```emacs-lisp
(message (propertize "1\n2" 'line-spacing 0.9))
```

のように指定します。カジュアルに試すには、 `run-with-timer` を使うと良く、  

```emacs-lisp
(run-with-timer
 1 nil
 (lambda () (message (propertize "1\n2" 'line-spacing 0.9))))
```

を評価(`M-:`)すれば、効果を確認できます。
