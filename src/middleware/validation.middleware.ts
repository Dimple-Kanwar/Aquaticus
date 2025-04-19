import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { MintNFTDto } from '../dto/mint-nft.dto';
import {ValidationError, validationResult } from 'express-validator';


// Custom Mint NFT validation middleware
export async function validateMintNFT(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const dto = plainToClass(MintNFTDto, req.body);
  const errors = await validate(dto);

  if (errors.length > 0) {
    const formattedErrors = errors.map(err => ({
      property: err.property,
      constraints: err.constraints
    }));

    res.status(400).json({
      message: 'Validation failed',
      errors: formattedErrors
    });
  }

  req.body = dto;
  next();
}

interface ValidationErrorResponse {
  field: string;
  message: string;
  value: any;
}

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors: ValidationErrorResponse[] = errors.array().map((err: any) => ({
      field: err.param,
      message: err.msg,
      value: err.value
    }));
    res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: formattedErrors
    });
    return;
  }
  next();
};