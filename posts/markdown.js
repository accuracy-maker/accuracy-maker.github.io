/* ══════════════════════════════════════════════════════════════════════
   Shared Markdown helpers for the blog.

   Used by posts/post.html (renders one post) and blog.html (builds the
   index from each post's front matter).  You should never need to edit
   this file to write a post — just add a .md file in posts/.
   ══════════════════════════════════════════════════════════════════════ */
(function (global) {
    'use strict';

    /* ── front matter ─────────────────────────────────────────────────
       ---
       title: My Post
       date: July 17, 2026
       read: 6 min read
       excerpt: One or two sentences shown on the blog index.
       ---
       Everything after the closing --- is the Markdown body.
    ------------------------------------------------------------------ */
    function splitFrontMatter(raw) {
        var text = raw.replace(/^﻿/, '').replace(/\r\n?/g, '\n');
        var m = /^---[ \t]*\n([\s\S]*?)\n---[ \t]*(?:\n|$)/.exec(text);
        if (!m) return { meta: {}, body: text };

        var meta = {};
        m[1].split('\n').forEach(function (line) {
            if (!line.trim() || /^\s*#/.test(line)) return;
            var i = line.indexOf(':');
            if (i < 0) return;
            var key = line.slice(0, i).trim().toLowerCase();
            var val = line.slice(i + 1).trim();
            // strip optional surrounding quotes
            val = val.replace(/^"([\s\S]*)"$/, '$1').replace(/^'([\s\S]*)'$/, '$1');
            meta[key] = val;
        });
        return { meta: meta, body: text.slice(m[0].length) };
    }

    /* ── protect LaTeX from the Markdown parser ───────────────────────
       Markdown would otherwise eat underscores, asterisks and backslashes
       inside math.  Every math span is pulled out and replaced by a plain
       alphanumeric token, the Markdown is parsed, then the math is put
       back untouched for MathJax.  Math inside code fences and backticks
       is deliberately left alone.
    ------------------------------------------------------------------ */
    var TOKEN = 'xMATHJAXTOKENx';
    var TOKEN_RE = /xMATHJAXTOKENx(\d+)x/g;

    function protectMath(src, store) {
        var out = '', i = 0, n = src.length;

        function stash(text) {
            out += TOKEN + store.length + 'x';
            store.push(text);
        }
        // index of the closing delimiter, skipping escaped characters
        // (the delimiter itself wins, so \) and \] still close their group)
        function findClose(close, from) {
            var j = from;
            while (j < n) {
                if (src.startsWith(close, j)) return j;
                if (src[j] === '\\') { j += 2; continue; }
                j++;
            }
            return -1;
        }

        while (i < n) {
            var atLineStart = (i === 0 || src[i - 1] === '\n');

            // fenced code block → copy verbatim
            if (atLineStart && (src.startsWith('```', i) || src.startsWith('~~~', i))) {
                var fence = /^(`{3,}|~{3,})/.exec(src.slice(i, i + 20))[1];
                var end = src.indexOf('\n' + fence, i + fence.length);
                var stop = end < 0 ? n : src.indexOf('\n', end + 1);
                if (stop < 0) stop = n;
                out += src.slice(i, stop);
                i = stop;
                continue;
            }
            // inline code span → copy verbatim
            if (src[i] === '`') {
                var ticks = /^`+/.exec(src.slice(i, i + 10))[0];
                var closeTick = src.indexOf(ticks, i + ticks.length);
                var to = closeTick < 0 ? i + ticks.length : closeTick + ticks.length;
                out += src.slice(i, to);
                i = to;
                continue;
            }
            // display math:  $$ … $$   and   \[ … \]
            if (src.startsWith('$$', i)) {
                var c = findClose('$$', i + 2);
                if (c > 0) { stash(src.slice(i, c + 2)); i = c + 2; continue; }
            }
            if (src.startsWith('\\[', i)) {
                var c2 = findClose('\\]', i + 2);
                if (c2 > 0) { stash(src.slice(i, c2 + 2)); i = c2 + 2; continue; }
            }
            // inline math:  \( … \)   and   $ … $
            if (src.startsWith('\\(', i)) {
                var c3 = findClose('\\)', i + 2);
                if (c3 > 0) { stash(src.slice(i, c3 + 2)); i = c3 + 2; continue; }
            }
            if (src[i] === '$' && src[i + 1] && !/[\s$]/.test(src[i + 1])) {
                var c4 = findClose('$', i + 1);
                // an inline $…$ has to close before the next blank line
                if (c4 > 0 && !/\n[ \t]*\n/.test(src.slice(i, c4))) {
                    stash(src.slice(i, c4 + 1)); i = c4 + 1; continue;
                }
            }
            // \$ outside math: hand it to MathJax, not to Markdown, so the
            // dollar survives as a literal instead of opening a math span
            if (src[i] === '\\' && src[i + 1] === '$') { stash('\\$'); i += 2; continue; }
            // any other escaped character → keep the pair together
            if (src[i] === '\\') { out += src.slice(i, i + 2); i += 2; continue; }

            out += src[i++];
        }
        return out;
    }

    function escapeHtml(s) {
        return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function restoreMath(html, store) {
        return html.replace(TOKEN_RE, function (whole, k) {
            var math = store[+k];
            return math === undefined ? whole : escapeHtml(math);
        });
    }

    /* ── theorem-style blocks ─────────────────────────────────────────
       :::definition Orthogonal group
       The set of matrices $A$ with $AA^T = I$.
       :::

       becomes a numbered, boxed "Definition 1 (Orthogonal group)."  The
       body is ordinary Markdown, so math, lists and code all work inside.
    ------------------------------------------------------------------ */
    var LABELS = {
        definition:  'Definition',
        theorem:     'Theorem',
        lemma:       'Lemma',
        corollary:   'Corollary',
        proposition: 'Proposition',
        claim:       'Claim',
        example:     'Example',
        exercise:    'Exercise',
        remark:      'Remark',
        note:        'Note',
        proof:       'Proof'
    };
    // these read better without a running number
    var UNNUMBERED = { proof: true, note: true, remark: true };

    var counters = {};

    var calloutExtension = {
        name: 'callout',
        level: 'block',
        start: function (src) {
            var m = /^:::/m.exec(src);
            return m ? m.index : undefined;
        },
        tokenizer: function (src) {
            var m = /^:::[ \t]*([A-Za-z][A-Za-z-]*)[ \t]*([^\n]*)\n([\s\S]*?)\n[ \t]*:::[ \t]*(?:\n+|$)/.exec(src);
            if (!m) return;
            // :::embed belongs to the embed extension, not here
            if (m[1].toLowerCase() === 'embed') return;
            var token = {
                type: 'callout',
                raw: m[0],
                kind: m[1].toLowerCase(),
                tokens: [],
                titleTokens: []
            };
            this.lexer.blockTokens(m[3], token.tokens);
            if (m[2].trim()) this.lexer.inline(m[2].trim(), token.titleTokens);
            return token;
        },
        renderer: function (token) {
            var kind = token.kind;
            var name = LABELS[kind] || (kind.charAt(0).toUpperCase() + kind.slice(1));

            var label = name;
            if (!UNNUMBERED[kind]) {
                counters[kind] = (counters[kind] || 0) + 1;
                label += ' ' + counters[kind];
            }
            if (token.titleTokens.length) {
                label += ' <span class="callout-name">(' +
                         this.parser.parseInline(token.titleTokens) + ')</span>';
            }
            label = '<span class="callout-label">' + label + '.</span> ';

            var body = this.parser.parse(token.tokens);
            // run the label into the first paragraph, the way a paper does
            if (/^<p>/.test(body)) body = body.replace('<p>', '<p>' + label);
            else body = '<p>' + label + '</p>' + body;
            if (kind === 'proof') {
                var qed = '<span class="callout-qed">∎</span>';
                // tuck the tombstone onto the last line where there is one
                body = /<\/p>\s*$/.test(body)
                    ? body.replace(/<\/p>(\s*)$/, qed + '</p>$1')
                    : body + '<p>' + qed + '</p>';
            }

            return '<div class="callout callout-' + kind + '">' + body + '</div>\n';
        }
    };

    /* ── embedded pages ───────────────────────────────────────────────
       :::embed o2_two_circles.html
       An optional caption, in Markdown.
       :::

       Drops a standalone .html page (an interactive figure, a demo) into
       the post inside an iframe, so its own CSS and JS stay isolated.
       The path is relative to the post itself.  The frame grows to fit
       its content automatically; add height=480 to pin it instead.
    ------------------------------------------------------------------ */
    var embedExtension = {
        name: 'embed',
        level: 'block',
        start: function (src) {
            var m = /^:::embed\b/m.exec(src);
            return m ? m.index : undefined;
        },
        tokenizer: function (src) {
            // the caption group is lazily optional (??) so that a block with
            // no caption closes on its own ::: instead of the next one's
            var m = /^:::embed[ \t]+([^\s\n]+)([^\n]*)\n(?:([\s\S]*?)\n)??[ \t]*:::[ \t]*(?:\n+|$)/.exec(src);
            if (!m) return;
            var height = /height=(\d+)/.exec(m[2] || '');
            var token = {
                type: 'embed',
                raw: m[0],
                src: m[1],
                height: height ? height[1] : null,
                tokens: []
            };
            if (m[3] && m[3].trim()) this.lexer.blockTokens(m[3], token.tokens);
            return token;
        },
        renderer: function (token) {
            var url = encodeURI(token.src).replace(/"/g, '%22');
            var style = token.height
                ? ' style="height:' + token.height + 'px"'
                : ' style="height:480px"';
            var fixed = token.height ? ' data-fixed-height="1"' : '';

            var html = '<figure class="embed">' +
                '<iframe class="embed-frame" src="' + url + '"' + style + fixed +
                ' loading="lazy" scrolling="no"></iframe>';

            var caption = token.tokens.length ? this.parser.parse(token.tokens) : '';
            html += '<figcaption>' + caption +
                    '<a class="embed-open" href="' + url + '" target="_blank" rel="noopener">' +
                    'open in a new tab ↗</a></figcaption>';

            return html + '</figure>\n';
        }
    };

    var extensionsReady = false;
    function installExtensions() {
        if (extensionsReady || !global.marked || !global.marked.use) return;
        // embed is registered first so :::embed is not read as a callout kind
        global.marked.use({ extensions: [embedExtension, calloutExtension] });
        extensionsReady = true;
    }

    /* ── public API ───────────────────────────────────────────────── */

    function render(markdown) {
        installExtensions();
        counters = {};
        var store = [];
        var safe = protectMath(markdown, store);
        var html = global.marked.parse(safe);
        return restoreMath(html, store);
    }

    function parsePost(raw) {
        var fm = splitFrontMatter(raw);
        return { meta: fm.meta, body: fm.body, html: render(fm.body) };
    }

    // "July 17, 2026 · 6 min read"
    function formatMeta(meta) {
        return [meta.date, meta.read].filter(Boolean).join(' · ');
    }

    global.MD = {
        parsePost: parsePost,
        render: render,
        splitFrontMatter: splitFrontMatter,
        formatMeta: formatMeta
    };
})(window);
