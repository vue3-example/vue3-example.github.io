const target = 'http://designgip2023.dothome.co.kr';
const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
    transpileDependencies: true,
    lintOnSave: false,
    devServer: {
        port: 8080,
        proxy: {
            '^/api': {
                target,
                changeOrigin: true
            },
            '^/upload': {
                target,
                changeOrigin: true
            },
            '^/download': {
                target,
                changeOrigin: true
            }
        }
    },
    pluginOptions: {
        vuetify: {
            // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
        }
    }
});
