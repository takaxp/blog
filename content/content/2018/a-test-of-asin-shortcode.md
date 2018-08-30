+++
title = "アマゾンアフィリエイトコードの展開テスト"
author = ["Takaaki ISHIKAWA"]
date = 2018-08-23T00:37:00+09:00
lastmod = 2018-08-28T01:42:47+09:00
categories = ["hugo"]
draft = false
+++

[HUGO shortcodes](https://gohugo.io/templates/shortcode-templates/)を使って，Amazonアフィリエイトのリンクを組み込みます．

{{< asin B01N3PBDGJ >}}

動かすのはちょっと大変．以下は，今回のために作った shortcodes で，これ加えて，[Product Advertising API ](https://affiliate.amazon.co.jp/assoc%5Fcredentials/home)を用いたXMLデータのダウンロードスクリプト，XMLからJSON形式のデータを作り， `./data/asin/B01N3PBDGJ.json` として保存しておく必要があります．

```html
{{- $asin := .Get 0 -}}
{{- $json := index .Site.Data.asin $asin -}}
{{- $item := $json.ItemLookupResponse.Items.Item -}}
{{- $title := $item.ItemAttributes.Title -}}
{{- $price := $item.ItemAttributes.ListPrice -}}
{{- $image := $item.SmallImage -}}
<div class="asin-box">
  <div class="asin-title">
    <a href="{{ $item.DetailPageURL.value }}" target="_blank">
      製品名: {{ $title.value }}
    </a><br/>
    価格: {{ $price.Amount.value }} {{ $price.CurrencyCode.value }}<br/>
    ASIN: {{ $asin }}
  </div>
  <div class="asin-image">
    <a href="{{ $item.DetailPageURL.value }}" target="_blank">
      <img src="{{ $image.URL.value }}" alt="{{ $title.value }}" width="{{ $image.Width.value }}" height="{{ $image.Height.value }}"/>
    </a>
  </div>
  <div class="asin-metadata"></div>
</div>
```

書籍だとこんな感じ．

{{< asin 4799106023 >}}

{{< asin 4883998304 >}}


## References {#references}

-   [Using curl with the Amazon Product Request API](https://frdmtoplay.com/using-curl-with-the-amazon-product-request-api/)
-   [Signed Requests Helper - Amazon Product Advertising API](http://associates-amazon.s3.amazonaws.com/signed-requests/helper/index.html)
-   [HMAC-SHA256 Signatures for REST Requests - Product Advertising API](https://docs.aws.amazon.com/AWSECommerceService/latest/DG/HMACSignatures.html)
-   [Example REST Requests - Product Advertising API](https://docs.aws.amazon.com/AWSECommerceService/latest/DG/rest-signature.html)
