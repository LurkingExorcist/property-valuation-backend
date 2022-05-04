declare namespace NodeJS {
  export interface ProcessEnv {
    PG_USERNAME: string;
    PG_PASSWORD: string;
    PG_DATABASE: string;
    JWT_SECRET: string;
    DEBUG: string;
  }
}
