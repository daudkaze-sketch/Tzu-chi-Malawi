import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export interface UploadedFile {
  url: string;
  caption?: string;
}

/**
 * Creates a date-based directory structure and saves the file
 * Structure: uploads/{feature}/{year}/{month}/{day}/{filename}
 */
export async function saveFileWithDateStructure(
  file: File,
  feature: string,
  date: Date = new Date()
): Promise<string> {
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  // Create directory path
  const dirPath = path.join(process.cwd(), 'public', 'uploads', feature, year, month, day);

  // Ensure directory exists
  await fs.mkdir(dirPath, { recursive: true });

  // Generate unique filename
  const fileExtension = path.extname(file.name);
  const fileName = `${uuidv4()}${fileExtension}`;
  const filePath = path.join(dirPath, fileName);

  // Convert File to Buffer and save
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  await fs.writeFile(filePath, buffer);

  // Return relative URL path
  return `/uploads/${feature}/${year}/${month}/${day}/${fileName}`;
}

/**
 * Saves multiple files with date-based structure
 */
export async function saveMultipleFilesWithDateStructure(
  files: File[],
  feature: string,
  date: Date = new Date()
): Promise<UploadedFile[]> {
  const uploadPromises = files.map(file => saveFileWithDateStructure(file, feature, date));
  const urls = await Promise.all(uploadPromises);
  return urls.map(url => ({ url }));
}

/**
 * Creates date-based directory structure for a given feature and date
 */
export async function createDateDirectory(feature: string, date: Date = new Date()): Promise<string> {
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  const dirPath = path.join(process.cwd(), 'public', 'uploads', feature, year, month, day);
  await fs.mkdir(dirPath, { recursive: true });

  return dirPath;
}

/**
 * Gets the date-based path for a feature
 */
export function getDatePath(feature: string, date: Date = new Date()): string {
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return path.join('uploads', feature, year, month, day);
}