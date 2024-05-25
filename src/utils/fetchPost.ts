export function fetchPostMedia(number: string, value: string) {
  fetch('http://localhost:3008/v1/media', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ number: number, media: value }),
  })
}
export function fetchPostVoice(number: string, value: string) {
  fetch('http://localhost:3008/v1/voice', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ number: number, voice: value }),
  })
}
export function fetchPostMessage(number: string, value: string) {
  fetch('http://localhost:3008/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ number: number, message: value }),
  })
}