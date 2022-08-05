// // const CompressPlugin = require('compression-webpck-plugin'); // 압축된 파일 만들어 주는 것
// const with
//
// module.exports = {
//   webpack(config, {webpack}) {
//     const prod = process.env.NODE_ENV === 'production'
//     const plugins = [...config.plugins];
//     // if(prod) {
//     //   plugins.push(new CompressPlugin());
//     // }
//
//     return {
//       ...config, // next의 기본 설정이 있기 때문에 기본 설정을 바꿔 주는 식으로 가는게 좋다.
//       mode: prod ? 'production' : 'development',
//       devtool: prod ? 'hidden-source-map' : 'eval', // 배포 환경에서 소스코드 노출은 막기 위해서
//       module: {
//         ...config.module,
//         rules: [
//           ...config.module.rules,
//           {
//
//           }
//         ]
//       },
//       plugins,
//     }
//   },
//   compress: true, // compress plugin 대신
// }
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  compress: true,
  webpack(config, { webpack }) {
    const prod = process.env.NODE_ENV === 'production';
    return {
      ...config,
      mode: prod ? 'production' : 'development',
      devtool: prod ? 'hidden-source-map' : 'eval',
      plugins: [
        ...config.plugins,
        new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /^\.\/ko$/),
      ],
    };
  },
});
