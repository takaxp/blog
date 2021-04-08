+++
title = "orgのテーブルをexcelコピペ用に変換する"
author = ["Takaaki ISHIKAWA"]
date = 2021-04-05T21:27:00+09:00
tags = ["emacs", "orgmode"]
categories = ["emacs"]
draft = false
+++

標準関数の `org-table-export` を使うと、カーソル位置のテーブルをファイルに出力できます。プロパティの `TABLE_EXPORT_FILE` を設定してればファイル名を指定する必要はなく、また出力形式は、同じくプロパティの `TABLE_EXPORT_FORMAT` で指定する形式か、 `org-table-export-default-format` で指定した値が使われます。

この関数は確かに便利なのですが、使っているとファイル出力というよりもコピペ用に変換したい、とか、変換した結果でバッファを書き換えたい、というシーンも多いことに気づきました。ということで書いてみました。基本的に `org-table-export` の一部を切り出してきた形になります。

まず `my-org-table-copy-as` は、カーソル位置のテーブルはそのままの表示で、変換したテーブルをクリップボードに流し込みます。エクセルに持っていきペーストするのがユースケースです。

次に `my-org-table-convert-to` は、カーソル位置のテーブルをその位置で変換してバッファ上で書き換えます。ついでに `my-org-table-copy-as` と同様にクリップボードに流し込んでいます。

```emacs-lisp
(defun my-org-table-copy-as (&optional format)
  "Copy converted table."
  (interactive)
  (let ((format (or format
                    (org-entry-get (point) "TABLE_EXPORT_FORMAT" t)
                    org-table-export-default-format)))
    (if (string-match "\\([^ \t\r\n]+\\)\\( +.*\\)?" format)
        (let ((transform (intern (match-string 1 format)))
              (params (and (match-end 2)
                           (read (concat "(" (match-string 2 format) ")"))))
              (table (org-table-to-lisp)))
          (if (not (org-at-table-p))
              (user-error "The cursor is not at a table")
            (with-temp-buffer
              (insert (funcall transform table params) "\n")
              (clipboard-kill-ring-save (point-min) (point-max)))))
      (user-error "TABLE_EXPORT_FORMAT invalid"))))

(defun my-org-table-convert-to (&optional format)
  "Convert a table to FORMAT.
If FORMAT is nil, it is set equal to a property value specified
by \"TABLE_EXPORT_FORMAT\" or `org-table-export-default-format'.
Converted table is copied to kill ring for further use.
The core part is extracted from `org-table-export'."
  (interactive)
  (let ((format (or format
                    (org-entry-get (point) "TABLE_EXPORT_FORMAT" t)
                    org-table-export-default-format)))
    (if (string-match "\\([^ \t\r\n]+\\)\\( +.*\\)?" format)
        (let ((transform (intern (match-string 1 format)))
              (params (and (match-end 2)
                           (read (concat "(" (match-string 2 format) ")"))))
              (table (org-table-to-lisp)))
          (if (not (org-at-table-p))
              (user-error "The cursor is not at a table")
            (kill-region (org-table-begin) (org-table-end))
            (let ((begin (point)))
              (insert (funcall transform table params))
              (clipboard-kill-ring-save begin (point))
              (insert "\n"))))
      (user-error "TABLE_EXPORT_FORMAT invalid"))))
```

テーブルがある場所で `M-x my-org-table-copy-as` 或いは `M-x my-org-table-convert-to` すると、プロパティ `TABLE_EXPORT_FORMAT` に設定された出力形式に変換されます。プロパティが未設定の場合は、 `org-table-export-default-format` の値を使います。このあたりは `org-table-export` の挙動と同じです。なお `org-table-export-default-format` のデフォルト値は `orgtbl-to-tsv` なので、普段からカンマ区切りに変えたい場合は、 `orgtbl-to-csv` に設定しておきます。
