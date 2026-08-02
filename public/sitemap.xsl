<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" 
                xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title>XML Sitemap | Vedanga AI</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <style type="text/css">
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #1e293b;
            background-color: #f8fafc;
            padding: 40px 20px;
            margin: 0;
          }
          .container {
            max-width: 960px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.06);
            padding: 32px;
            border: 1px solid #e2e8f0;
          }
          .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 24px;
            padding-bottom: 20px;
            border-bottom: 1px solid #e2e8f0;
          }
          h1 {
            font-size: 26px;
            margin: 0 0 6px 0;
            color: #0f172a;
            font-weight: 700;
          }
          p.desc {
            font-size: 14px;
            color: #64748b;
            margin: 0;
          }
          .stats {
            background: #f1f5f9;
            padding: 6px 14px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 600;
            color: #475569;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 14px;
            margin-top: 10px;
          }
          th {
            background-color: #f8fafc;
            text-align: left;
            padding: 12px 16px;
            font-weight: 600;
            color: #334155;
            border-bottom: 2px solid #e2e8f0;
            text-transform: uppercase;
            font-size: 12px;
            letter-spacing: 0.05em;
          }
          td {
            padding: 12px 16px;
            border-bottom: 1px solid #f1f5f9;
            word-break: break-all;
          }
          tr:hover td {
            background-color: #f8fafc;
          }
          a {
            color: #2563eb;
            text-decoration: none;
            font-weight: 500;
          }
          a:hover {
            text-decoration: underline;
            color: #1d4ed8;
          }
          .badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 500;
            background: #eff6ff;
            color: #1d4ed8;
            font-family: monospace;
          }
          .footer {
            margin-top: 32px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            font-size: 13px;
            color: #94a3b8;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div>
              <h1>Vedanga AI Sitemap</h1>
              <p class="desc">Search Engine Optimization Index for Google &amp; Bing Crawlers</p>
            </div>
            <xsl:if test="count(sitemap:sitemapindex/sitemap:sitemap) &gt; 0">
              <div class="stats">
                Index: <xsl:value-of select="count(sitemap:sitemapindex/sitemap:sitemap)"/> Sub-sitemaps
              </div>
            </xsl:if>
            <xsl:if test="count(sitemap:urlset/sitemap:url) &gt; 0">
              <div class="stats">
                Total URLs: <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/>
              </div>
            </xsl:if>
          </div>

          <xsl:if test="count(sitemap:sitemapindex/sitemap:sitemap) &gt; 0">
            <table>
              <thead>
                <tr>
                  <th>Sitemap URL</th>
                  <th>Last Modified</th>
                </tr>
              </thead>
              <tbody>
                <xsl:for-each select="sitemap:sitemapindex/sitemap:sitemap">
                  <tr>
                    <td>
                      <a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a>
                    </td>
                    <td>
                      <span class="badge"><xsl:value-of select="sitemap:lastmod"/></span>
                    </td>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </xsl:if>

          <xsl:if test="count(sitemap:urlset/sitemap:url) &gt; 0">
            <table>
              <thead>
                <tr>
                  <th>URL Location</th>
                  <th>Priority</th>
                  <th>Frequency</th>
                  <th>Last Modified</th>
                </tr>
              </thead>
              <tbody>
                <xsl:for-each select="sitemap:urlset/sitemap:url">
                  <tr>
                    <td>
                      <a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a>
                    </td>
                    <td><xsl:value-of select="sitemap:priority"/></td>
                    <td><xsl:value-of select="sitemap:changefreq"/></td>
                    <td>
                      <span class="badge"><xsl:value-of select="sitemap:lastmod"/></span>
                    </td>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </xsl:if>

          <div class="footer">
            Generated automatically by Vedanga AI Astro-CMS Platform. Compliant with Sitemaps.org standard.
          </div>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
