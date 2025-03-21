+++
title = "記事の Org file にリンクを貼る"
author = ["Takaaki ISHIKAWA"]
date = 2018-09-03T17:02:00+09:00
lastmod = 2018-10-09T01:11:00+09:00
tags = ["org-mode", "emacs", "hugo"]
categories = ["tech"]
draft = false
+++

せっかく [ox-hugo](https://github.com/kaushalmodi/ox-hugo) で記事を書いているので、Hugo記事のソースとなる orgfile を明示したい。  

毎度手動でそのリンクを生成するのは面倒なので、マクロで実現してみる。  

まず、マクロから呼び出す関数を書く。  

```emacs-lisp
(defun org-hugo-get-link-to-orgfile (uri alt)
      "Return a formatted link to the original Org file in GitHub."
      (let ((line (save-excursion
                    (save-restriction
                      (unless (org-at-heading-p)
                        (org-previous-visible-heading 1))
                      (line-number-at-pos)))))
        (concat "[[" uri (file-name-nondirectory (buffer-file-name))
                "#L" (format "%d" line) "][" alt "]]")))
```

で、これを、編集中の orgfile の `#+macro` で使う。こんな感じ。  

```org
#+macro: srclink (eval (org-hugo-get-link-to-orgfile "https://github.com/takaxp/blog/blame/master/entries/" "see Orgfile"))
```

第一引数を、ソースを配置するサイトのURI。ファイル名の直前までを指定する。スラッシュを忘れずに。  

第二引数に、HTML上で表示されるリンク名を指定する。  

そして、記事の執筆時に、以下を埋め込めば、対応するソース（行単位）に転送してくれるリンクがエクスポート時に勝手に埋め込まれる。  

```org
{{{srclink}}}
```

しばらくこれで運用してみる。  

[see Orgfile](https://github.com/takaxp/blog/blame/master/entries/archive.org#L532)  


## Updated (2018-09-04@00:44) {#updated--2018-09-04-00-44}

このアプローチだと不十分とわかった。同じファイルの別箇所を編集したときに、headingの行がズレるが、このマクロが含まれているすべての subtree を更新しなければそのズレを反映させられない。ｸﾏｯﾀ...  


## Updated (2018-10-09@01:05) {#updated--2018-10-09-01-05}

基本的に新しい記事は当該文書の末尾に追加される。したがって、通常の運用であれば、 `srclink` の値は変更する必要がない。新規記事の追加以外で行番号の更新がある場合は、全記事を再出力すればよい。  

しかし、 `org-hugo-auto-set-lastmod` が有効な場合は、全記事の最終更新日が更新されることになる。これを防ぐために、このオプションは `nil` にしてから、 `C-c C-e H A` を実行すればよい。  

それでも非効率な方法なので、継続改善が必要。
