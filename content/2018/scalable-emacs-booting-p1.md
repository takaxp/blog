+++
title = "スケーラブルなEmacs起動法(1)"
author = ["Takaaki ISHIKAWA"]
categories = ["emacs"]
draft = true
+++

Emacsを使い始めて基本的な操作に慣れてくると，たくさんのパッケージをインストールしたり， `init.el` に凝った設定を追加していくようになります．楽しいですよね．はい，わかります．

しかしそうすると，必然的に Emacs の起動に時間がかかるようになります．

起動時にたくさんのパッケージを一度に読み込めば，確かに起動後はストレスなく作業できるでしょう．一度にすべて読み込んで，セッション復元，ブックマーク・履歴復元，Helm起動，辞書の準備，カーソルやフレーム・モードライン等の視覚効果など，そして，[Org Mode](https://orgmode.org/) 等の各メジャーモードの設定群をすべて適用しておく．それも悪くありません．しかし，起動時のストレスは，あなたの精神を少しずつ蝕んでいくでしょう．

私は，好みに合わせてたくさんのパッケージを使える状態までカスタマイズしたEmacsを **フルアーマーEmacs** と呼ぶことにしました．ハイスペックな環境なら期待のパフォーマンスを発揮するでしょう．

しかし，普通の環境ではそうは問屋が卸しません． **フルアーマーEmacs** の扱いは，一般庶民・オールドタイプには難しいのです．

そんな **フルアーマーEmacs** であっても，ストレスを感じることなく高速起動する一つの手法を，私は **スケーラブルなEmacs起動法** と呼ぶことにしました．以下，そのポイントを記述していきます．


## 高速起動の阻害要因 {#高速起動の阻害要因}

まず， **フルアーマー** ではない素のEmacsは，どれだけ素早く起動するのでしょうか．

`emacs -q -nw` で素のEmacsを起動し， `M-x emacs-init-time` をすると，起動に費やした時間が表示されます．この値は，ほとんどの環境で，1秒以下でしょう．私の環境では `0.0 seconds` と表示されます．50[ms]未満ということです．一瞬です．ストレスフリー．

では，設定を増やしていくと，なぜ起動が遅くなるのでしょうか．以下に，主だった原因を示します．

1.  起動時にGCが動いている
2.  トップレベルでパッケージを `require` （または `load` ） している
3.  **scratch** バッファで不要なモードを立ち上げない
    -   [高速起動用ミニマム\*scratch\*バッファ - Qiita](https://qiita.com/takaxp/items/12c01bff4c687b3f242b)
4.  実は不要な設定をトップレベルで適用している
5.  各パッケージのインストール先が分散し， `load-path` が肥大化している


## 起動時にGCが動いている {#起動時にgcが動いている}

これは，設定の書き方だけに着目して高速化を目指す時の盲点です．Emacsが要求するメモリ量は，GUI利用の **フルアーマー** になると軽く 100[MB]を超えます．そして不運にも起動時にGCが働くと，起動時間が大幅に増えてしまいます．秒単位で増えますので，まずこれを防ぎます．

```emacs-lisp
(setq gc-cons-threshold 134217728) ;; 128MB
(setq garbage-collection-messages t) ;; GC実行時にメッセージを出す
```

この例では，起動後のメモリ専有量がおおよそ 100[MB]程度になると仮定して，GCのしきい値を 128[MB]に設定しています．これで起動時にGCを起こさずに済みます．実際に起動中にGCを起こすかどうかは， `garbage-collection-messages` を設定することで，容易に確認できます．

この改善策自体は，よく知られているものです．


## require ではなく with-eval-after-load を使う {#require-ではなく-with-eval-after-load-を使う}

`package.el` 等で各パッケージが統一的に管理されるようになった現在（Version 24以降）では，いわゆる `autoload` による遅延処理が働くため， `require` を使いながら書く設定を， `with-eval-after-load` に書き換えるだけで，起動は高速化されます．

```emacs-lisp
(when (require 'hoge nil t) ;; ここに時間がかかる．
  ;; hoge に関する設定を記述する．
  ;; hoge の読み込みに失敗すれば，すべてスキップされ，
  ;; 起動シーケンスが継続する．
  )
```

これを，以下のように書き換えるだけです．いつ `hoge.el` が読み込まれるかと言えば，パッケージの中で `autoload` 指定されている関数らが，Emacs 起動後に最初に呼ばれるタイミングです．すなわち，必要なときに読み込まれるため，起動を邪魔しません．

```emacs-lisp
(with-eval-after-load "hoge"
  ;; hoge に関する設定をここに記述する．
  )
```

起動時に本当に必要な設定（カーソルの色など視覚効果に関するものなど）以外は，極力， `with-eval-after-load` で括り，所定のパッケージが読み込まれた後で発動するようにしましょう．


## postpone.el のススメ {#postpone-dot-el-のススメ}

さて， `with-eval-after-load` の中に設定を書けば，各設定が遅延読み込みされ，高速化に繋がることが理解されたと思います．しかしながら，設定によっては， `with-eval-after-load` の適切な適用先が無いことも想定されます．

例えば，Emacs Version 26.1 から導入された， `pixel-scroll-mode` の設定．起動時にスクロールバーを表示しないのならば，トップレベルで以下を設定しない方が良いです．でも `with-eval-after-load` でぶら下げるべきパッケージは？

```emacs-lisp
(when (fboundp 'pixel-scroll-mode) ;; 存在するなら，すぐにマイナーモード発動
    (pixel-scroll-mode 1))
```

或いは， `selected.el` の設定群．このパッケージは，任意の文字列を選択した時に発動すべきものなので，起動時には不要です．でもどこにぶら下げれば良いでしょうか．

これらのように， **起動時には不要だが，起動直後からメジャーモードの起動直前までに必要** な設定があることがわかります．通常は，それらをトップレベルでのべた書きや前出の `(when (require 'hoge nil t)...)` で設定するために，起動が遅くなるのです．

そこで導入するのが [postpone.el](https://github.com/takaxp/postpone) です．起動時に適用されてしまうトップレベルで設定したくないが，起動後にすぐ使いたい設定群を， `postpone` にぶら下げればOKです．

以下は，従来は `(when (require 'selected nil t))` をトップレベルに記載していたものを， `postpone.el` を導入し， `with-eval-after-load` で包むようにした例です．

キーバインドの設定や独自関数の定義等，様々な処理を記述していますが，実際のところ起動時には不要です．しかし一方で，特定のメジャーモードの発動に依存せず，いつでも使えるようにしておきたい設定群です．

```emacs-lisp
(with-eval-after-load "postpone"
  (when (require 'selected nil t)
    (define-key selected-keymap (kbd ";") #'comment-dwim)
    (define-key selected-keymap (kbd "e") #'my-eval-region-echo)
    ;; (define-key selected-keymap (kbd "E") #'my-eval-region-echo-as-function)
    (define-key selected-keymap (kbd "=") #'count-words-region)
    (when (require 'helpful nil t)
      (define-key selected-keymap (kbd "m") #'helpful-macro))
    (define-key selected-keymap (kbd "f")
      (if (fboundp 'helpful-function) #'helpful-function #'describe-function))
    (define-key selected-keymap (kbd "v")
      (if (fboundp 'helpful-variable) #'helpful-variable #'describe-variable))
    (define-key selected-keymap (kbd "w") #'osx-dictionary-search-pointer)
    (define-key selected-keymap (kbd "5") #'query-replace-from-region)
    (define-key selected-keymap (kbd "g") #'my-google-this)
    (define-key selected-keymap (kbd "s") #'osx-lib-say-region)
    (define-key selected-keymap (kbd "q") #'selected-off)
    (define-key selected-keymap (kbd "x") #'my-hex-to-decimal)
    (define-key selected-keymap (kbd "X") #'my-decimal-to-hex)

    (defun my-eval-region-echo ()
      (interactive)
      (when mark-active
        (eval-region (region-beginning) (region-end) t)))
    (setq selected-org-mode-map (make-sparse-keymap))
    (define-key selected-org-mode-map (kbd "t") #'org-table-convert-region)

    (when (autoload-if-found
           '(my-org-list-insert-items my-org-list-insert-checkbox-into-items)
           "utility" nil t)

      (define-key selected-keymap (kbd "-") #'my-org-list-insert-items)
      (define-key selected-keymap (kbd "_")
        #'my-org-list-insert-checkbox-into-items))

    (when (autoload-if-found
           '(helm-selected)
           "helm-selected" nil t)
      (define-key selected-keymap (kbd "h") 'helm-selected))

    (when (require 'help-fns+ nil t)
      (defun my-describe-selected-keymap ()
        (interactive)
        (describe-keymap 'selected-keymap))
      (define-key selected-keymap (kbd "H") #'my-describe-selected-keymap))

    (unless batch-build
      (postpone-message "selected")
      (selected-global-mode 1))))
```

`(with-eval-after-load "postpone" ...)` で括った範囲をみると， `selected.el` だけでなく，関連するパッケージまで紐付いて読み込んでいることがわかります．このような設定群をトップレベルで実行したら，起動時間に影響を与えるのは簡単に理解できます．

さて，起動時間に影響するトップレベルでの設定を回避し， `postpone.el` に紐づけた設定群が発動するのがいつかというと， **起動後に初めてEmacsにコマンドを与えるとき** になります．例えば， `M-x` や `C-a` を押下した時です．

したがって， **スケーラブルEmacs起動法** は，Emacsの起動シーケンスを3段階に分割する効果を持ちます．

1.  最小限のトップレベルの設定( `global-set-key` など)で，Emacsを高速起動
2.  コマンド入力をトリガーに， **フルアーマー** の一部を `postpone` の効果で遅延設定
3.  メジャーモード等の通常の `with-eval-after-load` の発動

このように， **フルアーマー** に至る処理をユーザアクションに合わせて分割することで，ユーザの待ち時間を分散させます．

簡単に言えば，仮に上記のSTEP3までに到達するまでに3秒かかるとしても，各STEPがそれぞれ1秒で済むならば，それほどストレスにならないでしょ？ということです．


## 改修事例 {#改修事例}

すでに `use-package` を導入して綺麗に `init.el` を書いている人は無視してOKですが，伝統的な記法で `init.el` を書いている人は， `postpone.el` を導入して，次のように記述を改良すれば，前節のような遅延読み込みが簡単にできます．


## References {#references}

-   [#3 反復練習に勝るものなし -- 打鍵すべし！設定書くべし！ (Software Design 2014年7月号掲載記事) ヘルプシステム 困ったとき 初期設定](http://emacs.rubikitch.com/sd1407/)
-   [でらうま倶楽部 : Emacs 設定小ネタ集](http://blog.livedoor.jp/tek%5Fnishi/archives/1948086.html)
-   [Emacs ガベージコレクションの発動頻度設定｜gc-cons-threshold | 組込みエンジニアの思うところ](https://nagayasu-shinya.com/emacs-bc-cons-threshold/)
-   [package.el - Emacs JP](http://emacs-jp.github.io/packages/package-management/package-el.html)
