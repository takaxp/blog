+++
title = "macとwinで操作感を揃えたHHKBの設定"
author = ["Takaaki ISHIKAWA"]
date = 2025-03-16T12:03:00+09:00
tags = ["HHKB", "emacs"]
categories = ["tech"]
draft = false
+++

Emacsでの作業効率を維持しつつ、HHKBを macOSと Windowsの両方で使うための自分なりの設定です。  

私は 2022年からHHKBを使い始めた若輩者で、さすがに macOS と Windows の両方でHHKBを使うのは厳しかったので、macOS 用には [HHKB Professional HYBRID Type-S](https://happyhackingkb.com/jp/products/hybrid%5Ftypes/)を使い、Windows 用には、[ProgresTouch RETRO TINY](https://pxaka.tokyo/blog/2020/1116-progrestouch-retro-tiny/)を使ってきました。macOS用の一つ前は、純正のMagic Keyboardです。当然ながら昔も今も USキーボードです。  

それで先日、ProgresTouch RETRO TINY の `↑` キーがお亡くなりになってしまい、これはとうとう HHKB を macOS/Windows で透過的に使う段階に入ったか、と腹を括り、macOS/Windowsのどちらでも同じ操作感で使えるように設定を見直してみました。  

納得のいく設定が一度決まればなんのことはない、とても快適です。幸か不幸か、机の上にキーボードが2つ並ぶ生活からおさらばできました。ただ、マウスはまだ2つある...  


## DIPスイッチ {#dipスイッチ}

次のように設定します。  `◇` は、Macではコマンドキーで、WindowsではWindowsキーに対応します。  

| Switch | Status | Note                        |
|--------|--------|-----------------------------|
| SW 3   | ON     | `delete` 押下で `BackSpace` 入力 |
| SW 4   | ON     | `左◇` を `Fn` に置換する    |
| SW 5   | ON     | `Opt/Alt` と `◇` を交換する |
| SW 6   | ON     | Power Saving しない         |

-   SW 3 は、macOSだと無効とされるが、もともと `BS` 入力になっている。
-   SW 4 の有効化でキーボードの左下に `Fn` が来るので、左手のみで `F1` などを押下可能になる  
    -   矢印(上下左右)は `右Fn` を使い、スピーカのボリューム変更などは、 `左Fn` を使う。それぞれ左手と右手で操作が完結する
-   SW 5 で `Opt/Alt` と `◇` を交換することで、  
    -   Windowsモードにて、スペースキーの左横キー押下が `Windows` キー押下ではなく、 `Alt` キー押下になる
    -   macOSモードにて、スペースキーの左横キー押下が `Alt` 押下になる（ただし、次の macOSモードのキーマップ設定で、コマンドキーに戻します）
-   SW 6 は、スリープの無効化。HHKBに休みは不要。


## キーマップ変更 {#キーマップ変更}

HHKBをUSBケーブルで接続し、 `Fn+Ctrl+0` 押下後に専用ツールを使うことでキーマップを変更できます。なお、 `Fn+Ctrl+0` 押下は、同時押しではなく、 `Fn`, `Ctrl`, `0` を順番に押し続けることで正しく効力を持ちます。同時押しだと効かないと思ってOKです。  

Mac を使う時には下記のmacOSモードを、Windowsを使う時には下記のWindowsモードを適用して使います。各設定は、モードごとに本体内に記録されます。  

1.  Mac で HHKB を使う時  
    -   `Fn+Ctrl+1` で Mac に無線接続
    -   `Fn+Ctrl+m` で macOS モードに切り替え
2.  Windows で HHKBを使う時  
    -   `Fn+Ctrl+2` で WindowsPC に無線接続
    -   `Fn+Ctrl+w` で Windows モードに切り替え

なお、 `Fn+Ctrl+1` と `Fn+Ctrl+2` は、あくまで私のBluetooth設定です。 `Fn+Ctrl+m` と  `Fn+Ctrl+w` は規定済みです。  


### macOSモード {#macosモード}

SW 1(OFF), SW 2(ON) の状態で、USBケーブルを接続して HHKBの電源を入れます。  

キーマップ変更を使って、Mac用にカスタマイズします。  

1.  `Opt/Alt(R)` と `右◇` を交換する
2.  `Opt/Alt` を、 `右◇` に置換する
3.  `Esc` と `` `/~ `` を交換する
4.  `POW` (Fn+Esc)を `Esc` に置換する

{{< x user="takaxp" id="1901112826355155014" >}}  

以上の4つの変更で、次のような状態になります。  

-   キーボード右下に `Opt/Alt(R)` が配置される
-   スペースキーの左右に、コマンドキーが配置される。
-   `1` の左側が、 `` `/~ `` キーになる。
-   `|/\` キーの右側が、 `Esc` キーになる。
-   `Esc` の入力は、 ``Fn+(交換後の)`/~`` 押下、又は、右上の(交換後の) `Esc` 押下

さらに、Emacs の設定で次をすることで、 `M-x` を自然に押せるようになります(左親指でコマンドキー、左人差し指でxキー押下)。  

```emacs-lisp
(when (boundp 'ns-command-modifier) (setq ns-command-modifier 'meta)) ;; M-x
(when (boundp 'ns-alternate-modifier) (setq ns-alternate-modifier 'super))
```

`注意`: SW 4(ON)の影響で、 `左◇` が存在しない状態です。したがって、スペースキーの左に位置するコマンドキーは、 `左◇` ではなく `右◇` になります。  


### Windowsモード {#windowsモード}

SW 1(ON), SW 2(OFF) の状態で、USBケーブルを接続して HHKBの電源を入れます。  

キーマップ変更を使って、Windwos用にカスタマイズします。  

1.  `Esc` と `` `/~ `` を交換する

Windowsモードでは、上記の設定だけで十分です。  

{{< x user="takaxp" id="1901112718737948926" >}}  

SW 5(ON)の効果で、スペースキー左側が `Alt` キーになっているので、意図せず `Windows` キーが押下されることもなく、M-xできます。 `Windows` キー押下は、キーボード右下に位置する `右◇` キー押下で実現できるので、なんら問題ないです。  

なお、IMEの切り替えは、基本的に `Shift+Space` です。 `Ctrl+Space` は使いません。Emacsの `set-mark-command` と衝突するからです。  


## reference {#reference}

-   [HHKB博士に聞く！購入前に知っておきたいHHKB活用術～DIPスイッチ編～ | PFU](https://happyhackingkb.com/jp/life/hhkb%5Flife25.html)
-   [HHKB博士に聞く！購入前に知っておきたいHHKB活用術～キーマップ変更ツール編～| PFU](https://happyhackingkb.com/jp/life/hhkb%5Flife26.html)
-   [HHKBでWin/Macそれぞれのモードにキーマップを設定し保存する #Windows - Qiita](https://qiita.com/amidoazuki/items/60173c7b08c8686bcbb9)
