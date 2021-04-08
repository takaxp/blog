+++
title = "数式の展開テスト"
author = ["Takaaki ISHIKAWA"]
date = 2018-08-21T02:05:00+09:00
tags = ["hugo"]
categories = ["tech"]
draft = false
mathjax = true
+++

## inline {#inline}

An inline equation \\(f(x)\\).


## stand alone without numbering {#stand-alone-without-numbering}

A standalone equation:
\\[ E = mc^{2} \\]


## full equation with numbering {#full-equation-with-numbering}

~~**うまくいかない** 通常のHTML出力では正しく式番号がレンダリングされる。~~

`ox-hugo` の設定では、

> <https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-AMS-MML%5FHTMLorMML>

だが、通常のHTML出力では、

> <https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js?config=TeX-AMS%5FHTML>

である。

And a full <span class="latex">L<sup>A</sup>T<sub>E</sub>X</span> equation will be displayed as

\begin{equation}
\label{eq:1}
C = W\log\_{2} (1+\mathrm{SNR})
\end{equation}

, and could be referenced by (\ref{eq:1}).

最終的に、リファレンスに示された `mathjax-config.js` を利用すればOK。

導入は、 `./static/js/mathjax-config.js` として [mathjax-config.js](https://ox-hugo.scripter.co/js/mathjax-config.js) を保存し、テーマの中で `mathjax` のスクリプトを記述している箇所に、以下を追加する。

```javascript
<!--
 https://github.com/mathjax/MathJax/issues/1988#issuecomment-384978927
 Use plain Javascript to prevent the use of window.eval(). Then
 'unsafe-eval' won't be needed to be added to script-src CSP.
 Also move the mathjax config to a separate file from the inline script so
 that 'unsafe-inline can also be removed from script-src CSP.
-->
<script src="{{ "js/mathjax-config.js" | absURL }}"></script>
```

これで式番号と `\ref` が効くようになる。

`ox-hugo` の設定は、以下（本来の値）でOKだった。

> <https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-AMS-MML%5FHTMLorMML>


## References {#references}

-   <https://github.com/kaushalmodi/hugo-bare-min-theme/blob/master/layouts/partials/mathjax.html>
-   <https://ox-hugo.scripter.co/js/mathjax-config.js>
