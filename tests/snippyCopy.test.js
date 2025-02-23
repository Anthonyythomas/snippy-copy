import SnippyCopy from '../src/snippy-copy';

global.navigator.clipboard = {
    writeText: jest.fn(),
};

describe('SnippyCopy Class Javascript', () => {
    let snippy;

    beforeEach(() => {
        document.body.innerHTML = `<div id="test-container"></div>`;

        snippy = new SnippyCopy("#test-container", "const x = 10;", "javascript");
        window.alert = jest.fn();
    });

    it('should initialize the SnippyCopy class', () => {
        expect(snippy).toBeInstanceOf(SnippyCopy);
        expect(snippy.selector).toBe("#test-container");
        expect(snippy.code).toBe("const x = 10;");
    });

    it('should add a caption if provided in options', () => {
        snippy = new SnippyCopy("#test-container", "const x = 10;", "javascript", { caption: "Test Code" });
        const caption = document.querySelector("p");
        expect(caption).not.toBeNull();
        expect(caption.textContent).toBe("Test Code");
    });

    it('should highlight code when the highlight option is true', () => {
        snippy = new SnippyCopy("#test-container", "const x = 10;", "javascript", { highlight: true });
        const codeElement = document.querySelector("code");
        expect(codeElement.innerHTML).toContain('<span class="js-keyword">const</span> <span class="js-variable">x</span> <span class="js-delimiter">=</span> <span class="js-number">10</span>');
    });

    it('should not highlight code when the highlight option is false', () => {
        snippy = new SnippyCopy("#test-container", "const x = 10;", "javascript", { highlight: false });
        const codeElement = document.querySelector("code");
        expect(codeElement.innerHTML).toBe("const x = 10;");
    });

    it('should add a copy button if noCopy option is false', () => {
        snippy = new SnippyCopy("#test-container", "const x = 10;", "javascript", { noCopy: false });
        const button = document.querySelector("button.copy-btn");
        expect(button).not.toBeNull();
        expect(button.textContent).toBe('📋');
    });

    it('should not add a copy button if noCopy option is true', () => {
        snippy = new SnippyCopy("#test-container", "const x = 10;", "javascript", { noCopy: true });
        const button = document.querySelector("button.copy-btn");
        expect(button).toBeNull();
    });

    it('should use the provided theme for code snippet', () => {
        snippy = new SnippyCopy("#test-container", "const x = 10;", "javascript", { theme: "dark" });
        const preElement = document.querySelector("pre");
        expect(preElement.classList.contains("dark")).toBe(true);
    });
});

describe('SnippyCopy Class Clipboard', () => {
    let snippy;

    beforeEach(() => {
        document.body.innerHTML = `<div id="test-container"></div>`;

        snippy = new SnippyCopy("#test-container", "const x = 10;", "javascript");
        window.alert = jest.fn();
    });

    it('should copy text to clipboard and update button text on success', async () => {
        const button = document.createElement('button');
        button.classList.add('copy-btn');
        button.textContent = '📋';
        document.body.appendChild(button);

        // Mock the clipboard method to resolve successfully
        navigator.clipboard.writeText.mockResolvedValueOnce();

        // Use fake timers
        jest.useFakeTimers();

        // Call the copyToClipboard method
        await snippy.copyToClipboard(button);

        // Check that the button text changed to "✔️"
        expect(button.textContent).toBe('✔️');

        // Simulate the timeout of 1500ms and check the final text
        jest.advanceTimersByTime(1500);

        expect(button.textContent).toBe('📋');
    });

    it('should show an error when clipboard copy fails and update button text on failure', async () => {
        const button = document.createElement('button');
        button.classList.add('copy-btn');
        button.textContent = '📋';
        document.body.appendChild(button);

        // Mock the clipboard method to reject
        navigator.clipboard.writeText.mockRejectedValueOnce(new Error('Failed to copy'));

        // Call the copyToClipboard method and await it
        await snippy.copyToClipboard(button);

        // Wait for the timeout inside the copyToClipboard method to finish
        await new Promise(resolve => setTimeout(resolve, 1500));

        expect(button.textContent).toBe('❌');
    });
});

