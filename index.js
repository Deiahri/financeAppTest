import e from 'express';
import cors from 'cors';
import { debug, decryptUserToken, generateUserToken } from './tools.js';
import './databaseTools.js';
import { addToUserProgress, createUser, getAllCategories, getLessonPath, getUserWithEmail } from './databaseTools.js';

const app = e();
const ServerPort = 8080;

app.use(e.json());
app.use(cors({
    origin: '*',
    optionsSuccessStatus: 200
}));
// app.use(cors());

app.post('/online', (req, res) => {
    res.send({ status: true });
});

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


app.post('/submit-activity-performance', async (req, res) => {
    // debug(req.body.performance);
    const { userToken, performance, activityID } = req.body;
    if (!userToken || isNaN(Number(performance)) || !activityID) {
        res.send({ error: 'missing parameters' })
        return;
    }
    try {
        await addToUserProgress({ userToken, activityID, performance });
        res.send({ success: true })
        return;
    } catch (e) {
        res.send({ error: e.message });
        return;
    }
});


app.get('/submit-activity-performance', async (req, res) => {
    // debug(req.body.performance);
    const { userToken, performance, activityID } = req.body;
    if (!userToken || isNaN(Number(performance)) || !activityID) {
        res.send({ error: 'missing parameters' })
        return;
    }
    try {
        await addToUserProgress({ userToken, activityID, performance });
        res.send({ success: true })
        return;
    } catch (e) {
        res.send({ error: e.message });
        return;
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.send({ error: 'missing params' });
        return;
    }

    let tokenData;
    try {
        tokenData = await getUserWithEmail(email);
        if (!tokenData) {
            throw new Error();
        }
    } catch (e) {
        res.send({ error: 'that user does not exist' });
        return;
    }


    // compare password
    const pass = decryptUserToken(tokenData.password);
    if (pass.email !== password) {
        res.send({error: 'password incorrect'});
        return;
    }
    
    res.send({ userToken: generateUserToken(email), username: tokenData.username });
});

app.post('/create-user', async (req, res) => {
    try {
        const { email, password, username } = req.body;
        // const { email, password, username } = req.query;
        // debug(email, username, password);
        if (!email || !password || !username) {
            res.send({ error: 'missing fields' });
            return;
        }

        let modifiedEmail = email.trim().toLowerCase();

        // create user if user does not exist
        if (await getUserWithEmail(modifiedEmail)) {
            res.send({ error: 'email already taken' });
            return;
        }

        // create user
        try {
            await createUser({ username, password, email });
            // successfully created user.
            const userToken = generateUserToken(email);
            res.send({ success: true, userToken, username });
            return;
        } catch (e) {
            debug('problem creating user '+e.message);
            res.send({ error: '[29jr3] fatal error while creating user' });
            return;
        }
    } catch {
        // something went wrong while parsing body or seomthing.
        res.send({ error: '[9jr3d] fatal error' });
        return;
    }
});

app.post('/get-user', async (req, res) => {
    const { userToken } = req.body;
    let tokenData;
    if (!userToken) {
        res.send({ error : 'missing params' });
        return;
    }
    try {
        tokenData = decryptUserToken(userToken);
        if (!tokenData) { 
            throw new Error('');
        }
    } catch (e) {
        res.send({ error: 'invalid user token' });
        return;
    }

    const { email } = tokenData;
    let userData;
    try {
        userData = await getUserWithEmail(email);
        if (!userData) {
            throw new Error();
        }
    } catch (e) {
        res.send({ error: 'user does not exist for given token' });
        return;
    }

    res.send({ ...userData });
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
