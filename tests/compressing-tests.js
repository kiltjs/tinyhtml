/* global describe, it */

var tinyHTML = require('../lib/tinyhtml'),
    assert = require('assert');

var snippetWikipedia = {
  html: `
  <body class="mediawiki ltr sitedir-ltr mw-hide-empty-elt ns-4 ns-subject page-Wikipedia_Portada rootpage-Wikipedia_Portada skin-vector action-view">    <div id="mw-page-base" class="noprint"></div>
      <div id="mw-head-base" class="noprint"></div>
      <div id="content" class="mw-body" role="main">
        <a id="top"></a>

                <div id="siteNotice" class="mw-body-content"><!-- CentralNotice --></div>
              <div class="mw-indicators mw-body-content">
  </div>
        <h1 id="firstHeading" class="firstHeading" lang="es">Wikipedia:Portada</h1>
                    <div id="bodyContent" class="mw-body-content">
                    <div id="siteSub">De Wikipedia, la enciclopedia libre</div>
                  <div id="contentSub"></div>
                          <div id="jump-to-nav" class="mw-jump">
            Saltar a:          <a href="#mw-head">navegación</a>,           <a href="#p-search">búsqueda</a>
          </div>
          <!-- Another Comment -->
          <div id="mw-content-text" lang="es" dir="ltr" class="mw-content-ltr"><table style="margin:4px 0 0 0; width:100%; background:none">
  <tr>
  <td class="MainPageBG" style="width:100%; border:1px solid #C7D0F8; background:#F2F5FD; vertical-align:top; color:#000; -moz-border-radius:4px; -webkit-border-radius: 4px; border-radius: 4px;">
  `,
  result: `<body class="mediawiki ltr sitedir-ltr mw-hide-empty-elt ns-4 ns-subject page-Wikipedia_Portada rootpage-Wikipedia_Portada skin-vector action-view"><div id="mw-page-base" class="noprint"></div><div id="mw-head-base" class="noprint"></div><div id="content" class="mw-body" role="main"><a id="top"></a><div id="siteNotice" class="mw-body-content"><!-- CentralNotice --></div><div class="mw-indicators mw-body-content"></div><h1 id="firstHeading" class="firstHeading" lang="es">Wikipedia:Portada</h1><div id="bodyContent" class="mw-body-content"><div id="siteSub">De Wikipedia, la enciclopedia libre</div><div id="contentSub"></div><div id="jump-to-nav" class="mw-jump">Saltar a:          <a href="#mw-head">navegación</a>,           <a href="#p-search">búsqueda</a></div><!-- Another Comment --><div id="mw-content-text" lang="es" dir="ltr" class="mw-content-ltr"><table style="margin:4px 0 0 0;width:100%;background:none"><tr><td class="MainPageBG" style="width:100%;border:1px solid #C7D0F8;background:#F2F5FD;vertical-align:top;color:#000;-moz-border-radius:4px;-webkit-border-radius:4px;border-radius:4px;">`,
  result_no_comments: `<body class="mediawiki ltr sitedir-ltr mw-hide-empty-elt ns-4 ns-subject page-Wikipedia_Portada rootpage-Wikipedia_Portada skin-vector action-view"><div id="mw-page-base" class="noprint"></div><div id="mw-head-base" class="noprint"></div><div id="content" class="mw-body" role="main"><a id="top"></a><div id="siteNotice" class="mw-body-content"></div><div class="mw-indicators mw-body-content"></div><h1 id="firstHeading" class="firstHeading" lang="es">Wikipedia:Portada</h1><div id="bodyContent" class="mw-body-content"><div id="siteSub">De Wikipedia, la enciclopedia libre</div><div id="contentSub"></div><div id="jump-to-nav" class="mw-jump">Saltar a:          <a href="#mw-head">navegación</a>,           <a href="#p-search">búsqueda</a></div><div id="mw-content-text" lang="es" dir="ltr" class="mw-content-ltr"><table style="margin:4px 0 0 0;width:100%;background:none"><tr><td class="MainPageBG" style="width:100%;border:1px solid #C7D0F8;background:#F2F5FD;vertical-align:top;color:#000;-moz-border-radius:4px;-webkit-border-radius:4px;border-radius:4px;">`
};

describe('compact html', function () {

  it('compress Wikipedia with comments', function () {

    assert.strictEqual( tinyHTML(snippetWikipedia.html, { ignore_unclosed: true, remove_comments: false }), snippetWikipedia.result, 'remove_comments: false');

  });

  it('compress Wikipedia no_comments', function () {

    // assert.strictEqual( tinyHTML(snippetWikipedia.html), snippetWikipedia.result );
    assert.strictEqual( tinyHTML(snippetWikipedia.html, { ignore_unclosed: true }), snippetWikipedia.result_no_comments, 'remove_comments: undefined');
    assert.strictEqual( tinyHTML(snippetWikipedia.html, { ignore_unclosed: true, remove_comments: true }), snippetWikipedia.result_no_comments, 'remove_comments: true');

  });

});

describe('compress attributes', function () {

  it('trim', function () {

    assert.strictEqual( tinyHTML(`<div ng-class=" {
      foo: 'bar',
      list: [1,2,3,4,5,6,7]
    }"> hola caracola`, { ignore_unclosed: true }), `<div ng-class="{foo: 'bar',list: [1,2,3,4,5,6,7]}"> hola caracola`);

  });

});
