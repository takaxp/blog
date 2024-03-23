+++
title = "複数のブリットを一括操作する"
author = ["Takaaki ISHIKAWA"]
date = 2021-02-20T13:23:00+09:00
lastmod = 2021-03-14T02:35:00+09:00
tags = ["org-mode"]
categories = ["emacs"]
draft = false
+++

`org-mode` のブリッツは非常に便利です。ちょっとしたリストを作成したり、手順を記したり、様々な用途に使えます。また、ブリッツにチェックボックスを加えれば、タスクの実施済みと未実施を簡単に区別できます。  

さて、私が `org-mode` を使ってメモや情報を集めるときには、基本的に箇条書きで記しています。ブリッツはレベルを簡単に変更（ `M-<right>/<left>` ）でき、入れ子にできるので、思考の構造化にピッタリです。  

そのようなフローですと、とりあえず5つくらいのブリッツを生成したあとで「これらはチェックリストだな」とか「いや順番が重要だから、ハイフンのブリッツじゃなくて、数値のブリッツに変更したいな」と考えるようになります。ブリッツの種類を一括で変更する機能（ `Shift-<right>/<left>` ）はデフォルトで実装されていますが、チェックボックスを一括で加えたり削除する機能は ~~がありません~~ `C-u M-x org-toggle-checkbox (C-u C-c C-x C-b)` と長いので、自分用に実装してみました。  

{{< tweet user="takaxp" id="1361706272991584260" >}}  

以下のコマンドは、処理したい領域を選択してから、 `M-x` で呼び出しても良いですし、 `seleted.el` と組み合わせて、設定した任意のシングルキー押下でもOKです。便利！  

-   後からチェックボックス化
-   後からリスト化
-   チェックボックス付きリストの操作
-   `selected.el` でシングルキー実行


## 後からチェックボックス化 {#後からチェックボックス化}

`M-x my-org-list-insert-checkbox-into-items` でリストにチェックボックスを追加、 `M-x my-org-list-delete-checkbox-from-items` でチェックボックスを削除。  

```emacs-lisp
;;;###autoload
(defun my-org-list-insert-checkbox-into-items (begin end)
  (interactive "r")
  (when mark-active
    (let* ((checkbox "[ ] ")
           (len (string-width checkbox)))
      (goto-char begin)
      (while (re-search-forward
              (concat "\\(^[ \t]*[-\\+\\*][ \t]+\\|"
                      "^[ \t]*[0-9]*[\\.)][ \t]+\\)") end t)
        (replace-match (concat "\\1" checkbox) nil nil)
        (setq end (+ end len)))
      (goto-char begin))))

;;;###autoload
(defun my-org-list-delete-checkbox-from-items (begin end)
  (interactive "r")
  (when mark-active
    (let ((len (string-width "[ ] ")))
      (goto-char begin)
      (while (re-search-forward
              (concat "\\(^[ \t]*[-\\+\\*][ \t]\\|^[ \t]*[0-9]*[\\.)][ \t]\\)"
                      "\\[.\\][ \t]+")
              end t)
        (replace-match "\\1" nil nil)
        (setq end (- end len)))
      (goto-char begin))))
```

