const express = require("express");
const helmet = require("helmet");
const bodyParser = require('body-parser');
const voucherController = require('./controllers/voucherController');
const cors = require("cors");
const cron = require('node-cron')
const schedulerTaskService = require('./services/schedulerTaskService')

const app = express();

const corsOptions = {
    origin: '*',
    methods:'GET,PUT,POST,DELETE,OPTIONS',
    headers:'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(helmet());
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/voucher', voucherController);

app.use(function(req, res, next) {
    let err = new Error(req.path+' Not Found');
    err.status = 404;
    next(err);
});

app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.send({code: err.status || 500, data: err.message});
    // res.render('error');
});

cron.schedule('* * * * *', () => {
    console.log('Task job run')
    schedulerTaskService.runTask();
})


var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
});

process.on('uncaughtException', (err) => {
    console.error('There was an uncaught error', err)
    process.exit(1) //mandatory (as per the Node docs)
})

module.exports = app
