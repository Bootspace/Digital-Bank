import express from 'express';
import logger from './config/winston.js';
const port = process.env.PORT || 3444;
import db from './config/Db.js';
import user from './route/user_route.js';
import account from './route/account_route.js';
import transaction from './route/transaction_route.js';

const app = express();

// Using middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Bank of America');
});

app.use('/api/user', user);
app.use('/api/account', account);
app.use('/api/transact', transaction);

app.listen(port, () => {
    logger.log('info', `App running on Port ${port}`);
});
