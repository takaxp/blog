+++
title = "defadvice から advice-add に移行"
author = ["Takaaki ISHIKAWA"]
date = 2025-02-28T22:15:00+09:00
tags = ["emacs"]
categories = ["emacs"]
draft = false
+++

Emacs 30.1 になり、defadvice がとうとう obsolete になりました。  

私が advice を頻繁に使うようになった頃にはすでに advice-add を使うように推奨されていたため、自分の設定に残る defadvice は一つだけで、今回それを書き換えました。  

defadviceからadvice-addへの基本的な書き換え方法は、公式に[事例が紹介](https://www.gnu.org/software/emacs/manual/html%5Fnode/elisp/Porting-Old-Advice.html)されているので参考になります。  

書き換え対象になったのは、 `load` と `require` に適用していた defadvice です。パッケージの読み込みに要する時間を計測する機能を advice で追加しています。これまでは、 `load` と `require` をそれぞれ advice していましたが、内容がほぼ同じなので、一つに統合しました。  

ちょっとハマったのは、 adviceを `around` 指定する場合に、元の関数の戻り値をしっかり外に出してあげる必要があるところで、下記のコードでは最後に result を入れているのはそのためです。これがないと、result 以外の最後に評価された内容が戻り値として使われるので意図しない振る舞いになります。  

```emacs-lisp
(defvar my-minimum-time-to-print 0.5)
(defun my--print-loading-time (f &rest args)
  "https://memo.sugyan.com/entry/20120105/1325756767"
  (let* ((before (current-time))
         (result (apply f args))
         (after (current-time))
         (file-or-feature (car args))
         (time (+ (* (- (nth 1 after) (nth 1 before)) 1000.0)
                  (/ (- (nth 2 after) (nth 2 before)) 1000.0))))
    (unless (or (memq file-or-feature '(cl-lib macroexp))
                (> my-minimum-time-to-print time))
      (message "--- %04d [ms]: %s%s" time
               (if (equal (subr-name f) "load") "(loading) " "")
               file-or-feature))
    result))
(advice-add 'load :around #'my--print-loading-time)
(advice-add 'require :around #'my--print-loading-time)
;; (advice-remove 'load #'my-print-loading-time)
;; (advice-remove 'require #'my-print-loading-time)
```

この advice を有効にすると、計測結果が `*Messages*` バッファに表示されます。  

```sh
--- 0034 [ms]: (loading) /Users/taka/Dropbox/emacs.d/.session
--- 0000 [ms]: (loading) /Users/taka/.emacs.d/lisp/night-theme
--- 0004 [ms]: (loading) holiday-loaddefs
--- 0051 [ms]: transient
--- 0003 [ms]: dash
--- 0268 [ms]: use-package
```


## previous code {#previous-code}

```emacs-lisp
;; advice of load function
(defadvice load (around load-benchmark activate)
  (let* ((before (current-time))
         (result ad-do-it)
         (after  (current-time))
         (time (+ (* (- (nth 1 after) (nth 1 before)) 1000.0)
                  (/ (- (nth 2 after) (nth 2 before)) 1000.0)))
         (arg (ad-get-arg 0)))
    (message "--- %04d [ms]: (loading) %s" time arg)))

;; advice of require function
(defadvice require (around require-benchmark activate)
  "http://memo.sugyan.com/entry/20120105/1325756767"
  (let* ((before (current-time))
         (result ad-do-it)
         (after  (current-time))
         (time (+ (* (- (nth 1 after) (nth 1 before)) 1000.0)
                  (/ (- (nth 2 after) (nth 2 before)) 1000.0)))
         (arg (ad-get-arg 0)))
    (unless (or (memq arg '(cl-lib macroexp))
                (> 0.1 time))
      (message "--- %04d [ms]: %s" time arg))))
```
