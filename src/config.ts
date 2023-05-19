export default () => ({
    port: parseInt(process.env.PORT) || 8080,
    uri: process.env.MONGO_URI || 'mongodb://localhost:27017/algofanatics'
});