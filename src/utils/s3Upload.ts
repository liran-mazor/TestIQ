import 'dotenv/config'; 
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { readFileSync } from 'fs';
import path from 'path';

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function uploadToS3(
  localPath: string,
  type: 'chart' | 'report' = 'chart'
): Promise<string> {
  try {
    const fileContent = readFileSync(localPath);
    const fileName = path.basename(localPath);
    
    // Determine folder and content type
    const folder = type === 'chart' ? 'charts' : 'reports';
    const contentType = type === 'chart' ? 'image/png' : 'text/html';
    
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: `${folder}/${fileName}`,
      Body: fileContent,
      ContentType: contentType,
      CacheControl: 'max-age=31536000',
    });

    await s3Client.send(command);
    
    const url = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${folder}/${fileName}`;
    
    return url;
  } catch (error) {
    console.error('❌ S3 upload failed:', error);
    throw error;
  }
}

// Backwards compatibility
export async function uploadChartToS3(localPath: string): Promise<string> {
  return uploadToS3(localPath, 'chart');
}