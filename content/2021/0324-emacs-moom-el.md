+++
title = "moom.el のバージョン 1.6をリリース"
author = ["Takaaki ISHIKAWA"]
date = 2021-03-24T19:04:00+09:00
tags = ["emacs", "moom"]
categories = ["emacs"]
draft = false
+++

かねてより自分のために書いてきた [moom.el](https://github.com/takaxp/moom) の version 1.6 をリリースしました。  

前回のバージョンでは Windows 10 (w32) での動作を改善しましたが、今回は新機能の追加というところで、 undo 機能を盛り込みました。デフォルトのキーバインドは `C-c C-/` です。例のごとく、キーバインド自体はデフォルトで無効になっていますので、適宜有効化してください。  

```emacs-lisp
(with-eval-after-load "moom"
  ;; undo のバインドのみ設定
  (moom-recommended-keybindings '(undo))
  ;; undo を含む、全てのプリセットバインドを設定する場合
  ;; (moom-recommended-keybindings 'all)
  (moom-mode 1))
```

基本的に、フレームの位置とサイズが変更されるユーザアクションをコマンドとして考えて、コマンド発行時の状態を履歴として記録しています。何回分を保存するかは、 `moom-command-history-length` で制御でき、デフォルトは100回です。  

コマンドによっては、内部の hook が別なコマンドを呼んでいることもありますが、それらは履歴には記録していません。また、 `moom-cycle-frame-height` や `moom-toggle-frame-maximized` などは、状態がループするタイプのコマンドなので、これらも履歴には含めていません。  

{{< x user="takaxp" id="1374666742031544323" >}}  

主なユースケースとしては、直前に発行したコマンドを巻き戻す（1回だけやり直す）が重要かなと思います。その意味でデフォルトの100回保存はちょっとオーバー設定かもしれません...が、今のところ大した情報は保存していないので、問題ないかなと思います。将来的に履歴として保存する情報が増えるようなら、10回程度に変更するかもしれませんが、いずれにしろカスタム変数なので、自由に変更できます。  

Enjoy!
