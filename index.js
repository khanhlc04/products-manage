const express = require("express");

const dotenv = require("dotenv");
dotenv.config();

const flash = require("express-flash");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const methodOverride = require("method-override");
var path = require('path');
const moment = require('moment');

const routesClient = require("./routes/client/index.route");
const routesAdmin = require("./routes/admin/index.route");
const database = require("./config/database");
const systemConfig = require("./config/system");
const bodyParser = require('body-parser');

database.connect();

const app = express();
const port = process.env.PORT;

app.use(bodyParser.urlencoded({ extended: false }))

app.use(methodOverride('_method'));

app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

app.use(express.static(`${__dirname}/public`));

app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));


app.use(cookieParser('keyboard cat'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;

routesClient(app);

routesAdmin(app);

app.listen(port, () =>{
    console.log("App listen on port " + port);
});