const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const path = require("path");
const webpack = require("webpack");
const cleanwebpackplugin = require("clean-webpack-plugin");
const AddAssetHtmlPlugin = require("add-asset-html-webpack-plugin");
// 导入compression-webpack-plugin
const CompressionWebpackPlugin = require("compression-webpack-plugin");
// 定义压缩文件类型
const productionGzipExtensions = ["js", "css"];
const dllpath = "public/vendor";
function resolve(dir) {
  return path.join(__dirname, dir);
}
const proxyTargetMap = {
  prod: "https://xxx.xxx.com/",
  randy: "http://193.112.153.155:3001",
  peter: "http://192.168.11.178:3001"
};
let proxyTarget = proxyTargetMap[process.env.API_TYPE] || proxyTargetMap.prod;
let publicPath = process.env.NODE_ENV === "production" ? "/" : "/";
let dllPublishPath = "/vendor";
module.exports = {
  publicPath: publicPath,
  outputDir: "dist",

  // 放置静态资源的地方 (js/css/img/font/...)
  // assetsDir: '',

  // 是否在保存的时候使用 `eslint-loader` 进行检查。
  // 有效的值：`ture` | `false` | `"error"`
  // 当设置为 `"error"` 时，检查出的错误会触发编译失败。

  lintOnSave: false,

  // 使用带有浏览器内编译器的完整构建版本
  // 查阅 https://cn.vuejs.org/v2/guide/installation.html#运行时-编译器-vs-只包含运行时
  // compiler: false,

  // babel-loader 默认会跳过 node_modules 依赖。
  // 通过这个选项可以显式转译一个依赖。
  transpileDependencies: [
    /* string or regex */
  ],

  // 是否为生产环境构建生成 source map？
  productionSourceMap: false,

  // 调整内部的 webpack 配置。
  // 查阅 https://github.com/vuejs/vue-docs-zh-cn/blob/master/vue-cli/webpack.md
  chainWebpack: config => {
    // 移除 prefetch 插件,解决组件懒加载失效的问题
    config.plugins.delete("prefetch");
    // 添加新的svg-sprite-loader处理svgIcon
    config.resolve.alias
      .set("@", resolve("src"))
      .set("_conf", resolve("src/conf"));
  },
  // CSS 相关选项
  css: {
    // 将组件内的 CSS 提取到一个单独的 CSS 文件 (只用在生产环境中)
    // 也可以是一个传递给 `extract-text-webpack-plugin` 的选项对象
    extract: true,

    // 是否开启 CSS source map？
    sourceMap: false,

    // 为预处理器的 loader 传递自定义选项。比如传递给
    // sass-loader 时，使用 `{ sass: { ... } }`。
    loaderOptions: {},

    // 为所有的 CSS 及其预处理文件开启 CSS Modules。
    // 这个选项不会影响 `*.vue` 文件。
    modules: false
  },

  // 在生产环境下为 Babel 和 TypeScript 使用 `thread-loader`
  // 在多核机器下会默认开启。
  parallel: require("os").cpus().length > 1,

  // PWA 插件的选项。
  // 查阅 https://github.com/vuejs/vue-docs-zh-cn/blob/master/vue-cli-plugin-pwa/README.md
  pwa: {},

  // 配置 webpack-dev-server 行为。
  devServer: {
    proxy: {
      "/dev": {
        target: "http://47.111.119.24", //线上
        ws: true,
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          "^/dev": "" // 需要rewrite重写的,
        }
      }
      // proxy: {target:'http://47.98.55.127:8081'}
    },

    open: true,
    host: "kj.yizhidao9.com",
    port: 80,
    https: false,
    hotOnly: false
  },
  // eslint-disable-next-line no-dupe-keys
  configureWebpack: config => {
    if (process.env.NODE_ENV === "production") {
      // 为生产环境修改配置...
      /*
      config.plugins.push(
        new webpack.dllreferenceplugin({
          context: process.cwd(),
          manifest: require("./public/vendor/vendor-manifest.json")
        })
      );
      config.plugins.push(
        new webpack.DllReferencePlugin({
          context: process.cwd(),
          manifest: require("./public/vendor/vendor-manifest.json")
        })
      );
      // 将 dll 注入到 生成的 html 模板中
      config.plugins.push(
        new AddAssetHtmlPlugin({
          // dll文件位置
          filepath: path.resolve(__dirname, "./public/vendor/*.js"),
          // dll 引用路径
          publicPath: dllPublishPath,
          // dll最终输出的目录
          outputPath: "./vendor"
        })
      );
*/
      // 开启压缩
      config.plugins.push(
        new CompressionWebpackPlugin({
          filename: "[path].gz[query]",
          algorithm: "gzip",
          test: new RegExp("\\.(" + productionGzipExtensions.join("|") + ")$"),
          threshold: 10240,
          minRatio: 0.8
        })
      );

      if (process.env.npm_lifecycle_event === "analyze") {
        config.plugins.push(new BundleAnalyzerPlugin());
      }
    } else {
      // 为开发环境修改配置...
    }
    // require("vux-loader").merge(config, {
    //   options: {},
    //   plugins: ["vux-ui"]
    // });

    return {
      optimization: {
        splitChunks: {
          cacheGroups: {
            vendor: {
              chunks: "all",
              test: /node_modules/,
              name: "vendor",
              minChunks: 1,
              maxInitialRequests: 5,
              minSize: 0,
              priority: 100
            },
            common: {
              chunks: "all",
              test: /[\\/]src[\\/]js[\\/]/,
              name: "common",
              minChunks: 2,
              maxInitialRequests: 5,
              minSize: 0,
              priority: 60
            },
            // styles: {
            //   name: "styles",
            //   test: /\.(sa|sc|c)ss$/,
            //   chunks: "all",
            //   enforce: true
            // },
            runtimeChunk: {
              name: "manifest"
            }
          }
        }
      }
    };
  },

  // 第三方插件的选项
  pluginOptions: {}
};
