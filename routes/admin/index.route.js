const authMiddlewares = require("../../middlewares/admin/auth.middlewares");

const dashboardRoutes = require("./dashboard.route")
const systemConfig = require("../../config/system")
const productRoutes = require("./products.route");
const productCategoryRouter = require("./products-category.route");
const roleRoutes = require("./role.route");
const accountRoutes = require("./accounts.route");
const authRoutes = require("./auth.route");
const myAccountRoutes = require("./my-account.route");

module.exports = (app) => {
    const PATH_ADMIN = `/${systemConfig.prefixAdmin}`;

     app.use(
        `${PATH_ADMIN}/dashboard`,
        authMiddlewares.requireAuth,
        dashboardRoutes);

     app.use(
        `${PATH_ADMIN}/products`,
        authMiddlewares.requireAuth,
        productRoutes);

     app.use(
        `${PATH_ADMIN}/products-category`,
        authMiddlewares.requireAuth,
        productCategoryRouter);

     app.use(
        `${PATH_ADMIN}/role`,
        authMiddlewares.requireAuth,
        roleRoutes);

     app.use(
        `${PATH_ADMIN}/accounts`,
        authMiddlewares.requireAuth,
        accountRoutes);
     
     app.use(
        `${PATH_ADMIN}/auth`,
        authRoutes);

      
   app.use(
      `${PATH_ADMIN}/my-account`,
      authMiddlewares.requireAuth,
      myAccountRoutes
   );
}