export default {
  transform: {
    '^.+\\.m?js$': 'babel-jest',
  },
  globals: {
    'babel-jest': {
      useBabelrc: true,
    }
  }
};
