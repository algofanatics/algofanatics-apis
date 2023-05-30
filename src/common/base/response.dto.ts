export class ResponseDto<T> {
  readonly message: string;
  readonly data: T;
  readonly statusCode: number;

  constructor(message: string, data: T, statusCode: number) {
    this.message = message;
    this.data = data;
    this.statusCode = statusCode;
  }
}
