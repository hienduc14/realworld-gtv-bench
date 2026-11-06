class HttpException extends Error {
  constructor(
    public readonly errorCode: number,
    public readonly code: string,
    public readonly details?: Record<string, unknown>,
  ) {
    super(code);
  }
}

export default HttpException;
