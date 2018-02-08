const mongo = require('mongodb').MongoClient;

const connect = function(){

    const databaseName = 'meme-generator-capstone';

    return new Promise((resolve, reject) => {
        mongo.connect(process.env.DATABASE_URL, (err, database) => {
            if(err){
                reject(err);
            }
            else{
                resolve(database.db(databaseName));
            }
        });
    });
}

module.exports = connect;