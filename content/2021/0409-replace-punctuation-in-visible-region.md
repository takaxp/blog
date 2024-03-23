+++
title = "バッファ内の句読点を変換する"
author = ["Takaaki ISHIKAWA"]
date = 2021-04-09T19:46:00+09:00
tags = ["emacs"]
categories = ["emacs"]
draft = false
+++

再開発感満載ですが、句読点を置き換えるコマンドを書きました。  

`M-x my-replace-punctuation-to-scientific` でカンマ・ピリオドに、 `M-x my-replace-punctuation-to-normal` で点丸になります。  

{{< gist takaxp 519139e54ce5ab8034887443a16e63c0 >}}