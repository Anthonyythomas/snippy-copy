import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';

export default {
    input: 'src/snippy-copy.js',
    output: [
        {
            file: 'dist/snippy-copy.js',
            format: 'umd',
            name: 'SnippyCopy',
        },
        {
            file: 'dist/snippy-copy.esm.js',
            format: 'esm',
        },
    ],
    plugins: [
        postcss({
            extract: 'snippy-copy.css',
            minimize: true,
        }),
        terser()
    ],
};
