// class ErrorHandler extends Error {
//     statusCode: any;
//     constructor(statusCode: any, message: string) {
//         super();
//         this.statusCode = statusCode;
//         this.message = message;
//     }
// }

// // export const handleError = (err: { statusCode?: 500 | undefined; message: any; }, req: Request, res: Response, next: any) => {
// //     const { statusCode = 500, message } = err;
// //     res.status(statusCode).json({
// //         status: "error",
// //         statusCode,
// //         message
// //     });
// // };