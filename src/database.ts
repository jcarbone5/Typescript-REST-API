import { connect } from 'mongoose'

(async () => {
    try {
        await connect('mongodb://localhost/ts-node-api', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: true,
            useCreateIndex: true
        });

        console.log('DB is conected')
    } catch (error) {
        console.log(error)
    }
})();