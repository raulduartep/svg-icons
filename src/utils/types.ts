export type TConfig = {
  configDirPath: string
  dirPath: string
}

export type TIconSetGitSource = {
  type: 'git'
  remoteDir: string
  url: string
  branch: string
}

export type TIconSetSource = TIconSetGitSource

export type TIconSetResolver = {
  files(dirPath: string): Promise<string[]>
  name(camelName: string, filePath: string): Promise<string>
}

export type TIconSet = {
  id: string
  name: string
  projectUrl: string
  resolvers: TIconSetResolver[]
  source: TIconSetSource
}
