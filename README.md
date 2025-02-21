# SnippyCopy

`SnippyCopy` is a lightweight JavaScript library that allows you to display code snippets with syntax highlighting and a customizable copy-to-clipboard button. It supports different themes, customizable button styles, and error messages. Perfect for blogs, tutorials, and technical documentation pages!

## Installation

Install `SnippyCopy` via npm:

```bash
npm install snippy-copy
```

## Usage

Here is an example of how to use `SnippyCopy` with all available options:

```javascript
import SnippyCopy from 'snippy-copy';

const code = `const greet = () => { console.log('Hello, World!'); };`;

new SnippyCopy('#snippet-container', code, 'javascript', {
    noCopy: false,
    highlight: true,
    theme: 'dark',
    copyButtonText: 'Copy',
    copyButtonStyle: { backgroundColor: '#27ae60', color: 'white', fontSize: '16px' },
    errorMessage: 'Unable to copy the code',
    caption: 'JavaScript Code Example',
});
```

Add the corresponding HTML element:

```html
<div id="snippet-container"></div>
```

## Options

### Main Parameters

| Option          | Type    | Description |
|---------------|--------|-------------|
| `selector`    | String | The selector of the container element where the snippet will be displayed. |
| `code`        | String | The code snippet to display. |
| `language`    | String | The language of the code snippet (e.g., 'javascript', 'python', 'java'). |
| `options`     | Object | Configuration options for customization. |

### `options` Object

| Option            | Type    | Default Value | Description |
|------------------|--------|--------------|-------------|
| `noCopy`         | Boolean | `false`      | Disables the copy button. |
| `highlight`      | Boolean | `true`       | Enables syntax highlighting. |
| `theme`          | String  | `'light'`    | Sets the theme for the snippet ('light' or 'dark'). |
| `copyButtonText` | String  | `'📋'`       | Text for the copy button. |
| `copyButtonStyle`| Object  | `{}`         | Custom styles for the copy button. |
| `errorMessage`   | String  | `'Unable to copy'` | Custom error message when copy fails. |
| `caption`        | String  | `'Code Example'` | Text displayed as a caption above the code snippet. |
| `showLineNumbers`| Boolean | `false` | Displays line numbers in the code snippet when set to `true`. |

## ✨ Example Usage

```javascript
new SnippyCopy('#snippet-container', `const sum = (a, b) => a + b;`, 'javascript', {
    noCopy: false,
    highlight: true,
    theme: 'dark',
    copyButtonText: 'Copy',
    copyButtonStyle: { backgroundColor: '#3498db', color: 'white', fontSize: '14px' },
    errorMessage: 'Unable to copy the code',
    caption: 'Simple Sum Function',
    showLineNumbers: true
});
```

Add the corresponding HTML container:

```html
<div id="snippet-container"></div>
```

## 🤝 Contributing

Thank you for your interest in `SnippyCopy`! 🚀

### 🛠 Setting up the project locally

1. **Fork** this repository and clone it locally:
   ```bash
   git clone https://github.com/your-username/snippy-copy.git
   ```
2. **Navigate to the project folder**:
   ```bash
   cd snippy-copy
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Start the development environment**:
   ```bash
   npm run dev
   ```

### 🚀 How to contribute

1. **Create a branch for your feature or bug fix**:
   ```bash
   git checkout -b feature/add-new-functionality
   ```
2. **Make your changes and test them**.
3. **Commit your changes with a meaningful message**:
   ```bash
   git commit -m "✨ Added new functionality X"
   ```
4. **Push your branch**:
   ```bash
   git push origin feature/add-new-functionality
   ```
5. **Open a Pull Request (PR) on GitHub**. 🎉

### ✅ Code style & best practices

- Follow naming conventions (`camelCase` for variables, `kebab-case` for file names).
- Ensure all tests pass before submitting a PR:
  ```bash
  npm test
  ```

### 🛠 Reporting Issues

If you find a bug or have an idea for improvement, please open an **issue** on GitHub! 🐛✨

## 📜 License

MIT License