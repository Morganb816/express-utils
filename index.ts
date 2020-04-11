import { Response, NextFunction, Request } from 'express';

/**
 * Error Code is a class used in the Service Factory function
 * @export
 * @class ErrorCode
 */
export class ErrorCode {
    type: string;
    code: number;
    message: string;
    constructor(type: string, code: number, message: string) {
        this.type = type;
        this.code = code;
        this.message = message;
    };
};

/**
 * Service Factory is used to produce service functions.
 * It will wrap a function in neccesary boiler to make a service.
 * @export
 * @param  {Function} func 
 * @param  {ErrorCode[]} [errorCodes] 
 * @return Function 
 */
export function serviceFactory(func: Function, errorCodes?: ErrorCode[]): (req: Request, res: Response, next: NextFunction) => Promise<void> {
    return async function (req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            return await func(req, res, next);
        } catch (err) {
            errorCodes?.forEach(({ type, code, message }) => {
                if (type === err.message)
                    res.status(code).send(message);
                return;
            });
            console.log(err);
            res.status(500).send('Internal Server Error');
            return;
        };
    };
};