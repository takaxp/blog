+++
title = "拙作パッケージのメンテナンス"
author = ["Takaaki ISHIKAWA"]
date = 2020-06-06T00:25:00+09:00
lastmod = 2020-06-07T11:00:00+09:00
tags = ["emacs", "org-mode"]
categories = ["emacs"]
draft = false
+++

拙作のパッケージのメンテナンスを再開しました．どちらもまだまだ改良が必要なのですが，とりあえずはドキュメントの更新からでしょうか...


## org-tree-slide.el {#org-tree-slide-dot-el}

-   [takaxp/org-tree-slide: A presentation tool for org-mode based on the visibility of outline trees](https://github.com/takaxp/org-tree-slide)
-   [Writing Non-Beamer presentations in org-mode](https://orgmode.org/worg/org-tutorials/non-beamer-presentations.html)
-   [org-modeのツリーでスライドショー - Qiita](https://qiita.com/takaxp/items/8dfb5d34dfcd79f9fa5c)

Emacs でプレゼンテーションしたくて作り始めたパッケージです．最近の自分の Emacs の使い方としては，プレゼンテーションモードに突入しないでも， [org-mode](https://orgmode.org/) のツリーを `fold/unfold` (`tab` のtoggle) したり， `narrowing/widen` (`s` のtoggle) したりして対応しています．なので，このパッケージの出番が少し減っていました．出番が減ると，メンテナンスする機会が減りますよね．

Qiitaに移築した Wiki の記事はかなり古いので，書き直して再公開したいです．

{{< figure src="https://pxaka.tokyo/blog/files//201x/072a87ca-9033-3c24-91eb-f1a1bf158c75.gif" >}}


## moom.el {#moom-dot-el}

-   [takaxp/moom: A Moom port to Emacs - Make your dominant hand FREE from your mouse](https://github.com/takaxp/moom)
-   [Moom - Qiita](https://qiita.com/takaxp/items/0f094eb94554eb08ace3)

Emacs のフレームをマウスで動かしたり，マウスでフレームサイズを変更するのが嫌で作ったパッケージです．キーボード操作だけでスクリーン上の Emacs ウィンドウの位置を制御できます．もともと Manytricks の [moom](https://manytricks.com/moom/) というデスクトップアプリからインスパイヤされて作り始めましたが，気づけば独自機能満載の便利ツールに仕上がっています．日本語フォントの拡大縮小にも対応していて，[org-tree-slide.el](https://github.com/takaxp/org-tree-slide) で全画面プレゼンテーションする時にも重宝します．macOSでの利用を前提としています．Linux と Windows でも動きますが，色々と微調整が必要なのでまだ正式対応とは言えない状態です．

{{< figure src="https://pxaka.tokyo/blog/files//201x/fc0fafe5-4e83-6444-683b-b3bfa21af4ca.gif" >}}
