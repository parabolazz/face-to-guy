export type SizeType = 'original' | 'compressed';
export type SourceType = 'album' | 'camera';
export type MediaType = 'image' | 'video' | 'mix';
export type FileItemStatus = 'ready' | 'uploading' | 'success' | 'error';
export class FileItem {
  status: FileItemStatus = 'ready';
  message: string = 'ready';
  uid: string = new Date().getTime().toString();
  name?: string;
  url?: string;
  type?: string;
  path?: string;
  percentage: string | number = 0;
  formData: any = {};
}
