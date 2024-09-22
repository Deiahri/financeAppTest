import { MongoClient, ObjectId } from 'mongodb';
import { debug, decryptUserToken, generateUserToken } from './tools.js';

const url = 'mongodb+srv://jundayin1:GIJyVxMAMg65SvBM@testcluster1.k9dbr.mongodb.net/?retryWrites=true&w=majority&appName=TestCluster1';
let client, db, categoryCol, lessonPathCol, activityCol, userCol;
let initialized = false;
let error = null;

async function initializeMongoConnection() {
    try {
        client = new MongoClient(url);
        await client.connect();
        db = client.db("financeApp");
        categoryCol = db.collection('category');
        lessonPathCol = db.collection('lessonPath');
        activityCol = db.collection('activity');
        userCol = db.collection('user');
        initialized = true;
    } catch (e) {
        error = e.message;
        debug('problem getting mongo connection '+e.message);
    }
}

export async function getAllCategories() {
    if (!initialized) {
        return { error: 'not initialized',
            message: error
        };
    }
    const categories = await categoryCol.find({}).toArray();
    // const { lessonPlans } = cats;
    for(let category of categories) {
        const { lessonPaths } = category;
        
        const lessonPathData = [];
        for (let lessonPathID of lessonPaths) {
            try {
                lessonPathData.push({...await getLessonPath(lessonPathID), id: lessonPathID});
            } catch (e) {
                debug('problem fetching lesson path: '+lessonPathID);
            }
        }
        // override lessonPaths with lessonPath data
        category.lessonPaths = lessonPathData;
        // const lesson
    }
    return categories;
}

export async function getLessonPath(lessonPathID) {
    // lessonPathCol.findOne({ _id: lessonPathID }).toArray();
    try {
        const res = await lessonPathCol.findOne(new ObjectId(lessonPathID));
        return res;
    } catch (e) {
        debug('problem in getLessonPath -', e.message);
        return null;
    }
}

export async function insertActivity(activity) {
    await categoryCol.insertOne(activity);
}

export async function insertLessonPath(lessonPlan) {
    await lessonPathCol.insertOne(lessonPlan);
}

export async function insertCategory(category) {
    await categoryCol.insertOne(category);
}

export async function getUserWithEmail(email) {
    return await userCol.findOne({ email: email.toLowerCase() });
}

export async function createUser({ username, password, email }) {
    // encrypts password first
    console.log('created?');
    await userCol.insertOne({ username, password: generateUserToken(password), email });
    console.log('created?!');
}

export async function updateUser({email, userData }) {
    await userCol.replaceOne({ email }, userData);
}

export async function addToUserProgress({ userToken, activityID, performance }) {
    const userData = decryptUserToken(userToken);
    if (!userData) {
        throw new Error('User token is invalid');
    }

    const { email } = userData;
    if(!email) {
        throw new Error('User token is missing information');
    }

    try {
        // const newUserData = await userCol.findOneAndUpdate({ email: email.toLowerCase() }, { $set: { activity: { [activityID]: performance } } }, { returnNewDocument: true })
        const newUserData = await getUserWithEmail(email.toLowerCase());
        if (!newUserData) {
            throw new Error('no user data '+newUserData+' | '+email);
        }
        try {
            newUserData.activity[activityID] = performance;
        } catch {
            // activity is likely not defined
            newUserData.activity = {
                [activityID]: performance
            };
        }
        await updateUser({ email, userData: newUserData });
        console.log(newUserData);
    } catch (e) {
        console.log(e.message);
        throw new Error('Could not update user activity');
    }
}

setTimeout(async () => {
    // getLessonPath('n9o3').then((dat) => {
    //     debug(dat);
    // });
    // getAllCategories();
    // insertLessonPath({
    //     name: 'Loans',
    //     difficulty: 3,
    //     image: 'https://media.istockphoto.com/vectors/bank-loan-vector-id1128477281?k=6&m=1128477281&s=170667a&w=0&h=6K8Pq0dUOBV9ltyT-Q5ACGWN_6HBD1QVIpd1utOWrzc=',
    //     description: 'We doin loans, we doin loans, loans loans (GAEL) loans.',
    //     activities: [
    //         'TBD'
    //     ],
    // });
    // insertCategory({
    //     name: 'Money Stuff',
    //     // image: 'https://media.istockphoto.com/vectors/bank-loan-vector-id1128477281?k=6&m=1128477281&s=170667a&w=0&h=6K8Pq0dUOBV9ltyT-Q5ACGWN_6HBD1QVIpd1utOWrzc=',
    //     description: 'All the money, all in one place',
    //     lessonPaths: [
    //         '66ef532f8de60a52451844a6', '66ef539507a57d7b310ed9b4'
    //     ],
    // });

    // debug(await getLessonPath('66ef532f8de60a52451844a6'));
    // const res = (await getAllCategories())[0];
    // debug('??', res);
    // for(let lessonPath of res.lessonPaths) {
    //     debug(lessonPath);
    // }

    // const userDat = await getUserWithEmail('dytlin@gmail.com');
    // debug(userDat);
    // const ress = await fetch('http://localhost:8080/create-user', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({
            
    //     })
    // });
    // debug(ress);
    createUser({ username: 'jackman', password: 'hello!', email: 'jack@gmail.com' });
}, 1500);

// export async function testInsert() {
//     await categoryCol.insertOne({ '_id': '512a42f3g35', 'dat': 'dsnif3' });
// }

// debug('imported');
initializeMongoConnection();
