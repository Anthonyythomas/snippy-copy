import "./snippy-copy.css";

class SnippyCopy {
    constructor(selector, code, language = "javascript", options = {}) {
        this.selector = selector;
        this.code = code;
        this.language = language;
        this.options = {
            noCopy: false,
            highlight: true,
            theme: 'dark',
            copyButtonText: '📋',
            copyButtonStyle: {backgroundColor: '#3498db', color: 'white', fontSize: '10px'},
            errorMessage: "Impossible de copier",
            caption: '',
            showLineNumbers: false,
            ...options
        };
        this.keywords = this.getKeywordsForLanguage(language);
        this.init();
    }

    init() {
        const container = document.querySelector(this.selector);
        if (!container) return;

        container.innerHTML = "";

        if (this.options.caption) {
            const captionElement = document.createElement("p");
            captionElement.textContent = this.options.caption;
            container.appendChild(captionElement);
        }

        const snippet = this.createSnippet();
        container.appendChild(snippet);
    }

    createSnippet() {
        const pre = document.createElement("pre");
        pre.classList.add(this.options.theme);

        const codeElement = document.createElement("code");
        codeElement.classList.add(`language-${this.language}`);

        let escapedCode = this.escapeHtml(this.code.trim());
        if (this.options.highlight) {
            escapedCode = this.highlightCode(escapedCode);
        }

        if (this.options.showLineNumbers) {
            escapedCode = this.addLineNumbers(escapedCode);
        }

        codeElement.innerHTML = escapedCode;

        if (!this.options.noCopy) {
            const copyButton = this.createCopyButton();
            copyButton.addEventListener("click", () => this.copyToClipboard(copyButton));
            pre.appendChild(copyButton);
        }

        pre.appendChild(codeElement);
        return pre;
    }

    addLineNumbers(code) {
        // Add a wrapper div to contain both line numbers and code
        const lines = code.split("\n");
        const numberedLines = lines.map((line, index) =>
            `<div class="code-line">
                <span class="line-number" unselectable="on">${index + 1}</span>
                <span class="line-content">${line}</span>
             </div>`
        ).join("");

        // Add necessary CSS styles
        const style = document.createElement('style');
        style.textContent = `
            pre code {
                display: block;
            }
            .code-line {
                display: flex;
                white-space: pre;
            }
            .line-number {
                user-select: none;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                padding-right: 1em;
                opacity: 0.5;
                text-align: right;
                min-width: 2em;
            }
            .line-content {
                flex: 1;
            }
        `;
        document.head.appendChild(style);

        return numberedLines;
    }

    escapeHtml(code) {
        return code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    createCopyButton() {
        const button = document.createElement("button");
        button.textContent = this.options.copyButtonText;
        button.classList.add("copy-btn");

        const container = document.querySelector(this.selector);
        if (container) {
            button.classList.add(this.options.theme);
        }

        Object.assign(button.style, this.options.copyButtonStyle);

        button.addEventListener("click", () => this.copyToClipboard(button));
        return button;
    }

    highlightCode(code) {
        switch (this.language) {
            case 'javascript':
                return this.highlightJavaScript(code);
            case 'html':
                return this.highlightHTML(code);
            default:
                return code;
        }
    }

    highlightHTML(code) {
        // Storage for tokens
        const tokens = {
            comments: [],
            doctype: [],
            strings: [],
            tags: []
        };

        // Replace function to generate tokens
        const tokenize = (type, match) => {
            const token = `__${type}_${tokens[type].length}__`;
            tokens[type].push({ token, match });
            return token;
        };

        // Initial HTML entities conversion
        let str = code.replace(/</g, "&lt;").replace(/>/g, "&gt;");

        // Save comments with tokens
        str = str.replace(/(&lt;!--[\s\S]*?--&gt;)/g, match =>
            tokenize('comments', `<span style="color: #5c6690;">${match}</span>`)
        );

        // Save DOCTYPE with tokens
        str = str.replace(/(&lt;!DOCTYPE)\s+(html)(&gt;)/i, (match, doctype, html, closeTag) =>
            tokenize('doctype', `<span style="color: #e6bd69;">${doctype}</span> <span style="color: #b9b9b9;">${html}</span><span style="color: #e6bd69;">${closeTag}</span>`)
        );

        // Save strings with tokens - Now handling both quoted and unquoted attribute values
        str = str.replace(/=("([^"]*)"|\s*([^\s>]+))/g, (match, value, quoted, unquoted) => {
            const content = quoted || unquoted;
            return `=<span style="color: #4CAF50;">"${content}"</span>`;
        });

        // Highlight HTML tags and save with tokens
        str = str.replace(/&lt;(\/?[a-zA-Z0-9]+)([^&]*?)&gt;/g, (match, tag, attributes) =>
            tokenize('tags', `<span style="color: #f5758d;">&lt;${tag}</span>${attributes}<span style="color: #f5758d;">&gt;</span>`)
        );

        // Restore all tokens
        Object.entries(tokens).forEach(([type, replacements]) => {
            replacements.forEach(({token, match}) => {
                str = str.replace(token, match);
            });
        });

