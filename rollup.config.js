// import replace from "rollup-plugin-replace"
import babel from "rollup-plugin-babel"
import resolve from "rollup-plugin-node-resolve"
import commonjs from "rollup-plugin-commonjs"

// import package from './package.json'

export default {
    input: "./src/index.js",
    output: {
        file: './dist/index.js',
        format: "esm",
        sourcemap: true
    },
    plugins: [
        babel({
            exclude: "node_modules/**"
        }),
        resolve(),
        commonjs()
    ],
    external: ['react', 'react-dom']
}