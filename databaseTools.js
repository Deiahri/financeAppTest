import { MongoClient } from 'mongodb';
import { debug } from './tools.js';

const url = 'mongodb+srv://jundayin1:GIJyVxMAMg65SvBM@testcluster1.k9dbr.mongodb.net/?retryWrites=true&w=majority&appName=TestCluster1';
const client = new MongoClient(url);

await client.connect();
const db = client.db("financeApp");
const categoryCol = db.collection('category');
const lessonPathCol = db.collection('lessonPath');

export async function getAllCategories() {
    return await categoryCol.find({}).toArray();
}

export async function testInsert() {
    await categoryCol.insertOne({ '_id': '512a42f3g35', 'dat': 'dsnif3' });
}
