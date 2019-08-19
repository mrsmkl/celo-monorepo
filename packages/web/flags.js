const FLAGS = {
  development: {
    ECOFUND: true,
    SDK: true,
  },
  production: {
    ECOFUND: true,
    SDK: true,
  },
  staging: {
    ECOFUND: true,
    SDK: true,
  },
}
module.exports = FLAGS[process.env.DEPLOY_ENV]
