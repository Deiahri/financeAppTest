import e from 'express';
import cors from 'cors';
import { debug } from './tools.js';
import './databaseTools.js';
import { getAllCategories, getLessonPath } from './databaseTools.js';

const app = e();
const ServerPort = 8080;

app.use(e.json());
app.use(cors({
    origin: '*',
    optionsSuccessStatus: 200
}));

app.get('/online', (req, res) => {
    res.send({ status: true });
});


app.post('/get-categories', async (req, res) => {
    try {
        const data = await getAllCategories();
        res.send({ data });
    } catch (e) {
        res.send({ error: e.message, status: 'failed' });
        return;
    }
});


app.post('/get-lesson-path', async (req, res) => {
    const { lessonPathID } = req;
    if (!lessonPathID) {
        res.send({ error: 'lessonPathID not specified' });
    }

    try {
        const data = await getLessonPath(lessonPathID);
        res.send({ data });
    } catch (e) {
        res.send({ error: e.message, status: 'failed' });
        return;
    }
});


// app.get('/get-categories-p', async (req, res) => {
//     try {
//         const data = await getAllCategories();
//         res.send({ data });
//     } catch (e) {
//         res.send({ error: e.message, status: 'failed' });
//         return;
//     }
// });

app.listen(ServerPort, () => {
    debug('online on port '+ServerPort);
});
