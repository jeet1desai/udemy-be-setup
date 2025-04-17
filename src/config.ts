import dotenv from "dotenv";

dotenv.config({});

class Config {
  public NODE_ENV: string | undefined;
  public DATABASE_URL: string | undefined;
  public CLIENT_URL: string | undefined;
  public JWT_TOKEN: string | undefined;
  public SECRET_KEY_ONE: string | undefined;
  public SECRET_KEY_TWO: string | undefined;

  private readonly DEFAULT_DATABASE_URL = "mongodb://127.0.0.1:27017/chatty";
  private readonly DEFAULT_JWT_TOKEN = "abcdefghijklmnopqrstuvwxyz";
  private readonly DEFAULT_SECRET_KEY_ONE = "secretcookiekey";
  private readonly DEFAULT_SECRET_KEY_TWO = "secretcookiekey";

  constructor() {
    this.NODE_ENV = process.env.NODE_ENV;
    this.DATABASE_URL = process.env.DATABASE_URL || this.DEFAULT_DATABASE_URL;
    this.CLIENT_URL = process.env.CLIENT_URL || "";
    this.JWT_TOKEN = process.env.JWT_TOKEN || this.DEFAULT_JWT_TOKEN;
    this.SECRET_KEY_ONE =
      process.env.SECRET_KEY_ONE || this.DEFAULT_SECRET_KEY_ONE;
    this.SECRET_KEY_TWO =
      process.env.SECRET_KEY_TWO || this.DEFAULT_SECRET_KEY_TWO;
  }

  public validateConfig(): void {
    for (const [key, value] of Object.entries(this)) {
      if (value === undefined) {
        throw new Error(`Missing environment variable: ${key}`);
      }
    }
  }
}

export const config: Config = new Config();
