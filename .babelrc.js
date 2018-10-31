module.exports = {
  presets: [require("@babel/preset-env"), require("@babel/preset-flow")],
  plugins: [require("@babel/plugin-proposal-class-properties"), require("@babel/plugin-transform-runtime")],
};
