+++
title = "ox-hugo テスト"
author = ["Takaaki ISHIKAWA"]
date = 2018-08-20T18:23:00+09:00
lastmod = 2018-08-28T01:42:46+09:00
categories = ["hugo"]
draft = false
+++

`hugo` と `ox-hugo` を利用したブログ執筆の試験です．


## Heading1 {#heading1}


### Heading 2 {#heading-2}

コンテンツ


### Heading 3 {#heading-3}

-   [ ] a
-   [X] b


### Source blocks {#source-blocks}

-   elisp

    ```emacs-lisp
    (message "Hello! World")
    ```

-   Centered

    <style>.org-center { margin-left: auto; margin-right: auto; text-align: center; }</style>

    <div class="org-center">
      <div></div>

    Centered text

    </div>

-   cpp

    ```cpp
    #include <iostream>
    using namespace std;

    int main(){
      cout << "Hello, World!" << endl;
      return 1;
    }
    ```


#### Heading 4 {#heading-4}

\\(H(z)\\)


## 表 {#表}

<div class="table-caption">
  <span class="table-number">Table 1:</span>
  てーぶる
</div>

| 1 | 3 |
|---|---|
| 2 | 4 |


## 装飾 {#装飾}

**太字** , <span class="underline">下線</span> , _イタリック_


## リンク {#リンク}

<http://google.co.jp>， [ぐーぐる．こむ](http://google.com/)


## タスク {#タスク}


### <span class="org-todo todo TODO">TODO</span> タスク {#タスク}
