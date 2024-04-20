const config = {
    rateLimits: {
        user: {
            limit: 20,
            duration: 60000
        },
        url: {
            limit: 10,
            duration: 60000
        },
        ip: {
            limit: 20,
            duration: 60000
        }
    }
};
export default config;
