// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import sass from 'rollup-plugin-sass';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/js/main.js',
  output: {
    file: 'bundle.js',
    format: 'iife',
    name: 'App',
    sourcemap: true
  },
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
      preventAssignment: true
    }),
    resolve(),
    commonjs(),
    sass({
      output: 'styles.css'
    }),
    terser()
  ]
};
