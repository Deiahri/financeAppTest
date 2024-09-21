import e from 'express';
import { debug } from './tools.js';
import './databaseTools.js';
import { getAllCategories } from './databaseTools.js';

const app = e();
const ServerPort = 8080;

app.get('/get-categories', async (req, res) => {
    try {
        const data = await getAllCategories();
        res.send({ data });
    } catch (e) {
        res.send({ error: e.message, status: 'failed' });
        return;
    }
});

app.listen(ServerPort, () => {
    debug('online http://localhost:8080');
});
