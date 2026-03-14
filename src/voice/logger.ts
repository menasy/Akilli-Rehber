export function voiceLog(step: string, payload?: unknown) {
  if (payload === undefined) {
    console.log(`[voice] ${step}`)
    return
  }

  console.log(`[voice] ${step}`, payload)
}
