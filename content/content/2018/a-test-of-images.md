+++
title = "画像の埋め込みテスト"
author = ["Takaaki ISHIKAWA"]
date = 2018-08-24T14:02:00+09:00
lastmod = 2018-08-28T01:42:47+09:00
categories = ["hugo"]
draft = false
+++

まず前提として，このサイトのようにドメイン直下にディレクトリを作ってブログを運用する場合には，デフォルトだと `figure` shotcode が正しく動作しない．対応策は， `config.toml` で `canonifyURLs=true` にすること．

画像やその他のファイルの置き場所は，実は繊細な問題で，油断するとサイトが肥大化して管理が行き詰まるし，逆に外部サービスに依存するとサービス停止時に大変なことになる．そして今回は，画像を org バッファでインライン展開するかどうかも変数に入るので中々良い回答が出てこない．

`ox-hugo` の場合は， org バッファのディレクトリに画像を置いて，インライン展開に対応しつつ，content フォルダへの Markdown 出力時に public フォルダへ画像をコピーするという手法も取れる．すると，orgバッファではインライン画像を表示できて，公開したサイトでも正しく画像が表示されるようになる．が，当然ながら Hugoのディレクトリが肥大化する．

ということで，ローカルの肥大化を避けたいので，当面は以下のフローで画像を管理することにする．

1.  `static/files/2018` を作成して，2018年のコンテンツをここに置く
2.  サーバに同期する
3.  org ファイルでは `#+link` を使ってURLを短縮化
4.  org ファイルには短縮名で画像を指定する

短縮名設定は，org バッファの先頭で，

```org
#+link: files https://pxaka.tokyo/blog/files/2018/
```

と記述して，同行上で `C-c C-c` で忘れずに有効化する．

後は，通常のリンク記述で `files:` を使えばパスを簡略記入できる．

```org
[[files:twitter.jpg]]
```

この記述は，

```nil
[[https://pxaka.tokyo/blog/files/2018/twitter.jpg]]
```

に展開されるので，サーバにファイルが置かれていれば，確実に画像を埋め込むことができる．将来ファイルパスやドメインを変えたとしても， `#+link` 側の値を変えれば良い．

万が一ローカルが肥大化したら， `./static/files` を削除して，サーバにだけコンテンツを置く，或いは， `./static/files` はシンボリックリンクで飛ばしてもよい．

最終的には，

1.  D&Dでサーバ上の所定のディレクトリにサーバアップロード
2.  アップロード時にサムネイルを同時作成
3.  shortcodes のリンク生成を改良して，リンク先は大きな画像，表示は小さな画像を使う

とするのが目標．その他のファイル（PDFとかExcelとか）はアップロード時にサムネイル作成ってのも良い．

以下，適当に実験．

{{< figure src="/files/2018/twitter.jpg" width="128px" >}}

[/files/2018/twitter.jpg](~/Dropbox/org/blog/static/files/2018/twitter.jpg)

{{< figure src="http://localhost:1313/blog/files/2018/twitter.jpg" >}}

[files/2018/twitter.jpg](../static/files/2018/twitter.jpg)

{{< figure src="https://pbs.twimg.com/profile%5Fimages/892836904202149888/p%5FUbMC5Q%5F400x400.jpg" >}}

{{< figure src="https://pbs.twimg.com/profile%5Fimages/892836904202149888/p%5FUbMC5Q%5F400x400.jpg" width="128px" >}}

<https://pxaka.tokyo/owncloud/index.php/s/sf1CNSc3oLfKfuq>

{{< figure src="https://pxaka.tokyo/blog/files/2018/%E3%81%A4%E3%81%84%E3%81%A3%E3%81%9F %E3%81%AE %E7%94%BB%E5%83%8F.jpg" width="128px" >}}

{{< figure src="https://pxaka.tokyo/blog/files/2018/twitter.jpg" width="100px" >}}

`#+link` に非依存で正しく表示される．インライン不可．

{{< figure src="/files/2018/twitter.jpg" >}}

{{< figure src="/files/2018/twitter.jpg" width="128px" link="https://pxaka.tokyo/blog/files/2018/twitter.jpg" >}}


## References {#references}

-   [Figure shortcode with baseURL · Issue #4562 · gohugoio/hugo](https://github.com/gohugoio/hugo/issues/4562)
