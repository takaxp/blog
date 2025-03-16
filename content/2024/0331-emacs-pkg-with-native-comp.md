+++
title = "インラインパッチ付きmacOS用EmacsをNativeComp対応に"
author = ["Takaaki ISHIKAWA"]
date = 2024-03-31T19:05:00+09:00
tags = ["emacs", "mac", "ns-inline-patch"]
categories = ["emacs"]
draft = false
+++

脆弱性対策の為に先日、最新の安定版[29.3がリリース](https://lists.gnu.org/archive/html/emacs-devel/2024-03/msg00611.html)されたEmacsですが、次のメジャーアップデートのEmacs 30からは、NativeCompがデフォルトでオンになるようです。  

<https://github.com/emacs-mirror/emacs/blob/master/etc/NEWS#L29>  

```org
** Native compilation is now enabled by default.
'configure' will enable the Emacs Lisp native compiler, so long as
libgccjit is present and functional on the system.  To disable native
compilation, configure Emacs with the option:

./configure --with-native-compilation=no
```

macOS用のインラインパッチ付きEmacsはどうしましょう...  

各環境でビルドする場合は、基本的に何ら問題はないので積極推奨です。一方、頒布用パッケージでも NativeCompを有効化するのかは、ずっと悩んでいたところです。というのもの、頒布用パッケージ(pkg)のファイルサイズが巨大化するのと、各環境での libgccの扱いを私自身いまいち把握しきれていないためです。  

そうは言っても将来的にデフォルトオンになってしまうということですから、可能な限りの対応をしてみました。  

これまでに、ビルド時に付けるオプション、ポータブル化のためのライブラリ設定、実行時の警告回避など、libgccjitの組み込みに対応する形でビルド環境整備し、とりあえずクラッシュはしない pkgを作成できました。ついでに、リリース用のビルド環境を、手元のMacからGitHub Actionsに移行しました（これも結構大変だった...）。  

ただ現状、pkgからインストールされる NativeComp有効の Emacsを使うには、 **homebrewのgccのインストールが必要** です。これは、NativeCompが走る時に libgccjitが gccの libgcc.aと libemutls\_w.aを必要とするためで、両ライブラリを pkgに組み込むところで私の作業が止まっています。今後解決するつもりですが、現状では、次の3ステップで NativeCompが有効化されたEmacs 29.3を使えます。  

1.  brew で gcc をインストール  
    -   `brew install gcc` 実行済みの場合は不要です
    -   ターミナルで下記を実行で済みます(brew導入+gccインストール)  
        
        ```sh
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
        brew install gcc
        ```
2.  pkg を入手してEmacsをインストール（Emacs 29.3 with ns-inline-patch）  
    -   <https://pxaka.tokyo/emacs/pkg/emacs-29.3%5Fapple%5Fnc.pkg> をダウンロード
    -   実行するとインストーラが立ち上がるので、そのままインストール
    -   インストール先は、 `/Applications/Emacs-takaxp` 以下です。必要に応じて移動させてください。
3.  おそらく(現段階では)多くの環境で `LIBRARY_PATH` の設定が必要です  
    -   設定内容は、次節の「実行時に警告が発生したら」の内容を確認してください

上記のpkgは、Apple Silicon向けですが、Intel macの人は、<https://pxaka.tokyo/emacs/pkg/emacs-29.3%5Fintel%5Fnc.pkg> を入手してください。  

-   MD5(for apple): f9ef003bedab5de437aba962d0b07750
-   MD5(for intel): ecc606f5f463b1f31febbbd6be8f0d2b

上記のインストーラでインストールされるEmacsは、AOTオプション付きでビルドしてあります。なのでアプリケーションのサイズが以前よりだいぶ増えています...(380MB程度)  

(おまけ) M-x emacs-build-description を知るなど。  

Enjoy!  


## 実行時に警告が発生したら {#実行時に警告が発生したら}

もし下記のような警告が実行に表示される場合には、  

```sh
⛔ Warning (comp): libgccjit.so: error: error invoking gcc driver
```

次の設定を `early-init.el` か、 `.emacs` の上の方に記載してみてください。  

```emacs-lisp
(setenv "LIBRARY_PATH"
        (string-join
         '("/opt/homebrew/opt/gcc/lib/gcc/13"
           "/opt/homebrew/opt/libgccjit/lib/gcc/13"
           "/opt/homebrew/opt/gcc/lib/gcc/13/gcc/aarch64-apple-darwin23/13")
         ":"))
```

`13`, `aarch64`, `darwin23` の部分は、環境に合わせて修正が必要な場合があります。  


## reference {#reference}

-   [takaxp/ns-inline-patch: An enhanced inline patch for GNU Emacs (nextstep)](https://github.com/takaxp/ns-inline-patch)
-   [インラインパッチ付きmacOS用Emacs頒布 - imadenale](https://pxaka.tokyo/blog/2021/0402-emacs-inline-package-dist/)
