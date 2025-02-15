import "./snippy-copy.css";

class SnippyCopy {
    constructor(selector, code, language = "javascript") {
        this.selector = selector;
        this.code = code;
        this.language = language;
        this.keywords = this.getKeywordsForLanguage(language);
        this.init();
    }

    init() {
        const container = document.querySelector(this.selector);
        if (!container) return;

        container.innerHTML = "";

        const snippet = this.createSnippet();
        container.appendChild(snippet);
    }

    createSnippet() {
        const pre = document.createElement("pre");

        const codeElement = document.createElement("code");
        codeElement.classList.add(`language-${this.language}`);
        codeElement.innerHTML = this.highlightCode(this.code);

        const copyButton = this.createCopyButton();

        pre.appendChild(copyButton);
        pre.appendChild(codeElement);

        return pre;
    }

    createCopyButton() {
        const button = document.createElement("button");
        button.textContent = "📋";
        button.classList.add("copy-btn");
        button.addEventListener("click", () => this.copyToClipboard(button));
        return button;
    }

    highlightCode(code) {
        const stringPattern = /(["'`].*?["'`])/g;
        const keywordPattern = /\b(const|let|var|function|return|if|else|for|while|break|continue|try|catch|class|new|this|import|export|await|async)\b/g;
        const logPattern = /\b(log)\b/g;
        const funcPattern = /\b(console|alert|fetch|setTimeout|setInterval)\b/g;
        const numberPattern = /\b\d+\b/g;
        const parensPattern = /([\(\)])/g;
        const functionNamePattern = /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\b(?!\s*\()(?!\s*\/\/)/g;
        const commentPattern = /\/\/[^\n]*|\/\*[\s\S]*?\*\//g;
        const variablePattern = /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\b(?!\s*\()/g;

        const combinedPattern = new RegExp(
            [
                stringPattern.source,
                keywordPattern.source,
                logPattern.source,
                funcPattern.source,
                numberPattern.source,
                parensPattern.source,
                functionNamePattern.source,
                commentPattern.source,
                variablePattern.source
            ].join('|'),
            'g'
        );

        return code.replace(combinedPattern, (match, string, keyword, log, func, number, parens, functionName, comment, variable) => {
            if (string) return `<span class="string">${match}</span>`;
            if (keyword) return `<span class="keyword">${match}</span>`;
            if (log) return `<span class="log">${match}</span>`;
            if (func) return `<span class="function">${match}</span>`;
            if (number) return `<span class="number">${match}</span>`;
            if (parens) return `<span class="parenthesis">${match}</span>`;
            if (functionName && !this.keywords.includes(functionName)) return `<span class="function-name">${match}</span>`;
            if (comment) return `<span class="comment">${match}</span>`;
            if (variable && !this.keywords.includes(variable)) return `<span class="variable">${match}</span>`;
            return match;
        });
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
            ]
        };

        return keywords[language] || [];
    }

    async copyToClipboard(button) {
        try {
            await navigator.clipboard.writeText(this.code);
            button.textContent = "✅";
            setTimeout(() => button.textContent = "📋", 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
            button.textContent = "❌";
            setTimeout(() => button.textContent = "📋", 2000);
        }
    }
}

export default SnippyCopy;
