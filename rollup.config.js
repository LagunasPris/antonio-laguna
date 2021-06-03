import { terser } from 'rollup-plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import filesize from 'rollup-plugin-filesize';

export default ['main', 'course'].map(name => ({
  input: `src/${name}.js`,
  output: [
    {
      file: `public/js/${name}.js`,
      format: 'iife',
      sourcemap: false,
      name
    }
  ],
  plugins: [
    babel({ babelHelpers: 'bundled' }),
    nodeResolve(),
    commonjs(),
    terser(),
    filesize()
  ]
}));
