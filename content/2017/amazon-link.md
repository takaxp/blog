+++
title = "Amazon リンク"
author = ["Takaaki ISHIKAWA"]
date = 2017-02-06T03:08:01+09:00
tags = ["message"]
draft = false
+++

アマゾンの検索窓を埋め込んでみます．単純にスクリプトを埋め込むだけで十分です． `tracking_id` を取得して，スクリプトの変数に入れればOKです．うわさによると，日本
語検索がうまく行かないそうな．

`ox-hugo` 経由だと， `_` がエスケープされるので，javascript のコードが正しく動作しない．
