import { useEffect, useRef, type RefObject } from 'react'

const PRODUCT_FORMATS = [
  'ean_13',
  'ean_8',
  'upc_a',
  'upc_e',
  'code_128',
  'code_39',
  'itf',
]

type ScannerOptions = {
  enabled: boolean
  paused: boolean
  onDetect: (code: string) => void
  onLive: () => void
  onUnavailable: (reason: string) => void
}

export function useBarcodeScanner(
  videoRef: RefObject<HTMLVideoElement | null>,
  { enabled, paused, onDetect, onLive, onUnavailable }: ScannerOptions,
) {
  const onDetectRef = useRef(onDetect)
  const onLiveRef = useRef(onLive)
  const onUnavailableRef = useRef(onUnavailable)
  const pausedRef = useRef(paused)
  const ignoreUntilRef = useRef(0)

  useEffect(() => {
    onDetectRef.current = onDetect
    onLiveRef.current = onLive
    onUnavailableRef.current = onUnavailable
    pausedRef.current = paused
  }, [onDetect, onLive, onUnavailable, paused])

  useEffect(() => {
    if (paused) {
      ignoreUntilRef.current = Date.now() + 2500
    }
  }, [paused])

  useEffect(() => {
    if (!enabled) return

    const video = videoRef.current
    if (!video) return

    let stopped = false
    let stream: MediaStream | null = null
    let raf = 0
    let zxingStop: (() => void) | undefined

    const emit = (raw: string) => {
      const code = raw.trim()
      if (!code) return
      if (pausedRef.current) return
      if (Date.now() < ignoreUntilRef.current) return
      ignoreUntilRef.current = Date.now() + 1500
      onDetectRef.current(code)
    }

    const startNativeLoop = async () => {
      const Detector = window.BarcodeDetector
      if (!Detector) return false

      let formats = PRODUCT_FORMATS
      try {
        const supported = await Detector.getSupportedFormats()
        const overlap = PRODUCT_FORMATS.filter((f) => supported.includes(f))
        if (overlap.length) formats = overlap
      } catch {
        // use defaults
      }

      const detector = new Detector({ formats })

      const tick = async () => {
        if (stopped) return
        if (
          !pausedRef.current &&
          video.readyState >= 2 &&
          video.videoWidth > 0
        ) {
          try {
            const codes = await detector.detect(video)
            const value = codes[0]?.rawValue
            if (value) emit(value)
          } catch {
            // frame wasn't readable yet
          }
        }
        raf = window.requestAnimationFrame(() => {
          void tick()
        })
      }

      void tick()
      return true
    }

    const startZxing = async (mediaStream: MediaStream) => {
      const { BrowserMultiFormatReader } = await import('@zxing/browser')
      const reader = new BrowserMultiFormatReader()
      const controls = await reader.decodeFromStream(mediaStream, video, (result) => {
        if (result) emit(result.getText())
      })
      zxingStop = () => controls.stop()
    }

    const start = async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          onUnavailableRef.current('Camera APIs are not available in this browser.')
          return
        }

        video.setAttribute('playsinline', 'true')
        video.setAttribute('autoplay', 'true')
        video.muted = true
        video.playsInline = true

        stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            facingMode: { ideal: 'environment' },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        })
        if (stopped) {
          stream.getTracks().forEach((track) => track.stop())
          return
        }

        video.srcObject = stream
        await video.play()
        if (stopped) return
        onLiveRef.current()

        const native = await startNativeLoop()
        if (!native) await startZxing(stream)
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Could not open the camera.'
        onUnavailableRef.current(message)
      }
    }

    void start()

    return () => {
      stopped = true
      window.cancelAnimationFrame(raf)
      zxingStop?.()
      const media = video.srcObject
      if (media instanceof MediaStream) {
        media.getTracks().forEach((track) => track.stop())
      }
      stream?.getTracks().forEach((track) => track.stop())
      video.srcObject = null
    }
  }, [enabled, videoRef])
}
