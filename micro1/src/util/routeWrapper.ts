import type { IFastifyInstance, cbRegistrarHandler } from "../types/IRoute";

export function routeWrapper(handler: (app: IFastifyInstance) => void) {
    const wrapper: cbRegistrarHandler = (app, _, done) => {
        handler(app)
        done();
    }
    return wrapper
}