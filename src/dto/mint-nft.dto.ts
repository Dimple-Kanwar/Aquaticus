export class MintNFTDto {
  recipient!: string;
  metadata!: Express.Multer.File;
  nftFile!: Express.Multer.File;
}