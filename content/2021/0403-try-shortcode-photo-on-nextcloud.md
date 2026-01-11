+++
title = "画像埋め込み用ショートコードテスト"
author = ["Takaaki ISHIKAWA"]
date = 2021-04-03T00:50:00+09:00
images = ["https://pxaka.tokyo/nextcloud/index.php/apps/files_sharing/publicpreview/cH7yAFHxgm98sDH?x=1024&y=1024&a=true&file=IMG_0024.jpg"]
lastmod = 2021-04-07T20:00:00+09:00
tags = ["photo", "hugo"]
categories = ["photo"]
draft = false
+++

本文を追加するとこんな感じになります。  

{{< photo EeS4ZkfwaRrC478 >}}  

ショートコード自体はかなりシンプルで、URLを構築する部分と、メタデータを並べる部分、そしてそれらを配置する部分しかありません。  

{{< photo 4P5caLmQwenJ7XN >}}  

ページに読み込んでくる画像は、Nextcloud側で public link を生成している画像で、標準で発行されるリンクではなく、解像度を下げたサムネイルを取得可能なリンクを使っています。各画像をクリックすると、Nextcloudの高解像度画像を見られます。  

{{< photo AFKoxY3TxPzk2dc >}}  

一応レスポンシブ対応しています。
