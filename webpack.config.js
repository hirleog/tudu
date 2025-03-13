// const { shareAll } = require("@angular-architects/module-federation/webpack");
// const { ModuleFederationPlugin } = require("webpack").container;

// module.exports = {
//   output: {
//     publicPath: "auto", // Resolva recursos relativos corretamente
//   },
//   optimization: {
//     runtimeChunk: false, // Impede a criação de um arquivo runtime separado
//   },
//   plugins: [
//     new ModuleFederationPlugin({
//       name: "tudu", // Nome do app principal
//       remotes: {
//         mfe: "mfe@http://localhost:4201/remoteEntry.js",
//       },
//       exposes: {
//         "./BudgetsModule": "./src/app/components/budgets/budgets.module.ts",
//       },
//       shared: shareAll({
//         singleton: true,
//         strictVersion: true,
//         requiredVersion: "auto",
//       }),
//     }),
//   ],
// };


// const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

// module.exports = {
//   output: {
//     publicPath: "http://localhost:4200/", // URL do app principal
//     uniqueName: "tudu",
//   },
//   optimization: {
//     runtimeChunk: false,
//   },
//   plugins: [
//     new ModuleFederationPlugin({
//       name: "tudu",
//       remotes: {
//         tuduProfessional: "tuduProfessional@http://localhost:4201/remoteEntry.js", // URL do MFE
//       },
//       shared: {
//         "@angular/core": { singleton: true, strictVersion: true },
//         "@angular/common": { singleton: true, strictVersion: true },
//         "@angular/router": { singleton: true, strictVersion: true },
//         // Outras dependências compartilhadas
//       },
//     }),
//   ],
// };


const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = {
  output: {
    publicPath: "http://localhost:4200/", // URL do app principal
    uniqueName: "tudu",
  },
  optimization: {
    runtimeChunk: false,
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "tudu",
      remotes: {
        tuduProfessional: "tuduProfessional@http://localhost:4201/remoteEntry.js", // URL do MFE
      },
      shared: {
        "@angular/core": { singleton: true, strictVersion: true },
        "@angular/common": { singleton: true, strictVersion: true },
        "@angular/router": { singleton: true, strictVersion: true },
        // Outras dependências compartilhadas
      },
    }),
  ],
};