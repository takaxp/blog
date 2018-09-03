+++
title = "記事の Org file にリンクを貼る"
author = ["Takaaki ISHIKAWA"]
lastmod = 2018-09-03T17:01:44+09:00
categories = ["hugo"]
draft = true
+++

せっかく [ox-hugo](https://github.com/kaushalmodi/ox-hugo) で記事を書いているので，Hugo記事のソースとなる orgfile を明示したい．

毎度手動でそのリンクを生成するのは面倒なので，マクロで実現してみる．

まず，マクロから呼び出す関数を書く．

```emacs-lisp
(defun org-hugo-get-link-to-orgfile (uri alt)
      "Return a formatted link to the original Org file."
      (let ((line (save-excursion
                    (save-restriction
                      (org-previous-visible-heading 1)
                      (line-number-at-pos)))))
        (concat "[[" uri (file-name-nondirectory (buffer-file-name))
                "#L" (format "%d" line) "][" alt "]]")))
```

で，これを，編集中の orgfile の `#+macro` で使う．こんな感じ．

```org
#+macro: srclink (eval (org-hugo-get-link-to-orgfile "https://github.com/takaxp/blog/blame/master/entries/" "see Orgfile"))
```

第一引数を，ソースを配置するサイトのURI．ファイル名の直前までを指定する．スラッシュを忘れずに．

第二引数に，HTML上で表示されるリンク名を指定する．

そして，記事の執筆時に，以下を埋め込めば，対応するソース（行単位）に転送してくれるリンクがエクスポート時に勝手に埋め込まれる．

```org
{{{srclink}}}
```

しばらくこれで運用してみる．

[see Orgfile](https://github.com/takaxp/blog/blame/master/entries/default.org#L476)
