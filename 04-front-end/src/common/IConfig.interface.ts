export default interface IConfig {
    domain: {
        name: string,
        port: number
    },
    authorization: {
        token: string
    },
    refresh: {
        token: string
    }
}
