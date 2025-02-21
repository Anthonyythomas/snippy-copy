import SnippyCopy from '../src/snippy-copy';

global.navigator.clipboard = {
    writeText: jest.fn(),
};

describe('SnippyCopy Class', () => {
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

