import http from 'http'

class Router {
    routes = new Map();

    constructor(port) {
        this.server = http.createServer((req, res) => {
            const route = this.routes.get(req.url);

            if(route) route(req, res);
            else {
                res.setHeader("Content-Type", "application/json");

                return res.end(JSON.stringify({
                    status: 404,
                    message: `[${req.method}] ${req.url} not found.`
                }))
            }
        }).listen(port, () => { console.log(`Listening on port ${port}`)})
    }

    set = (route, callback) => {
        const getHandler = (req, res) => {
            if(["get", "post"].includes(req.method.toLowerCase())) {
                console.log(`[${req.method}] "${req.url}" processing.`)
            }

            try {
                return callback?.(req, res);
            } catch (err) {
                console.log(err);
                throw err;
            } finally {
                console.log(`[${req.method}] "${req.url}" processing ended.`)
            }
        }

        this.routes.set(route, getHandler);
    }
}

export default Router
