+++
title = "VimConf 2018 で遊んできた話"
author = ["Takaaki ISHIKAWA"]
date = 2018-11-25T09:07:00+09:00
lastmod = 2018-11-27T17:29:00+09:00
tags = ["editor"]
categories = ["emacs"]
draft = false
+++

生粋の Emacsユーザである私ですが， VimConf2018 に参加してきました．

会議の開催場所は，比較的近所の秋葉原．駅から徒歩数分と近く，また，とても綺麗な会場でした．Twitter の [#vimconf](https://twitter.com/search?q=vimconf) タグで何枚か写真が出回っていると思いますが，それらから得られる印象よりも実際の会場はとても広く，満員の会場は登壇者に十分な威圧感を与えるものでした．

当初は登壇するつもりは全くなく，スパイよろしく潜伏する形で他宗派の会合に参加し，[今半の弁当](https://twitter.com/takaxp/status/1066169131660017664)を美味しくいただき，そして，ノベルティの Emacs 缶バッチを手に入れたらそそくさと退散する予定でした．

{{< tweet 1066134030444195842 >}}

ところが， Slack の [vim-jp](https://vim-jp.slack.com/) で戯れているうちに，折角の機会だし何か爪痕を残してくるのも悪くはないだろうと思い直し，ネタ的に LT 募集に応募したらまさかの accept だったというわけです．

LTの応募をしたときはもう頭がどうかしていて，すべて  [vim-jp](https://vim-jp.slack.com/) のコミュニティ力のせいですね．変な動画も出回っていて..．

{{< tweet 1047669110987837440 >}}

あ，これを作ったのは[私](https://gist.github.com/takaxp/ba9d33a4fafff6c86f3da26498d05711)です．といっても mattn 氏の[投稿](https://twitter.com/mattn%5Fjp/status/1047071077556465664)に便乗しただけですけどね．

さて，会議の内容は？といえば，LT含めて14名が登壇し，[朝の10時から夕方5時半まで開催](https://vimconf.org/2018/#link-timetable)する非常に充実したものでした．各講演の詳しいところは，多くのVimユーザの方々がレポートしてくださると思いますから，ここでは自分に関係するところだけをいくつか拾っていきます．

1.  Keynote - What is the next feature?	(speaker: Yasuhiro Matsumoto)
    -   トピック
        -   [vim-jp](https://vim-jp.slack.com/) の生い立ち，位置づけ，価値
        -   Vim をHTTPサーバ化
            -   現状は 20req/sec だが，50req/sec まで改善予定
        -   Vim本体開発には，GDB利用
        -   バイナリ確認

            ```sh
            xxd -g 1 bytes
            ```
    -   感想
        -   私にとっては，VimでもGoでもなく，Perlのお方．お会いできて嬉しい．
        -   いらすとやの呪縛（便利ですよね）
2.  Vim ported to WebAssembly (speaker: rhysd)
    -   トピック
        -   ブラウザで使える Vim
        -   [Emscripten](https://kripken.github.io/emscripten-site/)
        -   [WebAssembly](https://webassembly.org/getting-started/developers-guide/)
        -   ユーザからのキー入力等，非同期対応が必須だが，とても大変
        -   開発着手時，ブラウザ側にデバッグ機能がなく，printfデバッグで地獄を見た
    -   質疑
        -   キャンパスサイズの変更で表示が乱れるのはなぜか
            -   インタープリタ部分まで手を加えないとダメで現状での対応は大変
    -   感想
        -   技術的な興味があり，開発者ご本人の講演を聞けて幸せ
        -   Emacs port to WebAssembly ... どうかなー．
3.  カメラマン
    -   トピック
        -   参加者が今半の弁当に舌鼓を打つ間も，ひたすらにお仕事
    -   感想
        -   お疲れ様でした
4.  懇親会会場のサーバー
    -   トピック
        -   参加者が懇談する間も，ひたすらにお仕事
    -   感想
        -   「白ワインに炭酸水を入れて」とのお願いに，快く対応してくれて感謝
            -   そうやって飲む人が結構いますよ，と味方になってくれた．

自分のLTはどうだったかと言えば，エセ Vimmer としてデモでもしようと思ったら，当日になって動かないというよくあるパターンに．

{{< tweet 1066214946214572032 >}}

それでも，あれだけの沢山の聴講者の方々に， [vim-orgmode](https://github.com/jceb/vim-orgmode) あるいは [Org Mode](https://orgmode.org/) をデリバーできたのは良かったなと．

{{< figure src="https://takaxp.github.io/event/data/0C/8C7577-DA2E-4C69-B32D-05B5DEDE08A6/vimconf2018%5F2018-11-24%5F12-11-11.png" caption="Figure 1: Change your situation by Org" >}}

他の登壇者の方から「抽象的でわからん」とのご批判も受けましたが，仮に具体的な話をしたら **3時間いただいても足りません** と言わざるを得ません :p

{{< tweet 1066237668676136960 >}}

発表資料は，次のリンクからどうぞお持ちください．

-   <https://takaxp.github.io/event/vimconf2018.html>
-   <https://takaxp.github.io/event/vimconf2018.org>

最後に Emacs ユーザとしていくつか確認できたことをまとめます．

1.  Emacs はエディタとして非常に恵まれている
    -   それ Emacs で(すでに)できるよ案件が複数あった（多少誤解があるかも）
        -   テキストプロパティ
        -   パッケージマネジメント
        -   バイトコンパイル
        -   画像のインライン表示
    -   「Vim はテキストエディタです」と「Emacs はテキストエディタです」には乖離がある
2.  Emacs 難しい・Vim 難しい論は，状況依存であり，割とどうでもいい
    -   一方のエディタの習得が難しいから，他方を選ぶべき論は成り立たない
    -   (利用)環境がユーザを育てる
3.  モニタ領域を左右分割して使う
    -   横長のモニタを左右に領域をわけて使う人を多くみかけた
    -   左にブラウザ，右にVimのようなパターン
    -   タブレットでも左右分割の方が居た

なお，このブログも Org Mode（のエクスポータである [ox-hugo](https://ox-hugo.scripter.co/)）の恩恵です．

[see Orgfile](https://github.com/takaxp/blog/blame/master/entries/archive.org#L1313)


## パスタ {#パスタ}

ノベルティの[鮭とば](https://www.atware.co.jp/tobatware/)をパスタで食べたよ．旨々．

{{< tweet 1066540085917605888 >}}


## References {#references}

-   [vim-jp » vim-jpのチャットルームについて](https://vim-jp.org/docs/chat.html)
-   [VimConf 2018 まとめ - Togetter](https://togetter.com/li/1291515)
-   [【ネタ】有名エディタの学習曲線 | ソフトアンテナブログ](https://www.softantenna.com/wp/software/learning-curves-of-editors/)
-   [White Papers Relevant to Org-mode](https://orgmode.org/worg/org-papers.html)
-   [とばっとうぇあ — 株式会社アットウェア](https://www.atware.co.jp/tobatware/)
