import express from 'express';
import bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid';
import Database from './msdb';
import multer from 'multer';

const app = express();
const port: number = 4589;
app.use(bodyParser.json());
const upload = multer();
app.use(upload.none());
const key: string = "NayGolf125125"
let db: any;

app.post('/api/:key/:database/add/:tableName', (req: any, res: any) => {
    db = new Database(req.params.database);
    if (req.params.key !== key) return res.json({ message: 'KEY ERROR' });
    const table = db.table(req.params.tableName);
    const data = req.body;
    console.log(data);
    const id = data.id || uuidv4();
    table.save(id, JSON.parse(data.db));
    res.json({ message: 'Item added successfully' });
});

app.get('/api/:key/:database/get/:tableName/:dbkey', (req: any, res: any) => {
    db = new Database(req.params.database);
    const table = db.table(req.params.tableName);
    if (req.params.key !== key) return res.json({ message: 'KEY ERROR' });

    const result = table.find(req.params.dbkey);
    res.json(result);
});

app.get('/api/:key/:database/remove/:tableName/:dbkey', (req: any, res: any) => {
    db = new Database(req.params.database);
    const table = db.table(req.params.tableName);
    if (req.params.key !== key) return res.json({ message: 'KEY ERROR' });

    const result = table.remove(req.params.dbkey);
    res.json({ message: 'Item remove successfully' });
});


app.get('/api/:key/:database/getall/:tableName', (req: any, res: any) => {
    db = new Database(req.params.database);
    const table = db.table(req.params.tableName);
    if (req.params.key !== key) return res.json({ message: 'KEY ERROR' });

    const result = table.getAll(req.query.orderBy || 'asc');
    res.json(result);
});

app.get('/api/:key/:database/random/:tableName', (req: any, res: any) => {
    db = new Database(req.params.database);
    const table = db.table(req.params.tableName);
    if (req.params.key !== key) return res.json({ message: 'KEY ERROR' });

    const result = table.random();
    res.json(result);
});

app.get('/api/:key/:database/getwhere/:tableName/:condition', (req: any, res: any) => {
    db = new Database(req.params.database);
    const table = db.table(req.params.tableName);
    if (req.params.key !== key) return res.json({ message: 'KEY ERROR' });

    const result = table.getWhere(req.params.condition);
    res.json(result);
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
