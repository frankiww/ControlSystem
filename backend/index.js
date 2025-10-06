const express = require('express');
const sequelize = require('./config/database');
require('./models/index');

const authRoutes = require('./routes/authRoutes');
const attachmentRoutes = require('./routes/attachmentRoutes');
const commentRoutes = require('./routes/commentRoutes');
const defectRoutes = require('./routes/defectRoutes');
// const historyRoutes = require('./routes/historyRoutes');
const objectRoutes = require('./routes/objectRoutes');
// const reportRoutes = require('./routes/reportRoutes');
const roleRoutes = require('./routes/roleRoutes');
const statusRoutes = require('./routes/statusRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/attachments', attachmentRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/defects', defectRoutes);
// app.use('/api/history', historyRoutes);
app.use('/api/objects', objectRoutes);
// app.use('/api/reports', reportRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/statuses', statusRoutes);
app.use('/api/users', userRoutes);

const port = 3030;
app.listen(port, async() =>{
    console.log(`http://localhost:${port}`);
    await sequelize.sync({alter: true});
})


