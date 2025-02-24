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
            showLineNumbers: false,
            highlightLineNumbers: [],
            highlightLineColor: '',
            copySuccessMessage: 'Code copied successfully! 🎉',
            fontSize: '14px',
            lineHeight: '1.5',
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

    cleanCode(code) {
        const lines = code.split('\n');

        // Find the first non-empty line to determine the common indentation
        const firstNonEmptyLine = lines.find(line => line.trim() !== '');
        if (!firstNonEmptyLine) return ''; // Return an empty string if all lines are empty

        const indentation = firstNonEmptyLine.match(/^\s*/)[0].length; // Get leading spaces count

        return lines
            .map(line => line.startsWith(' ') ? line.slice(indentation) : line) // Remove common indentation
            .join('\n')
            .trim();
    }

    createSnippet() {
        const pre = document.createElement("pre");
        pre.classList.add(this.options.theme);

        const codeElement = document.createElement("code");
        codeElement.classList.add(`language-${this.language}`);

        let cleanCode = this.cleanCode(this.code)
        if (this.options.highlight) {
            cleanCode = this.highlightCode(cleanCode);
        }

        if (this.options.showLineNumbers) {
            cleanCode = this.addLineNumbers(cleanCode);
        }

        codeElement.innerHTML = cleanCode;

        // Apply custom font size and line height
        codeElement.style.fontSize = this.options.fontSize;
        codeElement.style.lineHeight = this.options.lineHeight;

        if (!this.options.noCopy) {
            const copyButton = this.createCopyButton();
            copyButton.addEventListener("click", () => this.copyToClipboard(copyButton));
            pre.appendChild(copyButton);
        }

        pre.appendChild(codeElement);
        return pre;
    }

    addLineNumbers(code) {
        const lines = code.split("\n");

        const numberedLines = lines.map((line, index) => {
            const lineNumber = index + 1;
            const isHighlighted = this.options.highlightLineNumbers.includes(lineNumber);

            const lineStyle = isHighlighted ? `background-color: ${this.options.highlightLineColor};` : '';

            return `<div class="code-line" style="${lineStyle}">
                    <span class="line-number" unselectable="on" style="color: ${isHighlighted ? '#ffcc00' : '#aaa'};">${lineNumber}</span>
                    <span class="line-content">${line}</span>
                </div>`;
        }).join("");

        return `<code class="language-javascript">${numberedLines}</code>`;
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

        return button;
    }

    highlightCode(code) {
        switch (this.language) {
            case 'javascript':
                return this.highlightJavaScript(code);
            case 'html':
                return this.highlightHTML(code);
            case 'css':
                return this.highlightCSS(code);
            case 'python':
                return this.highlightPython(code);
            case 'php':
                return this.highlightPHP(code);
            case 'java':
                return this.highlightJava(code);
            case 'c':
                return this.highlightC(code);
            case 'C++':
                return this.highlightCpp(code);
            case 'ruby':
                return this.highlightRuby(code);
            case 'swift':
                return this.highlightSwift(code);
            case 'go':
                return this.highlightGo(code);
            case 'rust':
                return this.highlightRust(code);
            case 'kotli':
                return this.highlightKotlin(code);
            case 'scala':
                return this.highlightScala(code);
            case 'lua':
                return this.highlightLua(code);
            case 'perl':
                return this.highlightPerl(code);
            case 'typeScript':
                return this.highlightTypeScript(code);
            case 'objective-c':
                return this.highlightObjectiveC(code);
            case 'bash':
                return this.highlightBash(code);
            case 'haskell':
                return this.highlightHaskell(code);
            case 'dart':
                return this.highlightDart(code);
            case 'elixir':
                return this.highlightElixir(code);
            case 'f#':
                return this.highlightFSharp(code);
            case 'vhdl':
                return this.highlightVHDL(code);
            case 'sql':
                return this.highlightSQL(code);
            case 'r':
                return this.highlightR(code);
            case 'vala':
                return this.highlightVala(code);
            case 'julia':
                return this.highlightJulia(code);
            case 'nim':
                return this.highlightNim(code);
            case 'powershell':
                return this.highlightPowerShell(code);
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

        // Convert special HTML characters
        let str = code.replace(/</g, "&lt;").replace(/>/g, "&gt;");

        // Function to highlight comments (applied after conversion)
        const highlightComments = (str) => {
            return str.replace(/(&lt;!--[\s\S]*?--&gt;)/g, match =>
                tokenize('comments', `<span style="color: #5c6690;">${match}</span>`)
            );
        };
        str = highlightComments(str);

        // Function to highlight DOCTYPE
        const highlightDoctype = (str) => {
            return str.replace(/(&lt;!DOCTYPE\b[^&]*?&gt;)/gi, match =>
                tokenize('doctype', `<span style="color: #e6bd69;">${match}</span>`)
            );
        };
        str = highlightDoctype(str);

        // Function to highlight attribute strings (quoted and unquoted)
        const highlightAttributes = (str) => {
            return str.replace(/=("([^"]*)"|\s*([^\s>]+))/g, (match, value, quoted, unquoted) => {
                const content = quoted || unquoted;
                return `=<span style="color: #4CAF50;">"${content}"</span>`;
            });
        };
        str = highlightAttributes(str);

        // Function to highlight HTML tags
        const highlightTags = (str) => {
            return str.replace(/&lt;(\/?[a-zA-Z0-9]+)([^&]*?)&gt;/g, (match, tag, attributes) =>
                tokenize('tags', `<span style="color: #f5758d;">&lt;${tag}${attributes}&gt;</span>`)
            );
        };
        str = highlightTags(str);

        // Restore all tokens
        Object.entries(tokens).forEach(([type, replacements]) => {
            replacements.forEach(({ token, match }) => {
                str = str.replace(token, match);
            });
        });

        return str;
    }

    highlightCSS(code) {
        // Storage for tokens
        const tokens = {
            comments: [],
            properties: [],
            values: [],
            selectors: [],
            functions: []
        };

        // Replace function to generate tokens
        const tokenize = (type, match) => {
            const token = `__${type}_${tokens[type].length}__`;
            tokens[type].push({ token, match });
            return token;
        };

        // Initial escaping of special characters
        let str = code.replace(/</g, "&lt;").replace(/>/g, "&gt;");

        // Save comments with tokens
        str = str.replace(/(\/\*[^*]*\*+(?:[^/*][^*]*\*+)*\/)/g, match =>
            tokenize('comments', `<span style="color: #5c6690;">${match}</span>`)
        );

        // Save CSS properties with tokens (ensuring `.line-content` remains separate)
        str = str.replace(/(\.[a-zA-Z-]+)(\s*\{)/g, (match, selector, brace) =>
            tokenize('selectors', `<span style="color: #f5758d;">${selector}</span>${brace}`)
        );

        str = str.replace(/([a-zA-Z-]+)(\s*:\s*)/g, (match, prop, colon) =>
            tokenize('properties', `<span style="color: #e6bd69;">${prop}</span>${colon}`)
        );

        // Save values with tokens (numbers, units, hex colors, and keywords)
        str = str.replace(/:\s*([0-9]+(\.[0-9]+)?(px|em|rem|%|vh|vw|s)?|#[0-9a-fA-F]{3,6})/g, (match, value) => {
            return `: <span style="color: #4CAF50;">${value}</span>`;
        });

        // Save CSS functions with tokens
        str = str.replace(/([a-zA-Z-]+)\s*\(([^)]*)\)/g, (match, func, params) =>
            tokenize('functions', `<span style="color: #b9b9b9;">${func}</span>(<span style="color: #4CAF50;">${params}</span>)`)
        );

        // Restore all tokens
        Object.entries(tokens).forEach(([type, replacements]) => {
            replacements.forEach(({ token, match }) => {
                str = str.replace(token, match);
            });
        });

        return str;
    }

    highlightJavaScript(code) {
        const patterns = {
            number: /\b\d+(\.\d+)?([eE][+-]?\d+)?\b/g,
            string: /(["'`])(?:\\.|(?!\1)[^\\])*\1/g,
            fetchJsonLog: /\b(fetch|json|log)\b/g,
            asyncAwait: /(?<!\/\/.*)\b(async|await)\b(?!.*\*)/g,
            keyword: /\b(return|function|var|let|const|if|else)\b/g,
            console: /\bconsole\b/g,
            comment: /\/\*[\s\S]*?\*\/|\/\/.*$/gm,
            functionName: /\b(?:function\s+([a-zA-Z_$][a-zA-Z0-9_$]*))|(?:([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*function)(?!\s*\breturn\b)|(?:([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\()/g,
            variableDeclaration: /\b(const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\b/g,
            variableUsage: /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\b(?!\s*\()/g,
            symbols: /([()={};><*\-+.])/g,
            functionParams: /(?:function\s*\w*\s*\(([^)]*)\)\s*{[^}]*}|(\w+\s*=\s*\(([^)]*)\)\s*=>))/g,

        };

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
            functionParam: "js-param-red",
        };

        const declaredVariables = new Set();
        const declaredFunctions = new Set();
        const functionParams = new Set();

        let match;
        let tokenCounter = 0;
        const tokenMap = new Map();
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

        const strings = [];
        code = code.replace(patterns.string, match => {
            strings.push(match);
            return `__STRING__${strings.length - 1}__`;
        });

        const comments = [];
        code = code.replace(patterns.comment, match => {
            comments.push(match);
            return `__COMMENT__${comments.length - 1}__`;
        });

        code = code.replace(patterns.functionDeclaration, (match, funcName, params) => {
            if (params) {
                params.split(',').forEach(param => {
                    functionParams.add(param.trim());
                });
            }
            return match;
        });

        code = code.replace(patterns.symbols, match => `<span class="${classMap.symbols}">${match}</span>`);

        code = code.replace(patterns.functionName, (match, name1, name2, name3) => {
            const functionName = name1 || name2 || name3;
            if (functionName) {
                declaredFunctions.add(functionName);
                return match.replace(functionName, `<span class="${classMap.functionName}">${functionName}</span>`);
            }
            return match;
        });

        code = code.replace(patterns.variableDeclaration, (match, keyword, varName) => {
            if (varName) {
                declaredVariables.add(varName);
            }
            return `<span class="${classMap.keyword}">${keyword}</span> <span class="${classMap.variable}">${varName}</span>`;
        });

        Object.keys(patterns).forEach(key => {
            if (!["variableUsage", "variableDeclaration", "string", "comment", "symbols", "keyword", "functionName", "functionDeclaration"].includes(key)) {
                code = code.replace(patterns[key], match => `<span class="${classMap[key]}">${match}</span>`);
            }
        });

        code = code.replace(patterns.keyword, match => `<span class="${classMap.keyword}">${match}</span>`);

        functionParams.forEach(param => {
            const paramRegex = new RegExp(`\\b${param}\\b`, 'g');
            code = code.replace(paramRegex, `<span class="${classMap.functionParam}">${param}</span>`);
        });

        code = code.replace(patterns.variableUsage, match => {
            if (declaredVariables.has(match)) {
                return `<span class="${classMap.variable}">${match}</span>`;
            }
            if (declaredFunctions.has(match)) {
                return `<span class="${classMap.functionName}">${match}</span>`;
            }
            return match;
        });

        code = code.replace(/__COMMENT__(\d+)__/g, (_, index) =>
            `<span class="${classMap.comment}">${comments[Number.parseInt(index)]}</span>`
        );

        code = code.replace(/__STRING__(\d+)__/g, (_, index) =>
            `<span class="${classMap.string}">${strings[Number.parseInt(index)]}</span>`
        );

        tokenMap.forEach((value, token) => {
            code = code.replace(new RegExp(token, 'g'), value);
        });

        return code;
    }

    highlightPython(code) {
        const tokens = {
            comments: [],
            strings: [],
            keywords: [],
            functions: []
        };

        const tokenize = (type, match) => {
            const token = `__${type}_${tokens[type].length}__`;
            tokens[type].push({ token, match });
            return token;
        };

        let str = code.replace(/</g, "&lt;").replace(/>/g, "&gt;");

        // Highlight comments
        const highlightComments = (str) => {
            return str.replace(/(#.*?$)/gm, match =>
                tokenize('comments', `<span style="color: #5c6690;">${match}</span>`)
            );
        };
        str = highlightComments(str);

        // Highlight strings (single and double quotes, including triple quotes)
        const highlightStrings = (str) => {
            return str.replace(/("""[\s\S]*?"""|'''[\s\S]*?'''|"[^"]*"|'[^']*')/g, match =>
                tokenize('strings', `<span style="color: #4CAF50;">${match}</span>`)
            );
        };
        str = highlightStrings(str);

        // Highlight Python keywords
        const highlightKeywords = (str) => {
            const pythonKeywords = this.getKeywordsForLanguage(this.language);

            const regex = new RegExp(`\\b(${pythonKeywords.join('|')})\\b`, 'g');
            return str.replace(regex, match =>
                tokenize('keywords', `<span style="color: #f5758d;">${match}</span>`)
            );
        };
        str = highlightKeywords(str);

        // Highlight function names
        const highlightFunctions = (str) => {
            return str.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g, match =>
                tokenize('functions', `<span style="color: #e6bd69;">${match}</span>`)
            );
        };
        str = highlightFunctions(str);

        // Restore all tokens
        Object.entries(tokens).forEach(([type, replacements]) => {
            replacements.forEach(({ token, match }) => {
                str = str.replace(token, match);
            });
        });

        return str;
    }

    highlightPHP(code) {
        // Storage for tokens
        const tokens = {
            comments: [],
            strings: [],
            variables: [],
            functions: [],
            keywords: []
        };

        // Replace function to generate tokens
        const tokenize = (type, match) => {
            const token = `__${type}_${tokens[type].length}__`;
            tokens[type].push({ token, match });
            return token;
        };

        // Convert special HTML characters
        let str = code.replace(/</g, "&lt;").replace(/>/g, "&gt;");

        // Function to highlight PHP comments
        const highlightComments = (str) => {
            return str.replace(/(\/\/[^\n]*|\/\*[\s\S]*?\*\/)/g, match =>
                tokenize('comments', `<span style="color: #5c6690;">${match}</span>`)
            );
        };
        str = highlightComments(str);

        // Function to highlight PHP strings (both single and double quotes)
        const highlightStrings = (str) => {
            return str.replace(/(["'])((?:\\.|[^\\])*?)\1/g, (match, quote, content) =>
                tokenize('strings', `<span style="color: #4CAF50;">${match}</span>`)
            );
        };
        str = highlightStrings(str);

        // Function to highlight PHP variables
        const highlightVariables = (str) => {
            return str.replace(/\$[a-zA-Z_][a-zA-Z0-9_]*/g, match =>
                tokenize('variables', `<span style="color: #e6bd69;">${match}</span>`)
            );
        };
        str = highlightVariables(str);

        // Function to highlight PHP functions
        const highlightFunctions = (str) => {
            return str.replace(/\b[a-zA-Z_][a-zA-Z0-9_]*\s*\(/g, match =>
                tokenize('functions', `<span style="color: #f5758d;">${match}</span>`)
            );
        };
        str = highlightFunctions(str);

        // Function to highlight PHP keywords
        const highlightKeywords = (str) => {
            const phpKeywords = this.getKeywordsForLanguage(this.language);
            const keywordRegex = new RegExp(`\\b(${phpKeywords.join('|')})\\b`, 'g');
            return str.replace(keywordRegex, match =>
                tokenize('keywords', `<span style="color: #ff4500;">${match}</span>`)
            );
        };
        str = highlightKeywords(str);

        // Restore all tokens
        Object.entries(tokens).forEach(([type, replacements]) => {
            replacements.forEach(({ token, match }) => {
                str = str.replace(token, match);
            });
        });

        return str;
    }

    highlightJava(code) {
        const tokens = {
            comments: [],
            strings: [],
            keywords: [],
            functions: []
        };

        const tokenize = (type, match) => {
            const token = `__${type}_${tokens[type].length}__`;
            tokens[type].push({ token, match });
            return token;
        };

        let str = code.replace(/</g, "&lt;").replace(/>/g, "&gt;");

        // Highlight comments
        const highlightComments = (str) => {
            return str.replace(/(\/\/[^\n]*|\/\*[\s\S]*?\*\/)/g, match =>
                tokenize('comments', `<span style="color: #5c6690;">${match}</span>`)
            );
        };
        str = highlightComments(str);

        // Highlight strings (double quotes)
        const highlightStrings = (str) => {
            return str.replace(/"([^"]*)"/g, match =>
                tokenize('strings', `<span style="color: #4CAF50;">${match}</span>`)
            );
        };
        str = highlightStrings(str);

        // Highlight Java keywords
        const highlightKeywords = (str) => {
            const javaKeywords = this.getKeywordsForLanguage('java');

            const regex = new RegExp(`\\b(${javaKeywords.join('|')})\\b`, 'g');
            return str.replace(regex, match =>
                tokenize('keywords', `<span style="color: #f5758d;">${match}</span>`)
            );
        };
        str = highlightKeywords(str);

        // Highlight function names (method declarations and calls)
        const highlightFunctions = (str) => {
            return str.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g, match =>
                tokenize('functions', `<span style="color: #e6bd69;">${match}</span>`)
            );
        };
        str = highlightFunctions(str);

        // Restore all tokens
        Object.entries(tokens).forEach(([type, replacements]) => {
            replacements.forEach(({ token, match }) => {
                str = str.replace(token, match);
            });
        });

        return str;
    }

    highlightC(code) {
        const tokens = {
            comments: [],
            strings: [],
            keywords: [],
            functions: []
        };

        const tokenize = (type, match) => {
            const token = `__${type}_${tokens[type].length}__`;
            tokens[type].push({ token, match });
            return token;
        };

        let str = code.replace(/</g, "&lt;").replace(/>/g, "&gt;");

        // Highlight comments
        const highlightComments = (str) => {
            return str.replace(/(\/\/[^\n]*|\/\*[\s\S]*?\*\/)/g, match =>
                tokenize('comments', `<span style="color: #5c6690;">${match}</span>`)
            );
        };
        str = highlightComments(str);

        // Highlight strings (double quotes)
        const highlightStrings = (str) => {
            return str.replace(/"([^"]*)"/g, match =>
                tokenize('strings', `<span style="color: #4CAF50;">${match}</span>`)
            );
        };
        str = highlightStrings(str);

        // Highlight C keywords
        const highlightKeywords = (str) => {
            const cKeywords = this.getKeywordsForLanguage('c');

            const regex = new RegExp(`\\b(${cKeywords.join('|')})\\b`, 'g');
            return str.replace(regex, match =>
                tokenize('keywords', `<span style="color: #f5758d;">${match}</span>`)
            );
        };
        str = highlightKeywords(str);

        // Highlight function names
        const highlightFunctions = (str) => {
            return str.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g, match =>
                tokenize('functions', `<span style="color: #e6bd69;">${match}</span>`)
            );
        };
        str = highlightFunctions(str);

        // Restore all tokens
        Object.entries(tokens).forEach(([type, replacements]) => {
            replacements.forEach(({ token, match }) => {
                str = str.replace(token, match);
            });
        });

        return str;
    }

    highlightCpp(code) {
        const tokens = {
            comments: [],
            strings: [],
            keywords: [],
            functions: []
        };

        const tokenize = (type, match) => {
            const token = `__${type}_${tokens[type].length}__`;
            tokens[type].push({ token, match });
            return token;
        };

        let str = code.replace(/</g, "&lt;").replace(/>/g, "&gt;");

        // Highlight comments
        const highlightComments = (str) => {
            return str.replace(/(\/\/[^\n]*|\/\*[\s\S]*?\*\/)/g, match =>
                tokenize('comments', `<span style="color: #5c6690;">${match}</span>`)
            );
        };
        str = highlightComments(str);

        // Highlight strings (double quotes)
        const highlightStrings = (str) => {
            return str.replace(/"([^"]*)"/g, match =>
                tokenize('strings', `<span style="color: #4CAF50;">${match}</span>`)
            );
        };
        str = highlightStrings(str);

        // Highlight C++ keywords
        const highlightKeywords = (str) => {
            const cppKeywords = this.getKeywordsForLanguage('cpp');

            const regex = new RegExp(`\\b(${cppKeywords.join('|')})\\b`, 'g');
            return str.replace(regex, match =>
                tokenize('keywords', `<span style="color: #f5758d;">${match}</span>`)
            );
        };
        str = highlightKeywords(str);

        // Highlight function names
        const highlightFunctions = (str) => {
            return str.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g, match =>
                tokenize('functions', `<span style="color: #e6bd69;">${match}</span>`)
            );
        };
        str = highlightFunctions(str);

        // Restore all tokens
        Object.entries(tokens).forEach(([type, replacements]) => {
            replacements.forEach(({ token, match }) => {
                str = str.replace(token, match);
            });
        });

        return str;
    }

    highlightRuby(code) {
        const tokens = {
            comments: [],
            strings: [],
            keywords: [],
            functions: []
        };

        const tokenize = (type, match) => {
            const token = `__${type}_${tokens[type].length}__`;
            tokens[type].push({ token, match });
            return token;
        };

        let str = code.replace(/</g, "&lt;").replace(/>/g, "&gt;");

        // Highlight comments
        const highlightComments = (str) => {
            return str.replace(/(#.*?$)/gm, match =>
                tokenize('comments', `<span style="color: #5c6690;">${match}</span>`)
            );
        };
        str = highlightComments(str);

        // Highlight strings (single and double quotes)
        const highlightStrings = (str) => {
            return str.replace(/"([^"]*)"|'([^']*)'/g, match =>
                tokenize('strings', `<span style="color: #4CAF50;">${match}</span>`)
            );
        };
        str = highlightStrings(str);

        // Highlight Ruby keywords
        const highlightKeywords = (str) => {
            const rubyKeywords = this.getKeywordsForLanguage('ruby');

            const regex = new RegExp(`\\b(${rubyKeywords.join('|')})\\b`, 'g');
            return str.replace(regex, match =>
                tokenize('keywords', `<span style="color: #f5758d;">${match}</span>`)
            );
        };
        str = highlightKeywords(str);

        // Highlight function names
        const highlightFunctions = (str) => {
            return str.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g, match =>
                tokenize('functions', `<span style="color: #e6bd69;">${match}</span>`)
            );
        };
        str = highlightFunctions(str);

        // Restore all tokens
        Object.entries(tokens).forEach(([type, replacements]) => {
            replacements.forEach(({ token, match }) => {
                str = str.replace(token, match);
            });
        });

        return str;
    }

    highlightSwift(code) {
        const tokens = {
            comments: [],
            strings: [],
            keywords: [],
            functions: []
        };

        const tokenize = (type, match) => {
            const token = `__${type}_${tokens[type].length}__`;
            tokens[type].push({ token, match });
            return token;
        };

        let str = code.replace(/</g, "&lt;").replace(/>/g, "&gt;");

        // Highlight comments
        const highlightComments = (str) => {
            return str.replace(/(\/\/[^\n]*|\/\*[\s\S]*?\*\/)/g, match =>
                tokenize('comments', `<span style="color: #5c6690;">${match}</span>`)
            );
        };
        str = highlightComments(str);

        // Highlight strings (double quotes)
        const highlightStrings = (str) => {
            return str.replace(/"([^"]*)"/g, match =>
                tokenize('strings', `<span style="color: #4CAF50;">${match}</span>`)
            );
        };
        str = highlightStrings(str);

        // Highlight Swift keywords
        const highlightKeywords = (str) => {
            const swiftKeywords = this.getKeywordsForLanguage('swift');

            const regex = new RegExp(`\\b(${swiftKeywords.join('|')})\\b`, 'g');
            return str.replace(regex, match =>
                tokenize('keywords', `<span style="color: #f5758d;">${match}</span>`)
            );
        };
        str = highlightKeywords(str);

        // Highlight function names
        const highlightFunctions = (str) => {
            return str.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g, match =>
                tokenize('functions', `<span style="color: #e6bd69;">${match}</span>`)
            );
        };
        str = highlightFunctions(str);

        // Restore all tokens
        Object.entries(tokens).forEach(([type, replacements]) => {
            replacements.forEach(({ token, match }) => {
                str = str.replace(token, match);
            });
        });

        return str;
    }

    highlightGo(code) {
        const tokens = {
            comments: [],
            strings: [],
            keywords: [],
            functions: []
        };

        const tokenize = (type, match) => {
            const token = `__${type}_${tokens[type].length}__`;
            tokens[type].push({ token, match });
            return token;
        };

        let str = code.replace(/</g, "&lt;").replace(/>/g, "&gt;");

        // Highlight comments
        const highlightComments = (str) => {
            return str.replace(/(\/\/[^\n]*|\/\*[\s\S]*?\*\/)/g, match =>
                tokenize('comments', `<span style="color: #5c6690;">${match}</span>`)
            );
        };
        str = highlightComments(str);

        // Highlight strings (double quotes)
        const highlightStrings = (str) => {
            return str.replace(/"([^"]*)"/g, match =>
                tokenize('strings', `<span style="color: #4CAF50;">${match}</span>`)
            );
        };
        str = highlightStrings(str);

        // Highlight Go keywords
        const highlightKeywords = (str) => {
            const goKeywords = this.getKeywordsForLanguage('go');

            const regex = new RegExp(`\\b(${goKeywords.join('|')})\\b`, 'g');
            return str.replace(regex, match =>
                tokenize('keywords', `<span style="color: #f5758d;">${match}</span>`)
            );
        };
        str = highlightKeywords(str);

        // Highlight function names
        const highlightFunctions = (str) => {
            return str.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g, match =>
                tokenize('functions', `<span style="color: #e6bd69;">${match}</span>`)
            );
        };
        str = highlightFunctions(str);

        // Restore all tokens
        Object.entries(tokens).forEach(([type, replacements]) => {
            replacements.forEach(({ token, match }) => {
                str = str.replace(token, match);
            });
        });

        return str;
    }

    highlightRust(code) {
        const tokens = {
            comments: [],
            strings: [],
            keywords: [],
            functions: []
        };

        const tokenize = (type, match) => {
            const token = `__${type}_${tokens[type].length}__`;
            tokens[type].push({ token, match });
            return token;
        };

        let str = code.replace(/</g, "&lt;").replace(/>/g, "&gt;");

        // Highlight comments
        const highlightComments = (str) => {
            return str.replace(/(\/\/[^\n]*|\/\*[\s\S]*?\*\/)/g, match =>
                tokenize('comments', `<span style="color: #5c6690;">${match}</span>`)
            );
        };
        str = highlightComments(str);

        // Highlight strings (double quotes)
        const highlightStrings = (str) => {
            return str.replace(/"([^"]*)"/g, match =>
                tokenize('strings', `<span style="color: #4CAF50;">${match}</span>`)
            );
        };
        str = highlightStrings(str);

        // Highlight Rust keywords
        const highlightKeywords = (str) => {
            const rustKeywords = this.getKeywordsForLanguage('rust');

            const regex = new RegExp(`\\b(${rustKeywords.join('|')})\\b`, 'g');
            return str.replace(regex, match =>
                tokenize('keywords', `<span style="color: #f5758d;">${match}</span>`)
            );
        };
        str = highlightKeywords(str);

        // Highlight function names
        const highlightFunctions = (str) => {
            return str.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g, match =>
                tokenize('functions', `<span style="color: #e6bd69;">${match}</span>`)
            );
        };
        str = highlightFunctions(str);

        // Restore all tokens
        Object.entries(tokens).forEach(([type, replacements]) => {
            replacements.forEach(({ token, match }) => {
                str = str.replace(token, match);
            });
        });

        return str;
    }

    highlightKotlin(code) {
        const tokens = {
            comments: [],
            strings: [],
            keywords: [],
            functions: []
        };

        const tokenize = (type, match) => {
            const token = `__${type}_${tokens[type].length}__`;
            tokens[type].push({ token, match });
            return token;
        };

        let str = code.replace(/</g, "&lt;").replace(/>/g, "&gt;");

        // Highlight comments
        const highlightComments = (str) => {
            return str.replace(/(\/\/[^\n]*|\/\*[\s\S]*?\*\/)/g, match =>
                tokenize('comments', `<span style="color: #5c6690;">${match}</span>`)
            );
        };
        str = highlightComments(str);

        // Highlight strings (double quotes)
        const highlightStrings = (str) => {
            return str.replace(/"([^"]*)"/g, match =>
                tokenize('strings', `<span style="color: #4CAF50;">${match}</span>`)
            );
        };
        str = highlightStrings(str);

        // Highlight Kotlin keywords
        const highlightKeywords = (str) => {
            const kotlinKeywords = this.getKeywordsForLanguage('kotlin');

            const regex = new RegExp(`\\b(${kotlinKeywords.join('|')})\\b`, 'g');
            return str.replace(regex, match =>
                tokenize('keywords', `<span style="color: #f5758d;">${match}</span>`)
            );
        };
        str = highlightKeywords(str);

        // Highlight function names
        const highlightFunctions = (str) => {
            return str.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g, match =>
                tokenize('functions', `<span style="color: #e6bd69;">${match}</span>`)
            );
        };
        str = highlightFunctions(str);

        // Restore all tokens
        Object.entries(tokens).forEach(([type, replacements]) => {
            replacements.forEach(({ token, match }) => {
                str = str.replace(token, match);
            });
        });

        return str;
    }

    highlightScala(code) {
        const tokens = {
            comments: [],
            strings: [],
            keywords: [],
            functions: []
        };

        const tokenize = (type, match) => {
            const token = `__${type}_${tokens[type].length}__`;
            tokens[type].push({ token, match });
            return token;
        };

        let str = code.replace(/</g, "&lt;").replace(/>/g, "&gt;");

        // Highlight comments
        const highlightComments = (str) => {
            return str.replace(/(\/\/.*?$|\/\*[\s\S]*?\*\/)/gm, match =>
                tokenize('comments', `<span style="color: #5c6690;">${match}</span>`)
            );
        };
        str = highlightComments(str);

        // Highlight strings
        const highlightStrings = (str) => {
            return str.replace(/("""[\s\S]*?"""|'''[\s\S]*?'''|"[^"]*"|'[^']*')/g, match =>
                tokenize('strings', `<span style="color: #4CAF50;">${match}</span>`)
            );
        };
        str = highlightStrings(str);

        // Highlight Scala keywords
        const highlightKeywords = (str) => {
            const keywords = getKeywordsForLanguage("scala");
            const regex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
            return str.replace(regex, match =>
                tokenize('keywords', `<span style="color: #f5758d;">${match}</span>`)
            );
        };
        str = highlightKeywords(str);

        // Highlight functions
        const highlightFunctions = (str) => {
            return str.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g, match =>
                tokenize('functions', `<span style="color: #e6bd69;">${match}</span>`)
            );
        };
        str = highlightFunctions(str);

        // Restore all tokens
        Object.entries(tokens).forEach(([type, replacements]) => {
            replacements.forEach(({ token, match }) => {
                str = str.replace(token, match);
            });
        });

        return str;
    }

    highlightLua(code) {
        const tokens = {
            comments: [],
            strings: [],
            keywords: [],
            functions: []
        };

        const tokenize = (type, match) => {
            const token = `__${type}_${tokens[type].length}__`;
            tokens[type].push({ token, match });
            return token;
        };

        let str = code.replace(/</g, "&lt;").replace(/>/g, "&gt;");

        // Highlight comments
        const highlightComments = (str) => {
            return str.replace(/(--.*?$|--[\s\S]*?--)/gm, match =>
                tokenize('comments', `<span style="color: #5c6690;">${match}</span>`)
            );
        };
        str = highlightComments(str);

        // Highlight strings
        const highlightStrings = (str) => {
            return str.replace(/(["][^"]*["]|['][^']*['])/g, match =>
                tokenize('strings', `<span style="color: #4CAF50;">${match}</span>`)
            );
        };
        str = highlightStrings(str);

        // Highlight Lua keywords
        const highlightKeywords = (str) => {
            const keywords = getKeywordsForLanguage("lua");
            const regex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
            return str.replace(regex, match =>
                tokenize('keywords', `<span style="color: #f5758d;">${match}</span>`)
            );
        };
        str = highlightKeywords(str);

        // Highlight functions
        const highlightFunctions = (str) => {
            return str.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g, match =>
                tokenize('functions', `<span style="color: #e6bd69;">${match}</span>`)
            );
        };
        str = highlightFunctions(str);

        // Restore all tokens
        Object.entries(tokens).forEach(([type, replacements]) => {
            replacements.forEach(({ token, match }) => {
                str = str.replace(token, match);
            });
        });

        return str;
    }

    highlightPerl(code) {
        const tokens = {
            comments: [],
            strings: [],
            keywords: [],
            functions: []
        };

        const tokenize = (type, match) => {
            const token = `__${type}_${tokens[type].length}__`;
            tokens[type].push({ token, match });
            return token;
        };

        let str = code.replace(/</g, "&lt;").replace(/>/g, "&gt;");

        // Highlight comments
        const highlightComments = (str) => {
            return str.replace(/(#.*?$)/gm, match =>
                tokenize('comments', `<span style="color: #5c6690;">${match}</span>`)
            );
        };
        str = highlightComments(str);

        // Highlight strings
        const highlightStrings = (str) => {
            return str.replace(/(["][^"]*["]|['][^']*['])/g, match =>
                tokenize('strings', `<span style="color: #4CAF50;">${match}</span>`)
            );
        };
        str = highlightStrings(str);

        // Highlight Perl keywords
        const highlightKeywords = (str) => {
            const keywords = getKeywordsForLanguage("perl");
            const regex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
            return str.replace(regex, match =>
                tokenize('keywords', `<span style="color: #f5758d;">${match}</span>`)
            );
        };
        str = highlightKeywords(str);

        // Highlight functions
        const highlightFunctions = (str) => {
            return str.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g, match =>
                tokenize('functions', `<span style="color: #e6bd69;">${match}</span>`)
            );
        };
        str = highlightFunctions(str);

        // Restore all tokens
        Object.entries(tokens).forEach(([type, replacements]) => {
            replacements.forEach(({ token, match }) => {
                str = str.replace(token, match);
            });
        });

        return str;
    }

    highlightTypeScript(code) {
        const tokens = {
            comments: [],
            strings: [],
            keywords: [],
            functions: []
        };

        const tokenize = (type, match) => {
            const token = `__${type}_${tokens[type].length}__`;
            tokens[type].push({ token, match });
            return token;
        };

        let str = code.replace(/</g, "&lt;").replace(/>/g, "&gt;");

        // Highlight comments
        const highlightComments = (str) => {
            return str.replace(/(\/\/.*?$|\/\*[\s\S]*?\*\/)/gm, match =>
                tokenize('comments', `<span style="color: #5c6690;">${match}</span>`)
            );
        };
        str = highlightComments(str);

        // Highlight strings
        const highlightStrings = (str) => {
            return str.replace(/(["][^"]*["]|['][^']*['])/g, match =>
                tokenize('strings', `<span style="color: #4CAF50;">${match}</span>`)
            );
        };
        str = highlightStrings(str);

        // Highlight TypeScript keywords
        const highlightKeywords = (str) => {
            const keywords = getKeywordsForLanguage("typescript");
            const regex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
            return str.replace(regex, match =>
                tokenize('keywords', `<span style="color: #f5758d;">${match}</span>`)
            );
        };
        str = highlightKeywords(str);

        // Highlight functions
        const highlightFunctions = (str) => {
            return str.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g, match =>
                tokenize('functions', `<span style="color: #e6bd69;">${match}</span>`)
            );
        };
        str = highlightFunctions(str);

        // Restore all tokens
        Object.entries(tokens).forEach(([type, replacements]) => {
            replacements.forEach(({ token, match }) => {
                str = str.replace(token, match);
            });
        });

        return str;
    }

    highlightObjectiveC(code) {
        const tokens = {
            comments: [],
            strings: [],
            keywords: [],
            functions: []
        };

        const tokenize = (type, match) => {
            const token = `__${type}_${tokens[type].length}__`;
            tokens[type].push({ token, match });
            return token;
        };

        let str = code.replace(/</g, "&lt;").replace(/>/g, "&gt;");

        // Highlight comments
        const highlightComments = (str) => {
            return str.replace(/(\/\/.*?$|\/\*[\s\S]*?\*\/)/gm, match =>
                tokenize('comments', `<span style="color: #5c6690;">${match}</span>`)
            );
        };
        str = highlightComments(str);

        // Highlight strings
        const highlightStrings = (str) => {
            return str.replace(/(["][^"]*["]|['][^']*['])/g, match =>
                tokenize('strings', `<span style="color: #4CAF50;">${match}</span>`)
            );
        };
        str = highlightStrings(str);

        // Highlight Objective-C keywords
        const highlightKeywords = (str) => {
            const keywords = getKeywordsForLanguage("objective-c");
            const regex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
            return str.replace(regex, match =>
                tokenize('keywords', `<span style="color: #f5758d;">${match}</span>`)
            );
        };
        str = highlightKeywords(str);

        // Highlight functions
        const highlightFunctions = (str) => {
            return str.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g, match =>
                tokenize('functions', `<span style="color: #e6bd69;">${match}</span>`)
            );
        };
        str = highlightFunctions(str);

        // Restore all tokens
        Object.entries(tokens).forEach(([type, replacements]) => {
            replacements.forEach(({ token, match }) => {
                str = str.replace(token, match);
            });
        });

        return str;
    }

    highlightBash(code) {
        const tokens = {
            comments: [],
            strings: [],
            keywords: [],
            functions: []
        };

        const tokenize = (type, match) => {
            const token = `__${type}_${tokens[type].length}__`;
            tokens[type].push({ token, match });
            return token;
        };

        let str = code.replace(/</g, "&lt;").replace(/>/g, "&gt;");

        // Highlight comments
        const highlightComments = (str) => {
            return str.replace(/(#.*?$)/gm, match =>
                tokenize('comments', `<span style="color: #5c6690;">${match}</span>`)
            );
        };
        str = highlightComments(str);

        // Highlight strings
        const highlightStrings = (str) => {
            return str.replace(/(["][^"]*["]|['][^']*['])/g, match =>
                tokenize('strings', `<span style="color: #4CAF50;">${match}</span>`)
            );
        };
        str = highlightStrings(str);

        // Highlight Bash keywords
        const highlightKeywords = (str) => {
            const keywords = getKeywordsForLanguage("bash");
            const regex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
            return str.replace(regex, match =>
                tokenize('keywords', `<span style="color: #f5758d;">${match}</span>`)
            );
        };
        str = highlightKeywords(str);

        // Restore all tokens
        Object.entries(tokens).forEach(([type, replacements]) => {
            replacements.forEach(({ token, match }) => {
                str = str.replace(token, match);
            });
        });

        return str;
    }

    highlightHaskell(code) {
        const tokens = {
            comments: [],
            strings: [],
            keywords: [],
            functions: []
        };

        const tokenize = (type, match) => {
            const token = `__${type}_${tokens[type].length}__`;
            tokens[type].push({ token, match });
            return token;
        };

        let str = code.replace(/</g, "&lt;").replace(/>/g, "&gt;");

        // Highlight comments
        const highlightComments = (str) => {
            return str.replace(/(--.*?$)/gm, match =>
                tokenize('comments', `<span style="color: #5c6690;">${match}</span>`)
            );
        };
        str = highlightComments(str);

        // Highlight strings
        const highlightStrings = (str) => {
            return str.replace(/(["][^"]*["]|['][^']*['])/g, match =>
                tokenize('strings', `<span style="color: #4CAF50;">${match}</span>`)
            );
        };
        str = highlightStrings(str);

        // Highlight Haskell keywords
        const highlightKeywords = (str) => {
            const keywords = getKeywordsForLanguage("haskell");
            const regex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
            return str.replace(regex, match =>
                tokenize('keywords', `<span style="color: #f5758d;">${match}</span>`)
            );
        };
        str = highlightKeywords(str);

        // Restore all tokens
        Object.entries(tokens).forEach(([type, replacements]) => {
            replacements.forEach(({ token, match }) => {
                str = str.replace(token, match);
            });
        });

        return str;
    }

    highlightDart(code) {
        const tokens = {
            comments: [],
            strings: [],
            keywords: [],
            functions: []
        };

        const tokenize = (type, match) => {
            const token = `__${type}_${tokens[type].length}__`;
            tokens[type].push({ token, match });
            return token;
        };

        let str = code.replace(/</g, "&lt;").replace(/>/g, "&gt;");

        // Highlight comments
        const highlightComments = (str) => {
            return str.replace(/(\/\/.*?$|\/\*[\s\S]*?\*\/)/gm, match =>
                tokenize('comments', `<span style="color: #5c6690;">${match}</span>`)
            );
        };
        str = highlightComments(str);

        // Highlight strings
        const highlightStrings = (str) => {
            return str.replace(/(["][^"]*["]|['][^']*['])/g, match =>
                tokenize('strings', `<span style="color: #4CAF50;">${match}</span>`)
            );
        };
        str = highlightStrings(str);

        // Highlight Dart keywords
        const highlightKeywords = (str) => {
            const keywords = getKeywordsForLanguage("dart");
            const regex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
            return str.replace(regex, match =>
                tokenize('keywords', `<span style="color: #f5758d;">${match}</span>`)
            );
        };
        str = highlightKeywords(str);

        // Restore all tokens
        Object.entries(tokens).forEach(([type, replacements]) => {
            replacements.forEach(({ token, match }) => {
                str = str.replace(token, match);
            });
        });

        return str;
    }

    highlightElixir(code) {
        const tokens = {
            comments: [],
            strings: [],
            keywords: [],
            functions: []
        };

        const tokenize = (type, match) => {
            const token = `__${type}_${tokens[type].length}__`;
            tokens[type].push({ token, match });
            return token;
        };

        let str = code.replace(/</g, "&lt;").replace(/>/g, "&gt;");

        // Highlight comments
        const highlightComments = (str) => {
            return str.replace(/(#.*?$)/gm, match =>
                tokenize('comments', `<span style="color: #5c6690;">${match}</span>`)
            );
        };
        str = highlightComments(str);

        // Highlight strings
        const highlightStrings = (str) => {
            return str.replace(/(["][^"]*["]|['][^']*['])/g, match =>
                tokenize('strings', `<span style="color: #4CAF50;">${match}</span>`)
            );
        };
        str = highlightStrings(str);

        // Highlight Elixir keywords
        const highlightKeywords = (str) => {
            const keywords = getKeywordsForLanguage("elixir");
            const regex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
            return str.replace(regex, match =>
                tokenize('keywords', `<span style="color: #f5758d;">${match}</span>`)
            );
        };
        str = highlightKeywords(str);

        // Restore all tokens
        Object.entries(tokens).forEach(([type, replacements]) => {
            replacements.forEach(({ token, match }) => {
                str = str.replace(token, match);
            });
        });

        return str;
    }

    highlightFSharp(code) {
        const tokens = {
            comments: [],
            strings: [],
            keywords: [],
            functions: []
        };

        const tokenize = (type, match) => {
            const token = `__${type}_${tokens[type].length}__`;
            tokens[type].push({ token, match });
            return token;
        };

        let str = code.replace(/</g, "&lt;").replace(/>/g, "&gt;");

        // Highlight comments
        const highlightComments = (str) => {
            return str.replace(/(\/\/.*?$|\/\*[\s\S]*?\*\/)/gm, match =>
                tokenize('comments', `<span style="color: #5c6690;">${match}</span>`)
            );
        };
        str = highlightComments(str);

        // Highlight strings
        const highlightStrings = (str) => {
            return str.replace(/(["][^"]*["]|['][^']*['])/g, match =>
                tokenize('strings', `<span style="color: #4CAF50;">${match}</span>`)
            );
        };
        str = highlightStrings(str);

        // Highlight F# keywords
        const highlightKeywords = (str) => {
            const keywords = getKeywordsForLanguage("f#");
            const regex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
            return str.replace(regex, match =>
                tokenize('keywords', `<span style="color: #f5758d;">${match}</span>`)
            );
        };
        str = highlightKeywords(str);

        // Restore all tokens
        Object.entries(tokens).forEach(([type, replacements]) => {
            replacements.forEach(({ token, match }) => {
                str = str.replace(token, match);
            });
        });

        return str;
    }

    highlightVHDL(code) {
        const tokens = {
            comments: [],
            strings: [],
            keywords: [],
            functions: []
        };

        const tokenize = (type, match) => {
            const token = `__${type}_${tokens[type].length}__`;
            tokens[type].push({ token, match });
            return token;
        };

        let str = code.replace(/</g, "&lt;").replace(/>/g, "&gt;");

        // Highlight comments
        const highlightComments = (str) => {
            return str.replace(/(--.*?$)/gm, match =>
                tokenize('comments', `<span style="color: #5c6690;">${match}</span>`)
            );
        };
        str = highlightComments(str);

        // Highlight strings
        const highlightStrings = (str) => {
            return str.replace(/(["][^"]*["]|['][^']*['])/g, match =>
                tokenize('strings', `<span style="color: #4CAF50;">${match}</span>`)
            );
        };
        str = highlightStrings(str);

        // Highlight VHDL keywords
        const highlightKeywords = (str) => {
            const keywords = getKeywordsForLanguage("vhdl");
            const regex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
            return str.replace(regex, match =>
                tokenize('keywords', `<span style="color: #f5758d;">${match}</span>`)
            );
        };
        str = highlightKeywords(str);

        // Restore all tokens
        Object.entries(tokens).forEach(([type, replacements]) => {
            replacements.forEach(({ token, match }) => {
                str = str.replace(token, match);
            });
        });

        return str;
    }

    highlightSQL(code) {
        const tokens = {
            comments: [],
            strings: [],
            keywords: [],
            functions: []
        };

        const tokenize = (type, match) => {
            const token = `__${type}_${tokens[type].length}__`;
            tokens[type].push({ token, match });
            return token;
        };

        let str = code.replace(/</g, "&lt;").replace(/>/g, "&gt;");

        // Highlight comments
        const highlightComments = (str) => {
            return str.replace(/(\/\*[\s\S]*?\*\/|--.*?$)/gm, match =>
                tokenize('comments', `<span style="color: #5c6690;">${match}</span>`)
            );
        };
        str = highlightComments(str);

        // Highlight strings
        const highlightStrings = (str) => {
            return str.replace(/(["][^"]*["]|['][^']*['])/g, match =>
                tokenize('strings', `<span style="color: #4CAF50;">${match}</span>`)
            );
        };
        str = highlightStrings(str);

        // Highlight SQL keywords
        const highlightKeywords = (str) => {
            const keywords = getKeywordsForLanguage("sql");
            const regex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
            return str.replace(regex, match =>
                tokenize('keywords', `<span style="color: #f5758d;">${match}</span>`)
            );
        };
        str = highlightKeywords(str);

        // Restore all tokens
        Object.entries(tokens).forEach(([type, replacements]) => {
            replacements.forEach(({ token, match }) => {
                str = str.replace(token, match);
            });
        });

        return str;
    }

    highlightR(code) {
        const tokens = {
            comments: [],
            strings: [],
            keywords: [],
            functions: []
        };

        const tokenize = (type, match) => {
            const token = `__${type}_${tokens[type].length}__`;
            tokens[type].push({ token, match });
            return token;
        };

        let str = code.replace(/</g, "&lt;").replace(/>/g, "&gt;");

        // Highlight comments
        const highlightComments = (str) => {
            return str.replace(/#.*$/gm, match =>
                tokenize('comments', `<span style="color: #5c6690;">${match}</span>`)
            );
        };
        str = highlightComments(str);

        // Highlight strings
        const highlightStrings = (str) => {
            return str.replace(/(["][^"]*["]|['][^']*['])/g, match =>
                tokenize('strings', `<span style="color: #4CAF50;">${match}</span>`)
            );
        };
        str = highlightStrings(str);

        // Highlight R keywords
        const highlightKeywords = (str) => {
            const keywords = getKeywordsForLanguage("r");
            const regex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
            return str.replace(regex, match =>
                tokenize('keywords', `<span style="color: #f5758d;">${match}</span>`)
            );
        };
        str = highlightKeywords(str);

        // Restore all tokens
        Object.entries(tokens).forEach(([type, replacements]) => {
            replacements.forEach(({ token, match }) => {
                str = str.replace(token, match);
            });
        });

        return str;
    }

    highlightVala(code) {
        const tokens = {
            comments: [],
            strings: [],
            keywords: [],
            functions: []
        };

        const tokenize = (type, match) => {
            const token = `__${type}_${tokens[type].length}__`;
            tokens[type].push({ token, match });
            return token;
        };

        let str = code.replace(/</g, "&lt;").replace(/>/g, "&gt;");

        // Highlight comments
        const highlightComments = (str) => {
            return str.replace(/(\/\/[^\n]*|\/\*[\s\S]*?\*\/)/gm, match =>
                tokenize('comments', `<span style="color: #5c6690;">${match}</span>`)
            );
        };
        str = highlightComments(str);

        // Highlight strings
        const highlightStrings = (str) => {
            return str.replace(/(["][^"]*["]|['][^']*['])/g, match =>
                tokenize('strings', `<span style="color: #4CAF50;">${match}</span>`)
            );
        };
        str = highlightStrings(str);

        // Highlight Vala keywords
        const highlightKeywords = (str) => {
            const valaKeywords = this.getKeywordsForLanguage('vala');
            const regex = new RegExp(`\\b(${valaKeywords.join('|')})\\b`, 'g');
            return str.replace(regex, match =>
                tokenize('keywords', `<span style="color: #f5758d;">${match}</span>`)
            );
        };
        str = highlightKeywords(str);

        // Restore all tokens
        Object.entries(tokens).forEach(([type, replacements]) => {
            replacements.forEach(({ token, match }) => {
                str = str.replace(token, match);
            });
        });

        return str;
    }

    highlightJulia(code) {
        const tokens = {
            comments: [],
            strings: [],
            keywords: [],
            functions: []
        };

        const tokenize = (type, match) => {
            const token = `__${type}_${tokens[type].length}__`;
            tokens[type].push({ token, match });
            return token;
        };

        let str = code.replace(/</g, "&lt;").replace(/>/g, "&gt;");

        // Highlight comments
        const highlightComments = (str) => {
            return str.replace(/(\/\/[^\n]*|\/\*[\s\S]*?\*\/)/gm, match =>
                tokenize('comments', `<span style="color: #5c6690;">${match}</span>`)
            );
        };
        str = highlightComments(str);

        // Highlight strings
        const highlightStrings = (str) => {
            return str.replace(/(["][^"]*["]|['][^']*['])/g, match =>
                tokenize('strings', `<span style="color: #4CAF50;">${match}</span>`)
            );
        };
        str = highlightStrings(str);

        // Highlight Julia keywords
        const highlightKeywords = (str) => {
            const juliaKeywords = this.getKeywordsForLanguage('julia');
            const regex = new RegExp(`\\b(${juliaKeywords.join('|')})\\b`, 'g');
            return str.replace(regex, match =>
                tokenize('keywords', `<span style="color: #f5758d;">${match}</span>`)
            );
        };
        str = highlightKeywords(str);

        // Restore all tokens
        Object.entries(tokens).forEach(([type, replacements]) => {
            replacements.forEach(({ token, match }) => {
                str = str.replace(token, match);
            });
        });

        return str;
    }

    highlightNim(code) {
        const tokens = {
            comments: [],
            strings: [],
            keywords: [],
            functions: []
        };

        const tokenize = (type, match) => {
            const token = `__${type}_${tokens[type].length}__`;
            tokens[type].push({ token, match });
            return token;
        };

        let str = code.replace(/</g, "&lt;").replace(/>/g, "&gt;");

        // Highlight comments
        const highlightComments = (str) => {
            return str.replace(/(\/\/[^\n]*|\/\*[\s\S]*?\*\/)/gm, match =>
                tokenize('comments', `<span style="color: #5c6690;">${match}</span>`)
            );
        };
        str = highlightComments(str);

        // Highlight strings
        const highlightStrings = (str) => {
            return str.replace(/(["][^"]*["]|['][^']*['])/g, match =>
                tokenize('strings', `<span style="color: #4CAF50;">${match}</span>`)
            );
        };
        str = highlightStrings(str);

        // Highlight Nim keywords
        const highlightKeywords = (str) => {
            const nimKeywords = this.getKeywordsForLanguage('nim');
            const regex = new RegExp(`\\b(${nimKeywords.join('|')})\\b`, 'g');
            return str.replace(regex, match =>
                tokenize('keywords', `<span style="color: #f5758d;">${match}</span>`)
            );
        };
        str = highlightKeywords(str);

        // Restore all tokens
        Object.entries(tokens).forEach(([type, replacements]) => {
            replacements.forEach(({ token, match }) => {
                str = str.replace(token, match);
            });
        });

        return str;
    }

    highlightPowerShell(code) {
        const tokens = {
            comments: [],
            strings: [],
            keywords: [],
            functions: []
        };

        const tokenize = (type, match) => {
            const token = `__${type}_${tokens[type].length}__`;
            tokens[type].push({ token, match });
            return token;
        };

        let str = code.replace(/</g, "&lt;").replace(/>/g, "&gt;");

        // Highlight comments
        const highlightComments = (str) => {
            return str.replace(/(#.*?$|\/\*[\s\S]*?\*\/)/gm, match =>
                tokenize('comments', `<span style="color: #5c6690;">${match}</span>`)
            );
        };
        str = highlightComments(str);

        // Highlight strings
        const highlightStrings = (str) => {
            return str.replace(/(["][^"]*["]|['][^']*['])/g, match =>
                tokenize('strings', `<span style="color: #4CAF50;">${match}</span>`)
            );
        };
        str = highlightStrings(str);

        // Highlight PowerShell keywords
        const highlightKeywords = (str) => {
            const powershellKeywords = this.getKeywordsForLanguage('powershell');
            const regex = new RegExp(`\\b(${powershellKeywords.join('|')})\\b`, 'g');
            return str.replace(regex, match =>
                tokenize('keywords', `<span style="color: #f5758d;">${match}</span>`)
            );
        };
        str = highlightKeywords(str);

        // Restore all tokens
        Object.entries(tokens).forEach(([type, replacements]) => {
            replacements.forEach(({ token, match }) => {
                str = str.replace(token, match);
            });
        });

        return str;
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
            ],
            php: [
                'if', 'else', 'elseif', 'for', 'foreach', 'while', 'do', 'switch', 'case', 'default',
                'break', 'continue', 'return', 'function', 'class', 'public', 'private', 'protected',
                'static', 'new', 'try', 'catch', 'throw', 'namespace', 'use', 'global', 'var', 'const', 'isset',
                'empty', 'require', 'require_once', 'include', 'include_once', 'echo', 'print', 'exit', 'die'
            ],
            c: [
                'auto', 'break', 'case', 'char', 'const', 'continue', 'default', 'do', 'double', 'else', 'enum',
                'extern', 'float', 'for', 'goto', 'if', 'inline', 'int', 'long', 'register', 'return', 'short',
                'signed', 'sizeof', 'static', 'struct', 'switch', 'typedef', 'union', 'unsigned', 'void', 'volatile',
                'while'
            ],
            cpp: [
                'alignas', 'alignof', 'and', 'and_eq', 'asm', 'auto', 'bitand', 'bitor', 'bool', 'break', 'case',
                'catch', 'char', 'class', 'compl', 'const', 'constexpr', 'const_cast', 'continue', 'decltype', 'default',
                'delete', 'do', 'double', 'dynamic_cast', 'else', 'enum', 'explicit', 'export', 'extern', 'false', 'final',
                'float', 'for', 'friend', 'goto', 'if', 'inline', 'int', 'long', 'mutable', 'namespace', 'new', 'noexcept',
                'not', 'not_eq', 'nullptr', 'operator', 'or', 'or_eq', 'private', 'protected', 'public', 'register', 'reinterpret_cast',
                'return', 'short', 'signed', 'sizeof', 'static', 'static_assert', 'static_cast', 'struct', 'switch', 'template',
                'this', 'throw', 'true', 'try', 'typedef', 'typeid', 'typename', 'union', 'unsigned', 'using', 'virtual', 'void',
                'volatile', 'wchar_t', 'while'
            ],
            ruby: [
                'def', 'end', 'if', 'else', 'elsif', 'unless', 'for', 'while', 'until', 'break', 'next', 'redo',
                'retry', 'return', 'class', 'module', 'begin', 'rescue', 'ensure', 'super', 'self', 'yield',
                'true', 'false', 'nil', 'and', 'or', 'not', 'require', 'include', 'private', 'protected', 'public'
            ],
            swift: [
                'func', 'let', 'var', 'return', 'if', 'else', 'switch', 'case', 'break', 'continue', 'for', 'while',
                'do', 'try', 'catch', 'class', 'struct', 'enum', 'protocol', 'extension', 'import', 'in', 'defer',
                'guard', 'fallthrough', 'repeat', 'init', 'deinit', 'self', 'super', 'nil', 'true', 'false'
            ],
            go: [
                'package', 'import', 'func', 'var', 'const', 'type', 'interface', 'struct', 'return', 'if', 'else',
                'for', 'switch', 'case', 'defer', 'go', 'select', 'break', 'continue', 'fallthrough', 'chan', 'range',
                'map', 'goto', 'len', 'cap', 'copy', 'append', 'interface', 'default', 'nil'
            ],
            rust: [
                'let', 'mut', 'fn', 'return', 'if', 'else', 'match', 'loop', 'for', 'while', 'break', 'continue',
                'pub', 'struct', 'enum', 'impl', 'trait', 'use', 'mod', 'self', 'super', 'const', 'static', 'ref',
                'move', 'box', 'drop', 'unsafe', 'match', 'Some', 'None', 'Result', 'Ok', 'Err', 'async', 'await'
            ],
            kotlin: [
                'fun', 'val', 'var', 'return', 'if', 'else', 'when', 'for', 'while', 'break', 'continue', 'try',
                'catch', 'finally', 'class', 'object', 'interface', 'package', 'import', 'in', 'out', 'null', 'true',
                'false', 'this', 'super', 'companion', 'constructor', 'init', 'is', 'as', 'by', 'dynamic'
            ],
            scala: [
                'val', 'var', 'def', 'class', 'object', 'trait', 'if', 'else', 'for', 'while', 'match', 'case',
                'return', 'throw', 'try', 'catch', 'finally', 'new', 'extends', 'implicit', 'private', 'protected',
                'sealed', 'import', 'package', 'this', 'super', 'true', 'false', 'null', 'def', 'final'
            ],
            lua: [
                'and', 'break', 'do', 'else', 'elseif', 'end', 'false', 'for', 'function', 'goto', 'if', 'in',
                'local', 'nil', 'not', 'or', 'repeat', 'return', 'then', 'true', 'until', 'while'
            ],
            perl: [
                'if', 'else', 'elsif', 'unless', 'foreach', 'for', 'while', 'do', 'continue', 'last', 'next',
                'sub', 'my', 'our', 'use', 'require', 'package', 'return', 'local', 'die', 'exit', 'eval'
            ],
            typescript: [
                'let', 'const', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'break', 'continue',
                'try', 'catch', 'class', 'new', 'this', 'import', 'export', 'async', 'await', 'any', 'unknown',
                'never', 'interface', 'type', 'extends', 'implements', 'public', 'private', 'protected'
            ],
            elixir: [
                'def', 'end', 'if', 'else', 'case', 'do', 'defmodule', 'defp', 'defmacro', 'import', 'use', 'super',
                'raise', 'try', 'catch', 'throw', 'async', 'await', 'nil', 'true', 'false', 'loop', 'fn', 'let',
                'in', 'when', 'after'
            ],
            fsharp: [
                'let', 'mutable', 'if', 'else', 'match', 'for', 'while', 'do', 'type', 'module', 'open', 'namespace',
                'return', 'in', 'async', 'await', 'new', 'try', 'catch', 'finally', 'use', 'abstract', 'interface',
                'abstract', 'type', 'static', 'class', 'public', 'private', 'protected'
            ],
            vhdl: [
                'architecture', 'begin', 'end', 'process', 'if', 'else', 'elsif', 'case', 'when', 'then', 'not', 'and',
                'or', 'in', 'out', 'buffer', 'signal', 'variable', 'type', 'constant', 'subtype', 'function', 'procedure',
                'entity', 'port', 'configuration'
            ],
            sql: [
                'SELECT', 'FROM', 'WHERE', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'OUTER', 'AND', 'OR', 'INSERT', 'UPDATE',
                'DELETE', 'CREATE', 'DROP', 'ALTER', 'INDEX', 'GROUP BY', 'HAVING', 'ORDER BY', 'DISTINCT', 'BETWEEN',
                'IN', 'LIKE', 'NULL', 'IS', 'EXISTS', 'AND', 'OR', 'NOT'
            ],
            r: [
                'if', 'else', 'for', 'while', 'repeat', 'break', 'next', 'return', 'function', 'TRUE', 'FALSE', 'NULL',
                'NA', 'Inf', 'NaN', 'tryCatch', 'try', 'stop', 'cat', 'library', 'require', 'install.packages', 'source',
                'setwd', 'getwd', 'print', 'plot', 'data.frame', 'matrix', 'list', 'vector', 'factor', 'tapply', 'apply',
                'lapply', 'sapply', 'mean', 'sum', 'sd', 'min', 'max', 'range', 'median', 'table', 'cor', 'cov', 'lm', 'glm',
                'anova', 'summary', 'factor', 'subset', 'merge', 'join'
            ],
            vala: [
                'namespace', 'class', 'private', 'public', 'protected', 'static', 'final', 'abstract', 'override',
                'virtual', 'new', 'delete', 'return', 'if', 'else', 'for', 'while', 'switch', 'case', 'try', 'catch',
                'throw', 'assert', 'this', 'super', 'void', 'true', 'false', 'null', 'var', 'let', 'const', 'foreach'
            ],
            julia: [
                'function', 'return', 'if', 'else', 'elseif', 'for', 'while', 'break', 'continue', 'try', 'catch',
                'let', 'global', 'const', 'mutable', 'module', 'using', 'import', 'export', 'type', 'abstract', 'immutable'
            ],
            nim: [
                'proc', 'var', 'let', 'const', 'type', 'if', 'else', 'elif', 'for', 'while', 'continue', 'break', 'return',
                'import', 'include', 'echo', 'assert', 'try', 'except', 'raise', 'dynamic', 'new', 'defer', 'global', 'static'
            ],
            powershell: [
                'function', 'return', 'if', 'else', 'elseif', 'for', 'foreach', 'while', 'switch', 'case', 'try', 'catch',
                'finally', 'throw', 'break', 'continue', 'import', 'export', 'let', 'in', 'global', 'true', 'false', 'null'
            ]
        };

        return keywords[language] || [];
    }

    copyToClipboard(button) {
        navigator.clipboard.writeText(this.code)
            .then(() => {
                // Change button text to show success
                button.textContent = "✔️";
                setTimeout(() => {
                    button.textContent = "📋";
                }, 1500);

                // Display custom success message (you can show this in a toast or alert)
                this.showCopyMessage(this.options.copySuccessMessage);
            })
            .catch(() => {
                // Show failure on button
                console.log('Failed to copy');
                button.textContent = "❌";
                setTimeout(() => {
                    button.textContent = "📋";
                }, 1500);

                // Display the error message
                this.showCopyMessage(this.options.errorMessage);
            });
    }

    showCopyMessage(message) {
        const messageBox = document.createElement("div");
        messageBox.textContent = message;
        messageBox.style.position = "fixed";
        messageBox.style.bottom = "20px";
        messageBox.style.left = "50%";
        messageBox.style.transform = "translateX(-50%)";
        messageBox.style.backgroundColor = "#333";
        messageBox.style.color = "#fff";
        messageBox.style.padding = "10px 20px";
        messageBox.style.borderRadius = "5px";
        messageBox.style.fontSize = "14px";
        messageBox.style.zIndex = 9999;

        document.body.appendChild(messageBox);

        setTimeout(() => {
            document.body.removeChild(messageBox);
        }, 3000);
    }

}

export default SnippyCopy;