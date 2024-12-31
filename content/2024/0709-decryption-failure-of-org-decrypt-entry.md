+++
title = "古い暗号化エントリーの Decryption failed を回避する"
author = ["Takaaki ISHIKAWA"]
date = 2024-07-09T19:01:00+09:00
lastmod = 2024-07-26T08:45:00+09:00
tags = ["emacs", "org-mode"]
categories = ["emacs"]
draft = false
+++

org ファイルの各エントリーは、gpg を使って暗号化できますが、かれこれ10年ほど前に暗号化したエントリーを復号できないケースに当たりました。数年前にも同じようなケースに遭遇しましたが、今回はその時とは違う方法で解決できたので、記録を残します。  


## 症状 {#症状}

-   暗号化されたエントリーを `M-x org-decrypt-entry` で復号する時に、復号が失敗し、次のメッセージがミニバッファに表示される。

<!--listend-->

```sh
GPG error: "Decryption failed", ""
```


## 解法 {#解法}

-   gpg.conf に `ignore-mdc-error` を追加する。  
    -   通常は、  `~/.gnupg/gpg.conf` に置かれています。

<!--listend-->

```conf
ignore-mdc-error
```


## 解法特定までの道のり {#解法特定までの道のり}

10年ほど前に暗号化したと思われるエントリーを、2024年の環境で復号しようと試みたところ、 `Decryption failed` が発生しました。  

エントリーの中身は、PGP MESSAGE のセクションで構成されているだけなので、同セクションを含むファイルを独立したファイルとして新たに保存して、Emacs 外でそのファイルを gpg コマンドで復号しました。すると、次のようなメッセージが出力されました。  

```sh
% gpg -d hoge.key
gpg: CAST5.CFB暗号化済みデータ
gpg: 1 個のパスフレーズで暗号化
<!-- 部分的に復号できた文字列 -->
gpg: *警告*: メッセージの完全性は保護されていません
gpg: ヒント: もし、このメッセージが2003年以前に作成されたのであれば、
     このメッセージはおそらく正当でしょう。当時、整合性保護は広く使われ
     てはいなかったためです。
gpg: それでも復号するにはオプション '--ignore-mdc-error' を使います。
gpg: 復号は強制的に失敗とされました!
```

指示通りに `--ignore-mdc-error` を付けて再試行すると、次のメッセージに変わります。  

```sh
% gpg --ignore-mdc-error -d hoge.key
gpg: CAST5.CFB暗号化済みデータ
gpg: 1 個のパスフレーズで暗号化
<!-- 部分的に復号できた文字列 -->
gpg: *警告*: メッセージの完全性は保護されていません
```

出力によれば「失敗」扱いでなくなっているので、 `--ignore-mdc-error` を gpg.conf に書き込んで、その後、org ファイルの暗号化エントリーを復号してみました。すると、 `Decryption failed` が表示されることもなく、無事に復号でき、エントリーの内容を確認することができました。めでたしめでたし。  


## 恒常的な解法か？ {#恒常的な解法か}

<https://fossies.org/linux/gnupg/NEWS> によれば、無条件に `--ignore-mdc-error` を指定し続けることは非推奨のようです。そのため、同オプションを指定して復号できることを確認したら、明示的に暗号化しなおして、オプションなしでも復号できるようにエントリーを更新しておくのが良いですね。  

```text
1560   Changes also found in 2.2.8:
1561 
1562   * gpg: Decryption of messages not using the MDC mode will now lead
1563     to a hard failure even if a legacy cipher algorithm was used.  The
1564     option --ignore-mdc-error can be used to turn this failure into a
1565     warning.  Take care: Never use that option unconditionally or
1566     without a prior warning.
1567 
1568   * gpg: The MDC encryption mode is now always used regardless of the
1569     cipher algorithm or any preferences.  For testing --rfc2440 can be
1570     used to create a message without an MDC.
```


## (追記) 以前の解法 {#追記--以前の解法}

冒頭で、類似したケースで別な解法で回避したことに言及しましたが、メモが出てきたので当時の解法も記載します。  

```emacs-lisp
(advice-add 'epg--check-error-for-decrypt :override 'ignore)
```

あまりよろしくないハックだと思います...
