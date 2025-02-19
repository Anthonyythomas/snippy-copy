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
            copyButtonStyle: { backgroundColor: '#3498db', color: 'white', fontSize: '10px' },
            errorMessage: "Impossible de copier",
            caption: '',
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

        codeElement.innerHTML = this.options.highlight ? this.highlightCode(this.code) : this.code;

        if (!this.options.noCopy) {
            const copyButton = this.createCopyButton();
            pre.appendChild(copyButton);
        }

        pre.appendChild(codeElement);
        return pre;
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
        const patterns = {
            numberPattern: /\b\d+(\.\d+)?([eE][+-]?\d+)?\b/g,
            stringPattern: /(["'`])(?:\\.|(?!\1)[^\\])*\1/g,
            fetchJsonLogPattern: /\b(fetch|json|log)\b/g,
            asyncAwaitPattern: /(?<!\/\/.*)\b(async|await)\b(?!.*\*)/g,
            returnPattern: /\breturn\b/g,
            functionPattern: /\bfunction\b/g,
            consolePattern: /\bconsole\b/g,
            conditionals: /(?<!\/\/.*)\b(if|else)\b(?!.*\*)/g,

            commentPattern: /\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm,
            functionNamePattern: /\b(?:function\s+([a-zA-Z_$][a-zA-Z0-9_$]*))|(?:([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*function)(?!\s*\breturn\b)/g,
            paramsFunctionPattern: /function\s+[a-zA-Z_$][a-zA-Z0-9_$]*\s*\(([^)]*)\)/g,
            variablePattern: /\b(var|let|const)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g,
            symbolsPattern: /(['"])(?:(?!\1)[^\\]|\\.)*\1|[()={};><*\-+.]/g,
        };

        const replacements = [
            { pattern: patterns.numberPattern, className: "number" },
            { pattern: patterns.stringPattern, className: "string" },
            { pattern: patterns.fetchJsonLogPattern, className: "fetch-json-log" },
            { pattern: patterns.asyncAwaitPattern, className: "async" },
            { pattern: patterns.returnPattern, className: "keyword" },
            { pattern: patterns.functionPattern, className: "function" },
            { pattern: patterns.consolePattern, className: "console" },
            { pattern: patterns.conditionals, className: "conditional" },
        ];

        let tempTokens = [];

        // Temporarily remove comments to avoid affecting syntax highlighting
        let comments = [];
        code = code.replace(patterns.commentPattern, (match) => {
            let token = `__COMMENT__${comments.length}__`;
            comments.push({ token, match });
            return token;
        });

        // Match and replace variable names for highlighting
        let variableMatches = code.match(patterns.variablePattern);
        const variableNames = (variableMatches || []).map(match => match.split(/\s+/)[1].trim()).filter(Boolean);
        const mergedArray = variableMatches.concat(variableNames);

        mergedArray.forEach(varName => {
            const regex = new RegExp(`(?<!['"])\\b${varName}\\b(?!['"])`, 'g');
            code = code.replace(regex, (match) => {
                let className = "keyword";
                let token = `__TOKEN__${match}__`;
                tempTokens.push({ token, match, className });
                return token;
            });
        });

        // Match and replace function names for highlighting
        let functionNameMatches = code.match(patterns.functionNamePattern);
        const functionNames = (functionNameMatches || []).map(match => match.split(/\s+/)[1].trim()).filter(Boolean);
        functionNames.forEach(fnName => {
            const regex = new RegExp(`(?<!['"])\\b${fnName}\\b(?!['"])`, 'g');
            code = code.replace(regex, (match) => {
                let cleanedMatch = match.trimStart();
                let className = "functionName";
                let token = `__TOKEN__${cleanedMatch}__`;
                tempTokens.push({ token, match, className });
                return token;
            });
        });

        // Match and replace function parameters for highlighting
        let paramsFunctionMatches = [...code.matchAll(patterns.paramsFunctionPattern)];

        paramsFunctionMatches.forEach(match => {
            const params = match[1]
                .split(',')
                .map(param => param.trim())
                .filter(param => param.length > 0);

            params.forEach(param => {
                const regex = new RegExp(`(?<!['"])\\b${param}\\b(?!['"])`, 'g');
                code = code.replace(regex, (match) => {
                    let cleanedMatch = match.trimStart();
                    let className = "paramsFunctionPattern";
                    let token = `__TOKEN__${cleanedMatch}__`;
                    tempTokens.push({ token, match, className });
                    return token;
                });
            });
        });

        // Apply replacements for predefined patterns (e.g., keywords, numbers, etc.)
        replacements.forEach(({ pattern, className }) => {
            code = code.replace(pattern, (match) => {
                let cleanedMatch = match.trimStart();
                let token = `__TOKEN__${cleanedMatch}__`;
                tempTokens.push({ token, match: cleanedMatch, className });
                return token;
            });
        });

        // Apply symbols highlighting, ignoring those inside strings
        code = code.replace(patterns.symbolsPattern, (match, stringMarker) => {
            if (!stringMarker) {
                let token = `__TOKEN__${match}__`;
                tempTokens.push({ token, match, className: "delimiter" });
                return token;
            }
            return match;
        });

        // Restore comments in their original positions
        comments.forEach(({ token, match }) => {
            code = code.replace(token, `<span class="comment">${match}</span>`);
        });

        // Replace tokens with corresponding highlighted spans
        tempTokens.reverse().forEach(({ token, match, className }) => {
            code = code.replace(token, `<span class="${className}">${match}</span>`);
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
            ]
        };

        return keywords[language] || [];
    }

    copyToClipboard(button) {
        try {
            navigator.clipboard.writeText(this.code);
            alert("Code copié avec succès !");
        } catch (e) {
            alert(this.options.errorMessage);
        }
    }
}

export default SnippyCopy;