ところが、記事を公開してから [@ak10i](https://twitter.com/ak10i) さんに「それあるよ」と教えていただきました。コマンドとしては `C-u M-x org-toggle-checkbox (C-u C-c C-x C-b)` になります。上に実装したコマンドのトグル版ですね。ただ、選択した時にどの行をトグル対象にするのか（デフォルト関数の方が広く取られる）と、コマンド実行後にカーソルが元の位置に戻らない（上の実装では戻る）のが、私の実装と異なります。  

> {{< tweet user="takaxp" id="1362989690593239042" >}}  

入力するにはちょっと長いので、次のようにすると、短縮して使えるようになります。新しい関数を `selected.el` に噛ませば、シングルキーでトグルできます。  

```emacs-lisp
(defun my-org-toggle-checkbox ()
  (interactive)
  (let ((current-prefix-arg '(4)))
    (call-interactively 'org-toggle-checkbox)))
(org-defkey org-mode-map (kbd "<f3>") #'my-org-toggle-checkbox)
```

トグルになっているので、こっちの方が便利ですね...  

ということで、トグル版も作りました。  

```emacs-lisp
(defvar my-org-list-with-checkbox-regexp
  (concat "\\(^[ \t]*[-\\+\\*][ \t]\\|^[ \t]*[0-9]*[\\.)][ \t]\\)"
          "\\[.\\][ \t]+"))

;;;###autoload
(defun my-org-list-toggle-checkbox (begin end)
  (interactive "r")
  (when mark-active
    (goto-char begin)
    (if (re-search-forward
         my-org-list-with-checkbox-regexp (point-at-eol) t)
        (my-org-list-delete-checkbox-from-items begin end)
      (my-org-list-insert-checkbox-into-items begin end))))
```


## 後からリスト化 {#後からリスト化}

選択領域を後からリスト化することもできます。 `M-x my-org-list-insert-items` で行頭に `" - "` を追加、 `M-x my-org-list-delete-items` で削除。  

また、文章を書き始めて、その当該行をすぐにブリッツ化したいときには、 `M-x my-cycle-bullet-at-heading` を実行すると、カーソル位置を保持したまま、行頭にブリッツを挿入できます。領域選択は不要です。同じ行でもう一度実行すると、チェックボックスに変更できます。  

<span class="timestamp-wrapper"><span class="timestamp">[2021-03-14 Sun] </span></span> `my-org-list-delete-items` と `my-cycle-bullet-at-heading` をハイフン以外のブリッツに対応させました。  

```emacs-lisp
;;;###autoload
(defun my-org-list-insert-items (begin end)
  (interactive "r")
  (when mark-active
    (let* ((bullet " - ")
           (len (string-width bullet)))
      (goto-char begin)
      (while (and (re-search-forward (concat "\\(^[ \t]*\\)") end t)
                  (not (equal (point) end)))
        (replace-match (concat "\\1" bullet) nil nil)
        (setq end (+ end len)))
      (goto-char begin))))

;;;###autoload
(defun my-org-list-delete-items (begin end)
  (interactive "r")
  (when mark-active
    (goto-char begin)
    (while (re-search-forward
            "^[ \t]*\\([-\\+\\*][ \t]\\|[a-z0-9A-Z]*[\\.)][ \t]\\)"
            end t)
      (let ((len (- (match-end 0) (match-beginning 0))))
        (replace-match "" nil nil)
        (setq end (- end len))))
    (goto-char begin)))

;;;###autoload
(defun my-cycle-bullet-at-heading (arg)
  "Add a bullet of \" - \" if the line is NOT a bullet line."
  (interactive "P")
  (save-excursion
    (beginning-of-line)
    (let ((bullet "- ")
          (point-at-eol (point-at-eol)))
      (cond
       ((re-search-forward
         my-org-list-with-checkbox-regexp point-at-eol t)
        (replace-match (if arg "" "\\1") nil nil))
       ((re-search-forward
         "\\(^[ \t]*[-\\+\\*][ \t]\\|^[ \t]*[a-z0-9A-Z]*[\\.)][ \t]\\)"
         point-at-eol t)
        (replace-match (if arg "" (concat "\\1[ ] ")) nil nil))
       ((re-search-forward
         (concat "\\(^[ \t]*\\)") point-at-eol t)
        (replace-match (concat "\\1 " bullet) nil nil))
       (t nil)))))

(global-set-key (kbd "C-M--") 'my-cycle-bullet-at-heading)
```


## チェックボックス付きリストの操作 {#チェックボックス付きリストの操作}

`M-x my-org-list-insert-itms-with-checkbox` でチェックボックス付きリスト化、 `M-x my-org-list-delete-items-with-checkbox` でチェックボックスごとブリッツを削除できます。  

<span class="timestamp-wrapper"><span class="timestamp">[2021-03-14 Sun] </span></span> `my-org-list-delete-items-with-checkbox` をハイフン以外のブリッツに対応させました。  

```emacs-lisp
;;;###autoload
(defun my-org-list-insert-items-with-checkbox (begin end)
  (interactive "r")
  (when mark-active
    (let* ((bullet " - ")
           (checkbox "[ ] ")
           (blen (string-width bullet))
           (clen (string-width checkbox)))
      (goto-char begin)
      (while (and (re-search-forward (concat "\\(^[ \t]*\\)") end t)
                  (not (equal (point) end)))
        (replace-match (concat "\\1" bullet checkbox) nil nil)
        (setq end (+ end blen clen)))
      (goto-char begin))))

;;;###autoload
(defun my-org-list-delete-items-with-checkbox (begin end)
  (interactive "r")
  (when mark-active
    (goto-char begin)
    (while (re-search-forward
            (concat "\\(^[ \t]*[-\\+\\*][ \t]\\|^[ \t]*[0-9]*[\\.)][ \t]\\)"
                    "\\[.\\][ \t]+") end t)
      (let ((len (- (match-end 0) (match-beginning 0))))
        (replace-match "" nil nil)
        (setq end (- end len))))
    (goto-char begin)))
```


## selected.el でシングルキー実行 {#selected-dot-el-でシングルキー実行}

[selected.el](https://github.com/Kungsgeten/selected.el) と組み合わせると、選択領域に対してシングルキー押下で一括したチェックボックス化などが実行できて、さらに便利になります。以下の例では、選択して `"-"` 押下と、 選択して `"_"` にコマンドを割り当てています。  

使い方の詳細は [selected.el で「選択して右クリック」的な概念を](https://qiita.com/takaxp/items/00245794d46c3a5fcaa8) にまとめてあります。参照ください。  

```emacs-lisp
(when (require 'selected nil t)
  (define-key selected-keymap (kbd "-") #'my-org-list-insert-items)
  (define-key selected-keymap (kbd "_")
    #'my-org-list-insert-checkbox-into-items)
  ;; (define-key selected-keymap (kbd "_") #'my-org-toggle-checkbox)
  (selected-global-mode 1))
```


## References {#references}

-   [1.24 リージョン内のブリッツを操作する(orgmode)](https://takaxp.github.io/utility.html#orga706f503)
-   [1.25 TODO " - "と" - [ ] "をサイクルさせる](https://takaxp.github.io/utility.html#orgc99664d5)
-   [5.44 [selected.el] リージョン選択時のアクションを制御](https://takaxp.github.io/init.html#orgbc8501cf)