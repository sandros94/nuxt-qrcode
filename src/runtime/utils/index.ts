export * from './qrcode/svg/render'

export function base64Encode(data: Uint8Array | string): string {
  const encodedData
    = data instanceof Uint8Array ? data : new TextEncoder().encode(data)

  // @ts-expect-error check if toBase64 is available
  if (Uint8Array.prototype.toBase64) {
    // @ts-expect-error toBase64 is available in some environments
    return encodedData.toBase64()
  }

  return btoa(String.fromCodePoint(...encodedData))
}
