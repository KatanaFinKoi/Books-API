declare namespace Express {
  interface Request {
    headers: any;
    user: {
      _id: unknown;
      username: string;
    };
  }
}
