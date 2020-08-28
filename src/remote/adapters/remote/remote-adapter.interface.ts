export interface RemoteAdapter {
  getFileNames(repositoryUrl: string): Promise<string[]>;
  getFileContents(repositoryUrl: string, fileName: string): Promise<string>;
}
