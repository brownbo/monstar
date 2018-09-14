'use strict';
module.exports = appInfo => {
    const config = {};

    config.logger = {
        //disableConsoleAfterReady: false
    };
    
    config.sequelize = {
        logging: false 
    };

    return config;
};