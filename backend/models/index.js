const Account = require('./Account');
const Attachment = require('./Attachment');
const Comment = require('./Comment');
const Defect = require('./Defect');
const History = require('./History');
const Object = require('./Object');
const Report = require('./Report');
const Role = require('./Role');
const Status = require('./Status');
const User = require('./User');


User.hasOne(Account, { foreignKey: 'user', onDelete: 'CASCADE' });
Account.belongsTo(User, { foreignKey: 'user' });


Role.hasMany(User, { foreignKey: 'role', onDelete: 'RESTRICT' });
User.belongsTo(Role, { foreignKey: 'role' });


Object.hasMany(Defect, { foreignKey: 'object', onDelete: 'CASCADE' });
Defect.belongsTo(Object, { foreignKey: 'object' });


Status.hasMany(Defect, { foreignKey: 'status', onDelete: 'RESTRICT' });
Defect.belongsTo(Status, { foreignKey: 'status' });

User.hasMany(Defect, { foreignKey: 'contractor', onDelete: 'SET NULL' });
Defect.belongsTo(User, { foreignKey: 'contractor', as: 'engineerInfo'});

Defect.hasMany(Attachment, { foreignKey: 'defect', onDelete: 'CASCADE' });
Attachment.belongsTo(Defect, { foreignKey: 'defect' });

Defect.hasMany(Comment, { foreignKey: 'defect', onDelete: 'CASCADE' });
Comment.belongsTo(Defect, { foreignKey: 'defect' });

User.hasMany(Comment, { foreignKey: 'user', onDelete: 'CASCADE' });
Comment.belongsTo(User, { foreignKey: 'user' });

Defect.hasMany(History, { foreignKey: 'defect', onDelete: 'CASCADE' });
History.belongsTo(Defect, { foreignKey: 'defect' });

User.hasMany(History, { foreignKey: 'user', onDelete: 'SET NULL' });
History.belongsTo(User, { foreignKey: 'user' });

User.hasMany(Report, { foreignKey: 'user', onDelete: 'CASCADE' });
Report.belongsTo(User, { foreignKey: 'user' });

User.hasMany(Object, { foreignKey: 'client', onDelete: 'RESTRICT' });
Object.belongsTo(User, { foreignKey: 'client', as: 'clientInfo' });

module.exports = {
    Account, Attachment, Comment,
    Defect, History, Object,
    Report, Role, Status, User
};