import { routeWrapper } from "../util"

let healtCheckhRoute = routeWrapper((app) => {
    app.get("/healthz", (req, res) => {
        res.status(200).header("Content-Type", "application/json").send({ status: "ok" })
    })
})


export default healtCheckhRoute
