+++
title = "company-mode に移行する"
author = ["Takaaki ISHIKAWA"]
date = 2019-03-25T13:39:00+09:00
tags = ["emacs"]
categories = ["emacs"]
draft = false
+++

長らく愛用してきた [auto-comple](https://github.com/auto-complete/auto-complete) ですが、メンテナンスモードに入ったという知らせを受けましたので、 [company](https://company-mode.github.io/) に移行することにしました。  

最近は `el-get` でもパッケージ管理をしているので、早速以下を追加してインストールです。ヘルプ表示が非標準らしいので `company-quickhelp` も追加します。  

```emacs-lisp
(el-get-bundle "company-mode/company-mode")
(el-get-bundle "expez/company-quickhelp")
```

`auto-complete` の時に頻繁に使っていたファイルパスの補完がうまく動かなかったので調べてみると、 `company-backends` の中の `company-files` の位置が悪いようで、補完候補の第一に持ってくることで、希望の動作になりました。  

```emacs-lisp
(delq 'company-files company-backends)
(add-to-list 'company-backends 'company-files)
```

初期の設定を次のようにしました。配色は確かに `auto-complete` とかなり違いますけど、とりあえず許容範囲なので当面はそのまま使おうと思います。  

```emacs-lisp
(when (require 'company nil t)
  (define-key company-active-map (kbd "C-n") 'company-select-next)
  (define-key company-active-map (kbd "C-p") 'company-select-previous)
  (define-key company-search-map (kbd "C-n") 'company-select-next)
  (define-key company-search-map (kbd "C-p") 'company-select-previous)
  (define-key company-active-map (kbd "<tab>") 'company-complete-selection)

  (delq 'company-files company-backends)
  (add-to-list 'company-backends 'company-files)

  (global-company-mode))

(when (require 'company-quickhelp nil t)
  (company-quickhelp-mode))
```


## References {#references}

-   [company-mode for Emacs](https://company-mode.github.io/)
-   [auto-completeユーザのための company-modeの設定 - Qiita](https://qiita.com/syohex/items/8d21d7422f14e9b53b17)
-   [emacsの補完用パッケージcompany-mode - Qiita](https://qiita.com/sune2/items/b73037f9e85962f5afb7)