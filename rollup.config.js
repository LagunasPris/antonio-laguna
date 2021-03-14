import { terser } from 'rollup-plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import filesize from 'rollup-plugin-filesize';

export default {
  input: 'src/main.js',
  output: [
    {
      file: 'public/js/main.js',
      format: 'iife',
      sourcemap: false,
      name: 'main'
    }
  ],
  plugins: [
    babel({ babelHelpers: 'bundled' }),
    nodeResolve(),
    commonjs(),
    terser(),
    filesize()
  ]
};
