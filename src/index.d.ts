// fixes env parameters
declare global {
    namespace NodeJS {
        interface ProcessEnv {
        PUBLIC_URL?: string,
        NODE_ENV: 'development' | 'production';
        PORT?: string;
        PATH: string,
        SUDO_ASKPASS: string
        }
    }
}
// fixes image import 
declare module "*.svg" {
    const content: any;
    export default content;
}
declare module "*.png" {
    const content: any;
    export default content;
}

export {};