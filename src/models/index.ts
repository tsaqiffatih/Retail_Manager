import { Sequelize } from 'sequelize';
import { readdirSync } from 'fs';
import { basename as _basename, join } from 'path';

const basename = _basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db: any = {};

let sequelize: Sequelize;
if (config.use_env_variable) {
    // Error handling if the environment variable is not set
    const uri = process.env[config.use_env_variable];
    if (!uri) {
      throw new Error(`Environment variable ${config.use_env_variable} is not defined`);
    }
    sequelize = new Sequelize(uri, config);
  } else {
    // Ensure that config.database, config.username, and config.password are not undefined
    if (!config.database || !config.username) {
      throw new Error('Database name or username is not defined in the config');
    }
    sequelize = new Sequelize(config.database, config.username, config.password, config);
  }

// Import all model files
readdirSync(__dirname)
  .filter(file => {
    return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.ts';
  })
  .forEach(file => {
    const model = require(join(__dirname, file)).default(sequelize);
    db[model.name] = model;
  });

// Setup associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
