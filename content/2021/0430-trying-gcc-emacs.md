+++
title = "GCC Emacs を試す"
author = ["Takaaki ISHIKAWA"]
date = 2021-04-30T12:15:00+09:00
tags = ["emacs"]
categories = ["emacs"]
draft = false
+++

ここ数日、界隈を賑わせている GCC Emacs を試してみました。28系のコードで特定のオプションを付けてビルドすると、 `el` を `elc` にする従来のバイトコンパイルに加えて、 `eln` に変換するネイティブコンパイルを使えるようになります。GCC Emacsと呼ばれています。

普段からビルド環境を整えている私としては、 `brew install libgccjit` してからシンプルに `--with-native-compilation` を付けて master branch をビルドするだけで使えるようになりました。ただ、いつもの `init.el` を読み込んで、普段どおりに使えるようにするには苦労しました。というかまだ使えない状況です。最大の障害は `obsolete` 周りのマクロの引数が 28系になって変更されていることなのですが、これは今回の話と直接は関係ないので、下の方に対処方法をまとめておきます。

で、高速起動厨としてはやはり起動時間がどうなるのかが気になるところなので、計測してみました。

<div class="table-caption">
  <span class="table-number">Table 1</span>:
  起動時間の比較[ms]
</div>

| CLI  | 27.2 | 28.0(G) | 28.0 |   | GUI  | 27.2  | 28.0(G) | 28.0  |
|------|------|---------|------|---|------|-------|---------|-------|
| 1    | 36   | 32      | 20   |   | 1    | 225   | 225     | 225   |
| 2    | 27   | 36      | 19   |   | 2    | 218   | 234     | 217   |
| 3    | 27   | 33      | 17   |   | 3    | 221   | 221     | 215   |
| 4    | 28   | 33      | 17   |   | 4    | 222   | 226     | 215   |
| 5    | 27   | 31      | 18   |   | 5    | 219   | 228     | 221   |
| avg. | 29.0 | 33.0    | 18.2 |   | avg. | 221.0 | 226.8   | 218.6 |

はい。最新の安定版(27.2)との比較では、ターミナルでの起動が約4[ms]の減速、GUIでの起動が約5.8[ms]の減速です。28.0(G)がGCC Emacsです。

また、ネイティブコンパイルをしない場合(28.0)との比較では、ターミナルでの起動が約15[ms]の減速、GUIでの起動が約8.2[ms]の減速、という結果になりました。

ということで現在のところ、ネイティブコンパイルは起動時間の高速化には寄与しないことがわかりました。今後に期待です！


## obsolete系関数を元に戻す {#obsolete系関数を元に戻す}

とにかく28系を動かしたいけど、なんかうまく行かない、という場合は、次のように `define-obsolete-variable-alias` と `define-obsolete-function-alias` を 27系のものに戻すと先に進めるようになります。

正しくは読み込まれるパッケージ側で、28系で規定されている新しいマクロに書き換える必要があるのですが、正式リリースされていない28系に合わせてくださいというのも現時点では無茶なお話です。

```emacs-lisp
(when (version< "28.0" emacs-version)
  (defmacro define-obsolete-variable-alias (obsolete-name current-name
                                                          &optional when docstring)
    "Make OBSOLETE-NAME a variable alias for CURRENT-NAME and mark it obsolete.
This uses `defvaralias' and `make-obsolete-variable' (which see).
See the Info node `(elisp)Variable Aliases' for more details.

If CURRENT-NAME is a defcustom or a defvar (more generally, any variable
where OBSOLETE-NAME may be set, e.g. in an init file, before the
alias is defined), then the define-obsolete-variable-alias
statement should be evaluated before the defcustom, if user
customizations are to be respected.  The simplest way to achieve
this is to place the alias statement before the defcustom (this
is not necessary for aliases that are autoloaded, or in files
dumped with Emacs).  This is so that any user customizations are
applied before the defcustom tries to initialize the
variable (this is due to the way `defvaralias' works).

WHEN should be a string indicating when the variable was first
made obsolete, for example a date or a release number.

For the benefit of Customize, if OBSOLETE-NAME has
any of the following properties, they are copied to
CURRENT-NAME, if it does not already have them:
`saved-value', `saved-variable-comment'."
    (declare (doc-string 4)
             (advertised-calling-convention
              ;; New code should always provide the `when' argument.
              (obsolete-name current-name when &optional docstring) "23.1"))
    `(progn
       (defvaralias ,obsolete-name ,current-name ,docstring)
       ;; See Bug#4706.
       (dolist (prop '(saved-value saved-variable-comment))
         (and (get ,obsolete-name prop)
              (null (get ,current-name prop))
              (put ,current-name prop (get ,obsolete-name prop))))
       (make-obsolete-variable ,obsolete-name ,current-name ,when)))

  (defmacro define-obsolete-function-alias (obsolete-name current-name
                                                          &optional when docstring)
    "Set OBSOLETE-NAME's function definition to CURRENT-NAME and mark it obsolete.

\(define-obsolete-function-alias \\='old-fun \\='new-fun \"22.1\" \"old-fun's doc.\")

is equivalent to the following two lines of code:

\(defalias \\='old-fun \\='new-fun \"old-fun's doc.\")
\(make-obsolete \\='old-fun \\='new-fun \"22.1\")

WHEN should be a string indicating when the function was first
made obsolete, for example a date or a release number.

See the docstrings of `defalias' and `make-obsolete' for more details."
    (declare (doc-string 4)
             (advertised-calling-convention
              ;; New code should always provide the `when' argument.
              (obsolete-name current-name when &optional docstring) "23.1"))
    `(progn
       (defalias ,obsolete-name ,current-name ,docstring)
       (make-obsolete ,obsolete-name ,current-name ,when))))
```


## References {#references}

-   [ネイティブコンパイルEmacsの登場](https://blog.tomoya.dev/posts/hello-native-comp-emacs/)
-   [Emacsに来たnative compileを試す](https://www.grugrut.net/posts/202104262248/)
