const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const babel = require('@rollup/plugin-babel');
const terser = require('@rollup/plugin-terser');
const peerDepsExternal = require('rollup-plugin-peer-deps-external');
const typescript = require('@rollup/plugin-typescript');
const json = require('@rollup/plugin-json');
const importCss = require('rollup-plugin-import-css');
const copy = require('rollup-plugin-copy');
const pkg = require('./package.json');

module.exports = [
  // CommonJS (for Node) and ES module (for bundlers) build
  {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: pkg.module,
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      // Automatically externalize peerDependencies
      peerDepsExternal(),
      
      // Handle JSON files
      json(),
      
      // Handle CSS imports - inlines CSS into JS
      importCss({
        minify: true
      }),
      
      // Copy CSS file to dist
      copy({
        targets: [
          { src: 'src/output.css', dest: 'dist', rename: 'index.css' }
        ]
      }),
      
      // Resolve node_modules
      resolve({
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      }),
      
      // Convert CommonJS modules to ES6
      commonjs(),
      
      // Compile TypeScript files
      typescript({
      }),
      
      // Transpile with Babel
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        presets: ['@babel/preset-env', '@babel/preset-react'],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      }),
      
      // Minify bundle
      terser(),
    ],
    // Indicate which modules should be treated as external
    external: [
      'react',
      'react-dom',
      '@mui/material',
      '@mui/icons-material',
      '@emotion/react',
      '@emotion/styled',
      'lucide-react',
    ],
  },
  
  // Special build for the demo
  {
    input: 'src/TimelineDemo.jsx',
    output: [
      {
        file: 'dist/demo.js',
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: 'dist/demo.esm.js',
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      peerDepsExternal(),
      json(),
      
      resolve({
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      }),
      commonjs(),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        presets: ['@babel/preset-env', '@babel/preset-react'],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      }),
      terser(),
    ],
    external: [
      'react',
      'react-dom',
      '@mui/material',
      '@mui/icons-material',
      '@emotion/react',
      '@emotion/styled',
      'lucide-react',
    ],
  },
];