        return str;
    }

    highlightJavaScript(code) {
        // Define regex patterns for different JavaScript elements
        const patterns = {
            number: /\b\d+(\.\d+)?([eE][+-]?\d+)?\b/g,
            string: /(["'`])(?:\\.|(?!\1)[^\\])*\1/g,
            fetchJsonLog: /\b(fetch|json|log)\b/g,
            asyncAwait: /(?<!\/\/.*)\b(async|await)\b(?!.*\*)/g,
            keyword: /\b(return|function|var|let|const|if|else)\b/g,
            console: /\bconsole\b/g,
            comment: /\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm,
            functionName: /\b(?:function\s+([a-zA-Z_$][a-zA-Z0-9_$]*))|(?:([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*function)(?!\s*\breturn\b)|(?:([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\()/g,
            variableDeclaration: /\b(const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\b/g,
            variableUsage: /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\b(?!\s*\()/g,
            symbols: /([()={};><*\-+.])/g,
            functionParams: /(?:function\s*\w*\s*$$([^)]*)$$\s*{[^}]*}|(\w+\s*=\s*$$([^)]*)$$\s*=>))/g,
        };

        // Map patterns to CSS classes for styling
        const classMap = {
            number: "js-number",
            string: "js-string",
            fetchJsonLog: "js-fetch-json-log",
            asyncAwait: "js-async",
            keyword: "js-keyword",
            console: "js-console",
            comment: "js-comment",
            functionName: "js-functionName",
            variable: "js-variable",
            symbols: "js-delimiter",
            functionParam: "js-function-param",
        };

        // Initialize sets to store declared variables and functions
        const declaredVariables = new Set();
        const declaredFunctions = new Set();

        let match;
        let tokenCounter = 0;
        const tokenMap = new Map();

        // Process function parameters
        while ((match = patterns.functionParams.exec(code)) !== null) {
            const params = (match[1] || match[3])?.trim();
            if (params) {
                params.split(/\s*,\s*/).forEach(param => {
                    const token = `___TOKEN_${tokenCounter++}___`;
                    tokenMap.set(token, `<span class="js-function-param">${param}</span>`);
                    code = code.replace(new RegExp(`\\b${param}\\b`, 'g'), token);
                });
            }
        }

        // Identify and store declared variables
        code = code.replace(patterns.variableDeclaration, (match, keyword, varName) => {
            if (varName) {
                declaredVariables.add(varName);
            }
            return match;
        });

        // Extract and store comments
        const comments = [];
        code = code.replace(patterns.comment, match => {
            comments.push(match);
            return `__COMMENT__${comments.length - 1}__`;
        });

        // Extract and store strings
        const strings = [];
        code = code.replace(patterns.string, match => {
            strings.push(match);
            return `__STRING__${strings.length - 1}__`;
        });

        // Highlight symbols
        code = code.replace(patterns.symbols, match => `<span class="${classMap.symbols}">${match}</span>`);

        // Highlight function names and store them
        code = code.replace(patterns.functionName, (match, name1, name2, name3) => {
            const functionName = name1 || name2 || name3;
            if (functionName) {
                declaredFunctions.add(functionName);
                return match.replace(functionName, `<span class="${classMap.functionName}">${functionName}</span>`);
            }
            return match;
        });

        // Highlight other patterns (except for specific ones)
        Object.keys(patterns).forEach(key => {
            if (!["variableUsage", "variableDeclaration", "string", "comment", "symbols", "keyword", "functionName", "functionParams"].includes(key)) {
                code = code.replace(patterns[key], match => `<span class="${classMap[key]}">${match}</span>`);
            }
        });

        // Highlight keywords
        code = code.replace(patterns.keyword, match => `<span class="${classMap.keyword}">${match}</span>`);

        // Highlight variable usage
        code = code.replace(patterns.variableUsage, match => {
            if (declaredVariables.has(match)) {
                return `<span class="${classMap.variable}">${match}</span>`;
            }
            if (declaredFunctions.has(match)) {
                return `<span class="${classMap.functionName}">${match}</span>`;
            }
            return match;
        });

        // Restore strings with highlighting
        code = code.replace(/__STRING__(\d+)__/g, (_, index) => `<span class="${classMap.string}">${strings[Number.parseInt(index)]}</span>`);

        // Restore comments with highlighting
        code = code.replace(/__COMMENT__(\d+)__/g, (_, index) => `<span class="${classMap.comment}">${comments[Number.parseInt(index)]}</span>`);

        // Restore function parameters with highlighting
        tokenMap.forEach((value, token) => {
            code = code.replace(new RegExp(token, 'g'), value);
        });

        return code;
    }

    getKeywordsForLanguage(language) {
        const keywords = {
            javascript: [
                'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while',
                'break', 'continue', 'try', 'catch', 'class', 'new', 'this', 'import', 'export',
                'await', 'async'
            ],
            python: [
                'def', 'return', 'if', 'else', 'elif', 'for', 'while', 'break', 'continue',
                'try', 'except', 'class', 'import', 'from', 'as', 'with', 'lambda', 'yield',
                'async', 'await', 'pass', 'global', 'nonlocal', 'raise'
            ],
            java: [
                'public', 'private', 'protected', 'class', 'interface', 'extends', 'implements',
                'static', 'final', 'void', 'return', 'new', 'try', 'catch', 'finally', 'throw',
                'throws', 'import', 'package', 'this', 'super', 'synchronized', 'volatile'
            ],
            html: [
                'html', 'head', 'body', 'title', 'div', 'span', 'a', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                'ul', 'li', 'img', 'script', 'link', 'meta', 'style', 'form', 'input', 'button', 'table', 'tr',
                'th', 'td', 'thead', 'tbody', 'footer', 'header', 'section', 'article', 'aside', 'nav'
            ]
        };

        return keywords[language] || [];
    }

    copyToClipboard(button) {
        navigator.clipboard.writeText(this.code)
            .then(() => {
                button.textContent = "✔️";
                setTimeout(() => {
                    button.textContent = "📋";
                }, 1500);
            })
            .catch(() => {
                console.log('Failed to copy');
                button.textContent = "❌";
                setTimeout(() => {
                    button.textContent = "📋";
                }, 1500);
                alert("Impossible de copier");
            });
    }

}

export default SnippyCopy;