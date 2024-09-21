import { MongoClient } from 'mongodb';
import { debug } from './tools.js';

const url = 'mongodb+srv://jundayin1:GIJyVxMAMg65SvBM@testcluster1.k9dbr.mongodb.net/?retryWrites=true&w=majority&appName=TestCluster1';
let client, db, categoryCol, lessonPathCol;
let initialized = false;

async function initializeMongoConnection() {
    try {
        client = new MongoClient(url);
        debug('going online...');
        await client.connect();
        debug('done.');
        db = client.db("financeApp");
        categoryCol = db.collection('category');
        lessonPathCol = db.collection('lessonPath');
        initialized = true;
    } catch (e) {
        debug('problem getting mongo connection '+e.message);
    }
}

export async function getAllCategories() {
    if (!initialized) {
        return { error: 'not initialized' };
    }
    return await categoryCol.find({}).toArray();
}

export async function testInsert() {
    await categoryCol.insertOne({ '_id': '512a42f3g35', 'dat': 'dsnif3' });
}

debug('imported');
initializeMongoConnection();
