const catchAsync = (fn: any) => {
    return (req: any, res: any, next: ((reason: any) => PromiseLike<never>) | null | undefined) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

module.exports = { catchAsync };
