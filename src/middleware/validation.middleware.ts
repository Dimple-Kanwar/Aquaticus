import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { MintNFTDto } from '../dto/mint-nft.dto';


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