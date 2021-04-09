+++
title = "インラインパッチ付きmacOS用Emacs頒布"
author = ["Takaaki ISHIKAWA"]
date = 2021-04-02T12:04:00+09:00
tags = ["emacs"]
categories = ["emacs"]
draft = false
+++

以前から個人的にメンテナンスしている macOS向けEmacs NSビルド用の[インラインパッチ](https://github.com/takaxp/ns-inline-patch)ですが， Emacs 27.2 のリリースに合わせて Apple Silicon でビルドしたパッケージの頒布も開始しました．Big Surでのみ動作します．Intelチップ用ビルドもありますが，そちらは Mojave/Catalina/Big Surで動作します．

-   <https://github.com/takaxp/ns-inline-patch#pre-built-distribution-package>

インラインパッチの内容は 27.1 から変更がなく，以前のパッチをそのまま適用しています．その一方で，ビルド済みパッケージは，C実装（Native）のJSONパーサである `jansson` も同梱物として含めることにしました． `GnuTLS` については，以前と変わらず同梱しています．

Emacs EMPビルドの方は [metal](https://developer.apple.com/jp/metal/) に対応するなど，活発な活動状況だと思います．


## References {#references}

-   <https://github.com/takaxp/ns-inline-patch>
-   [Emacs-25.3/26.3(Mojave, Catalina, BigSur)/27.2/28.x にインラインパッチをあてて使う（macOS）](https://qiita.com/takaxp/items/e07bb286d80fa9dd8e05)
-   [Emacs 27.2 is released](https://lists.gnu.org/archive/html/emacs-devel/2021-03/msg01249.html)
-   [Re: Emacs Mac port](https://lists.gnu.org/archive/html/emacs-devel/2021-03/msg01331.html)
-   [jansson](https://digip.org/jansson/)