describe('SnippyCopy.highlightHTML', () => {
    let snippy;

    beforeEach(() => {
        document.body.innerHTML = `<div id="test-container"></div>`;
        snippy = new SnippyCopy("#test-container", "", "html");
    });

    test('should highlight HTML comments correctly', () => {
        const input = '<!-- This is a comment -->';
        const expectedOutput = '<span style="color: #5c6690;">&lt;!-- This is a comment --&gt;</span>';
        expect(snippy.highlightHTML(input)).toContain(expectedOutput);
    });

    test('should highlight DOCTYPE correctly', () => {
        const input = '<!DOCTYPE html>';
        const expectedOutput = '<span style="color: #e6bd69;">&lt;!DOCTYPE html&gt;</span>';
        expect(snippy.highlightHTML(input)).toContain(expectedOutput);
    });

    test('should highlight HTML tags correctly', () => {
        const input = '<h1>Hello</h1>';
        const expectedTagOpen = '<span style="color: #f5758d;">&lt;h1&gt;</span>';
        const expectedTagClose = '<span style="color: #f5758d;">&lt;/h1&gt;</span>';
        const output = snippy.highlightHTML(input);
        expect(output).toContain(expectedTagOpen);
        expect(output).toContain(expectedTagClose);
    });
});

describe('SnippyCopy Class CSS', () => {
    let snippy;

    beforeEach(() => {
        document.body.innerHTML = `<div id="test-container"></div>`;

        const css = `
            .code-line {
                display: flex;
                color: red;
                width: 100px;
            }
            /* This is a comment */
            .line-content {
                padding: 10px;
            }
        `;

        snippy = new SnippyCopy("#test-container", css, "css");
        window.alert = jest.fn();
    });

    it('should highlight comments correctly', () => {
        const highlighted = snippy.highlightCSS("/* This is a comment */");
        expect(highlighted).toContain('<span style="color: #5c6690;">/* This is a comment */</span>');
    });

    it('should highlight CSS properties correctly', () => {
        const highlighted = snippy.highlightCSS("color: red;");
        expect(highlighted).toContain('<span style="color: #e6bd69;">color</span>:');
    });

    it('should highlight CSS selectors correctly', () => {
        const highlighted = snippy.highlightCSS(".code-line { display: flex; }");
        expect(highlighted).toContain('<span style="color: #f5758d;">.code-line</span>');
    });

    it('should highlight CSS values correctly', () => {
        const highlighted = snippy.highlightCSS("width: 100px;");
        expect(highlighted).toContain('<span style="color: #e6bd69;">width</span>: 100px;');
    })

    it('should highlight CSS functions correctly', () => {
        const highlighted = snippy.highlightCSS("width: calc(100% - 10px);");
        expect(highlighted).toContain('<span style="color: #b9b9b9;">calc</span>');
        expect(highlighted).toContain('<span style="color: #4CAF50;">100% - 10px</span>');
    });

    it('should escape special characters correctly', () => {
        const highlighted = snippy.highlightCSS('<div class="test">Test</div>');
        expect(highlighted).toBe('&lt;div class="test"&gt;Test&lt;/div&gt;');
    });

    it('should handle empty input', () => {
        const highlighted = snippy.highlightCSS("");
        expect(highlighted).toBe('');
    });

    it('should handle multiple CSS rules', () => {
        const highlighted = snippy.highlightCSS(`
            .code-line {
                display: flex;
                color: red;
            }
            .line-content {
                padding: 10px;
            }
        `);

        expect(highlighted).toContain('<span style="color: #f5758d;">.code-line</span>');
        expect(highlighted).toContain('<span style="color: #e6bd69;">color</span>: red');
        expect(highlighted).toContain('<span style="color: #f5758d;">.line-content</span>');
        expect(highlighted).toContain('<span style="color: #e6bd69;">padding</span>: 10px');
    });
});
