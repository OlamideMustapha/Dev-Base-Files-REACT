import HtmlWebpackPlugin    from 'html-webpack-plugin';
import BrowserSyncPlugin    from "browser-sync-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CopyPlugin           from "copy-webpack-plugin";
import webpack              from "webpack"; // to access built-in plugins


const HTMLWebpackPluginConfig = new HtmlWebpackPlugin (
  {
  /* configuration object here */
    template: __dirname + '/public/index.html',
    // File output path are relative to ./build/static/js
    filename: '../../index.html',
    inject: 'body'
  }
);


const browserSyncWebpack = new BrowserSyncPlugin (
  {
    host: "localhost",
    port: 3000,

    /**
     * Proxy the webpack Dev Server endpoint through browserSync
     * Edit to match webpack dev server endpoint
     */
    proxy: "http://localhost:8080/"

  },

  /**
   * Prevent BrowserSync from reloading the page and let webpack Dev server
   * take care of this
   */
  { reload: false } 
);


const minCssExtractConfig =  new MiniCssExtractPlugin (
  {
    // Options similar to the same options in webpackOptions.output
    // both options are optional
    // File output path are relative to ./build/static/js
    filename: "../styles/styles.css",
    chunkFilename: "[name].css"
  }
);


const copyPluginConfig = new CopyPlugin (
  {
    patterns : [
      { from: "public"
      // File output path are relative to ./build/static/js
      , to: "../../"
      , globOptions: {
          ignore: [ '**/index.html' ]
        }
      }
    ]
  }
);


// Production
const ENV = process.env.NODE_ENV;
const productionConfig = new webpack.DefinePlugin (
  {
    "process.env.NODE_ENV": JSON.stringify (ENV)
  }
);



const config = {

  /**
  * Mode
  * This can be used to enable webpack's built-in optimizations that correspond
  * to each environmnet
  * options: development, production, none
  * defualt: production
  */
  mode: "production",


  /**
   * Entry point
   * indicates which module webpack shoudl use to begin building out its
   * internal dependency graph
   */
  entry: __dirname + '/src/index.js',


  /**
   * Loaders
   * test: identifies which file or files should be transformed
   * use: indicates which loader should be used to do the transforming
   */
  module: {
    rules: [
      
      // JavaScript, Jsx
      { test: /\.(js|jsx|mjs)$/
      , exclude: /node_modules/
      , use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          }
        }
      },

      // styles
      { test: /\.(sass|css|scss)$/
      , use: [
          // fallback to style-loader in development
          ENV !== "production"
            ? "style-loader"
            :  MiniCssExtractPlugin.loader,
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader"
        ]
      },

      // files
      { test: /\.(png|jpg|jpeg|svg|gif)$/
      , use: {
        loader: "file-loader"
        , options: {
            // File output path are relative to ./build/static/js
            outputPath: "../assets"
          }
        }
      }

    ]
  },


  /**
   * Output
   * tell webpack where to emit the bundles it creates and how to name these
   * files
   */
  output: {
    filename: 'index.js'
  , path: __dirname + '/build/static/js'
  },


  /**
   * Plugins
   * They are used to perform a wider range of tasks like bundle optimization,
   * asset management, and injection of environmnet variables
   */
  plugins: [
    HTMLWebpackPluginConfig
  , browserSyncWebpack
  , minCssExtractConfig
  , productionConfig
  , copyPluginConfig
  ]
};


export default config;