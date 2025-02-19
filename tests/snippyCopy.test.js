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
        expect(codeElement.innerHTML).toContain('<span class="keyword">const x</span> <span class="delimiter">=</span> <span class="number">10</span>');
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

    it('should copy the code to clipboard on button click', () => {
        snippy = new SnippyCopy("#test-container", "const x = 10;");
        const button = document.querySelector("button.copy-btn");
        button.click();
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith("const x = 10;");
    });

    it('should show an alert if copying fails', () => {
        const originalAlert = window.alert;
        window.alert = jest.fn();

        navigator.clipboard.writeText.mockImplementationOnce(() => {
            throw new Error("Clipboard error");
        });

        snippy = new SnippyCopy("#test-container", "const x = 10;");
        const button = document.querySelector("button.copy-btn");
        button.click();

        expect(window.alert).toHaveBeenCalledWith("Impossible de copier");

        window.alert = originalAlert;
    });

    it('should use the provided theme for code snippet', () => {
        snippy = new SnippyCopy("#test-container", "const x = 10;", "javascript", { theme: "dark" });
        const preElement = document.querySelector("pre");
        expect(preElement.classList.contains("dark")).toBe(true);
    });
});

