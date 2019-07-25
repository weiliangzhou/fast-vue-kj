module.exports = {
  plugins: {
    // autoprefixer: {
    //   browsers: ["> 1%", "iOS >= 7", "ie >= 7", "Android >= 2.4"]
    // },
    "postcss-px2rem-exclude": {
      remUnit: 75,
      exclude: /node_modules|folder_name/i
    }
  }
};
