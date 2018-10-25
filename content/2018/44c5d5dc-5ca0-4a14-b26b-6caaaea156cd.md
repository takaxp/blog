+++
title = "MELPAにあるテーマ一覧"
author = ["Takaaki ISHIKAWA"]
date = 2018-10-26T02:03:00+09:00
tags = ["MELPA"]
categories = ["emacs"]
draft = false
+++

MELPAから入手可能な Emacs用のテーマが一覧化されています．どのメジャーモードに対応しているかも確認できます．

[PeachMelpa | Browse Emacs themes from MELPA](https://peach-melpa.org/)

インストールは，例えば，

```emacs-lisp
M-x package-install
```

としてから，希望のテーマ名（例： `darkokai-theme` ）を入力（選択）します．

インストールが終わったら，当該のテーマ `init.el` で読み込みます．

```emacs-lisp
(when (require 'darkokai-theme nil t)
  (load-theme 'darkokai-theme t))
```
