export default () => ({
    port: parseInt(process.env.PORT) || 8080,
    uri: process.env.MONGO_URI || 'mongodb://localhost:27017/algofanatics',
    jwt_access_secret: process.env.JWT_ACCESS_SECRET,
    jwt_expiration_time_in_secs: process.env.JWT_EXP_H,
    jwt_expiration_time_in_days: process.env.JWT_EXP_D,
});