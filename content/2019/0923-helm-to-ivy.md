+++
title = "MarkdownリンクをHTML形式に置換する"
author = ["Takaaki ISHIKAWA"]
date = 2019-09-23T15:18:00+09:00
images = ["https://pxaka.tokyo/img/twitter_2019-08-08.jpg"]
tags = ["emacs", "helm", "ivy"]
categories = ["emacs"]
draft = false
+++

年数回開催されて，私もそれなりの頻度で参加している[東京Emacs勉強会](https://tokyo-emacs.connpass.com)ですが，2019年に入って発表者に `ivy-mode` ユーザが多いように思い，移行してみようかな？とそれまで `helm-mode` を使ってきた私の気持ちが揺らぎました．

そんな迷いと試験的な設定を Twitter に投稿すると，徐々に移行するのを期待されている雰囲気が出てきたので（気の迷い），せっかくならば記録を付けながらということで，記事を書く前提で `helm-mode` から `ivy-mode` に移行しました．

移行で得られた知見は，Qiita に[helm を背に ivy の門を叩く - Qiita](https://qiita.com/takaxp/items/2fde2c119e419713342b)と題して書かせいただきました．まとまった文章を書く時は，人前でお話したくなるのが自然なことですから，Emacs勉強会でも[さよならhelm、ようこそivy/counsel - Speaker Deck](https://speakerdeck.com/takaxp/counsel)としてお話しました．個人的には最高のオチだったと思います（オチはスライドから削除してあります．版権の問題で...）．

結果として，記事をきっかけに `ivy-mode` に移行した方も複数いらっしゃるようで，少しは役に立てたかと安堵しています．

さて，Qiitaへの記事の投稿ですけども，Markdownを書くなんて野暮なことはしていません．もちろん[Org mode](https://orgmode.org/)で書き，[ox-qmd](https://github.com/0x60df/ox-qmd)を使って Qiita 用の Markdown を生成するわけです．ただ，同じソースを使って `ox-html` で出力する時に少々手間取りました．通常の文字列とコードは問題ないのですが，Qiita用に生成した画像リンクを通常のHTMLに書き出す時にひと手間が必要でした．

まず基本的な作業フローとしては，

1.  org-mode でローカル執筆する（org fileを更新）
2.  `ox-qmd` で書き出したドラフトを，Qiita のオンラインエディタでコピペする
3.  画像等メディアが必要な場合，オンラインエディタにD&Dして，リンクを得る
4.  取得したリンクを org file の `begin_export html` なソースブロック内にコピペする

この繰り返しです．

Qiita のオンラインエディタでは，画像をD&Dすると `![filename](uri)` な Markdown の記法でリンクが生成されます．それをそのまま `begin_export html` のソースブロックに保存すれば，Qiita では正しくレンダリングされます．

```emacs-lisp
#+begin_export html
![filename](uri)
#+end_export
```

しかし，そうして作成した org file から通常のHTMLをエクスポートすると，HTMLリンクに正しく変換されません．そこで， `ox-qmd` でエクスポートしても， `ox-html` でエクスポートしても，どちらでも成立する状態になるようにソースブロックの中身を書き換えます．要は，HTMLコードに置換しておくのです．

次の関数をコールして，どちらの環境でも正しく読み込まれるHTMLコードを生成しています．org file を表示中に `M-x my-convert-md-link-to-html` するだけです．必要ならば，バッファ保存時に毎度走らせても良さそうです．

```emacs-lisp
(defvar md-link-format "^!\\[\\(.+\\)\\](\\(.+\\))$")
(defun my-convert-md-link-to-html ()
    (interactive)
    (goto-char (point-min))
    (while (re-search-forward md-link-format nil :noerror)
      (let* ((prev (match-string-no-properties 0))
             (alt (match-string-no-properties 1))
             (src (match-string-no-properties 2))
             (new (concat "<p><img src=\"" src "\" alt=\"" alt "\" /></p>")))
        (replace-match new)
        (message "====\ninput:\t%s\noutput:\t%s" prev new)))
    (message "--- done."))
```

`M-x my-convert-md-link-to-html` でリンクを書き換えることで，次の2つのサイトに並列エクスポートできるようになりました．ワンソース・マルチユースです（懐かしい）．

1.  [helm を背に ivy の門を叩く - Qiita](https://qiita.com/takaxp/items/2fde2c119e419713342b)
2.  [helm を背に ivy の門を叩く](https://takaxp.github.io/articles/qiita-helm2ivy.html) (takaxp.github.io)

個人的には，後者のように見出しが独立してアクセスしやすい記事が好きです．なお，画像の使い回しについては，利用規約的にどうかな？と思うところはありますが，とりあえず大丈夫そうです．問題がありそうなら，画像コンテンツを回収して適切な場所に置こうと思います．その場合であっても，リンクの張替えだけで済みます．
