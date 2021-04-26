+++
title = "all-the-icons から解脱したい"
author = ["Takaaki ISHIKAWA"]
date = 2021-04-17T15:30:00+09:00
lastmod = 2021-04-25T20:20:00+09:00
tags = ["emacs", "all-the-icons", "icons-in-terminal"]
categories = ["emacs"]
draft = false
+++

Emacsのモードラインやバッファを賑やかにしてくれる `all-the-icons.el` ですが、環境によっては希望するアイコンがレンダリングされなかったり、しかも直すのが簡単じゃありません。

不要なフォントファイルを削除したり、フォントセットの設定を変えたりと、場当たり的な回避方法がありますが、そろそろ本質的に解決したいところです。

勉強不足のせいで、そもそも `all-the-icons.el` がちゃんと動いている理由がよくわかっていないのですが、少なくともコードポイントが重複しているのが気になります。例えば、 `0xF0C4` が、 `faicons` ではハサミに、 `octicons` では箱にアサインされています。フォントロックがかかっていると後者が表示されますが、 `describe-char` 的には前者が使われています。なので対象を一度コピペすると二度と後者の表示が得られません。

{{< tweet 1383307489089708037 >}}

で、少なくともコードポイントについては唯一性を担保している(っぽい・mapがある)ものは無いかというところで、 `icons-in-terminal` の出番です。

-   <https://github.com/sebastiencs/icons-in-terminal>

`icons-in-terminal` は本来ターミナル上でフォントアイコンを使うことを意図したものですが、 `all-the-icons` を代替できると考えます。ということで、やってみました。

`icons-in-terminal` 自体が `icons-in-terminal.el` を提供していますが、ここで必要になるのは、 `all-the-icons.el` の代替となるもので、別途パッケージが存在しているのでそちらを導入します。導入手順等は気が向いたらまとめます。

そして私がこれまで依存してきた `all-the-icons` 関連のパッケージには、 `all-the-icons-ivy.el` と `all-the-icons-dired.el` があるのですが、これらは（調べた範囲で） `icons-in-terminal.el` 用のパッケージがありません。ということで、準備しました。自作したというより、 `all-the-icons-ivy.el` と `all-the-icons-dired.el` を `icons-in-terminal` で動かせるように手を加えたという感じです。

また現時点の頒布元の `icons-in-terminal.el` では `icons-in-terminal-dired.el` との接続が悪いので、自分用にカスタマイズしました。 ~~そのうち本家にフィードバックします。~~ 無事マージされました。

ということで準備したのは次の3つ。

-   <https://github.com/takaxp/icons-in-terminal.el>
-   <https://github.com/takaxp/icons-in-terminal-ivy>
-   <https://github.com/takaxp/icons-in-terminal-dired>

それぞれをインストールして、これまで `init.el` で `all-the-icons` 用に設定してきたところを、すべて `icons-in-terminal` に置換すればOKです。

最後に、 `fontset` で `icons-in-terminal` のフォントを使うことを指定して完了です。

```emacs-lisp
(set-fontset-font t '(#Xe000 . #Xf8ff) "icons-in-terminal")
```

とりあえずこれで `all-the-icons` が壊れた環境で `icons-in-terminal` を利用してうまく動かすことができました。しばらく運用して、問題がないようなら完全に移行しようと思います。

{{< tweet 1383318313904709639 >}}


## Update (2021-04-17@17:27) {#update--2021-04-17-17-27}

今後の拡張も考慮すると fontset の指定範囲を、Unicodeの私用領域に対応する `'(#Xe000 . #Xf8ff)` にするのが安全かもしれません。 `'unicode` 指定は too much だと思います。

```emacs-lisp
;; (set-fontset-font t '(#Xedff . #Xee6e) "icons-in-terminal") ;; firacode.el
;; (set-fontset-font t '(#Xe0a0 . #Xeea0) "icons-in-terminal") ;; icons-in-terminal-alist
;; (set-fontset-font t '(#Xe000 . #Xf8ff) "icons-in-terminal")
(set-fontset-font t 'unicode "icons-in-terminal")
```


## Update (2021-04-25@20:20) {#update--2021-04-25-20-20}

今回の修正が無事にマージされました。

-   <https://github.com/seagle0128/icons-in-terminal.el/pull/3>
