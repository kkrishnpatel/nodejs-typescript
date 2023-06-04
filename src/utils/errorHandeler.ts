export const ErrorHandler = (statusCode:number, message:string) => {
  let error: any = new Error(message);
  error.statusCode = statusCode;
  throw error;
};
