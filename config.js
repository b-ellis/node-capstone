exports.DATABASE_URL = process.env.PROD_MONGODB ||
                       global.DATABASE_URL ||
                       (process.env.NODE_ENV === 'production' ?
                            'mongodb://localhost/node-capstone' :
                            'mongodb://localhost/node-capstone-dev');
exports.PORT = process.env.PORT || 8080;