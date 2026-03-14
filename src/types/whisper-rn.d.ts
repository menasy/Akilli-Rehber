declare module "whisper.rn" {
  export interface TranscribeOptions {
    language?: string
    maxThreads?: number
    translate?: boolean
    [key: string]: unknown
  }

  export interface TranscribeResult {
    result: string
    language?: string
    segments: Array<{
      text: string
      t0: number
      t1: number
    }>
    isAborted?: boolean
  }

  export interface TranscribeFileOptions extends TranscribeOptions {
    onProgress?: (progress: number) => void
    onNewSegments?: (result: {
      nNew: number
      totalNNew: number
      result: string
      segments: TranscribeResult["segments"]
    }) => void
  }

  export interface ContextOptions {
    filePath: string | number
    isBundleAsset?: boolean
    useCoreMLIos?: boolean
    useGpu?: boolean
    useFlashAttn?: boolean
    coreMLModelAsset?: {
      filename: string
      assets: string[] | number[]
    }
  }

  export class WhisperContext {
    ptr: number
    id: number
    gpu: boolean
    reasonNoGPU: string

    transcribe(
      filePathOrBase64: string | number,
      options?: TranscribeFileOptions
    ): {
      stop: () => Promise<void>
      promise: Promise<TranscribeResult>
    }

    transcribeData(
      data: string | ArrayBuffer,
      options?: TranscribeFileOptions
    ): {
      stop: () => Promise<void>
      promise: Promise<TranscribeResult>
    }

    bench(maxThreads: number): Promise<{
      config: string
      nThreads: number
      encodeMs: number
      decodeMs: number
      batchMs: number
      promptMs: number
    }>

    release(): Promise<void>
  }

  export function initWhisper(options: ContextOptions): Promise<WhisperContext>
  export function releaseAllWhisper(): Promise<void>
  export const libVersion: string
  export const isUseCoreML: boolean
  export const isCoreMLAllowFallback: boolean
  export function toggleNativeLog(enabled: boolean): Promise<void>
  export function addNativeLogListener(
    listener: (level: string, text: string) => void
  ): { remove: () => void }
}
