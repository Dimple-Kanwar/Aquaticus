export class MintNFTDto {
  recipient!: string;
  metadata!: string;
  nftFile!: Express.Multer.File;
}