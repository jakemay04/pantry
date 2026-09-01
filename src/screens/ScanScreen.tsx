import { useCallback, useRef, useState } from 'react'
import { findByBarcode, saveDraft } from '../db'
import { lookupProduct } from '../lib/off'
import { useBarcodeScanner } from '../lib/useBarcodeScanner'
import { ConfirmSheet } from '../components/ConfirmSheet'
import { Sheet } from '../components/Sheet'
import type { ItemDraft, LocationId } from '../types'

function emptyDraft(overrides: Partial<ItemDraft> = {}): ItemDraft {
  return {
    name: '',
    quantity: 1,
    location: 'fridge' as LocationId,
    ...overrides,
  }
}

export function ScanScreen() {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [camera, setCamera] = useState<'starting' | 'live' | 'unavailable'>('starting')
  const [cameraReason, setCameraReason] = useState('')
  const [draft, setDraft] = useState<ItemDraft | null>(null)
  const [lookingUp, setLookingUp] = useState(false)
  const [barcodeOpen, setBarcodeOpen] = useState(false)
  const [nameOpen, setNameOpen] = useState(false)
  const [typedBarcode, setTypedBarcode] = useState('')
  const [typedName, setTypedName] = useState('')

  const paused = draft !== null || barcodeOpen || nameOpen

  const openFromBarcode = useCallback(async (code: string) => {
    const barcode = code.trim()
    if (!barcode) return
    setBarcodeOpen(false)
    setLookingUp(true)
    setDraft(emptyDraft({ barcode, name: '' }))
    const [product, existing] = await Promise.all([
      lookupProduct(barcode),
      findByBarcode(barcode),
    ])
    setDraft({
      existingId: existing?.id,
      barcode,
      name: product?.name || existing?.name || '',
      brand: product?.brand || existing?.brand,
      imageUrl: product?.imageUrl || existing?.imageUrl,
      quantity: existing ? existing.quantity + 1 : 1,
      location: existing?.location ?? 'fridge',
      expiryDate: existing?.expiryDate,
    })
    setLookingUp(false)
  }, [])

  useBarcodeScanner(videoRef, {
    enabled: camera !== 'unavailable',
    paused,
    onDetect: (code) => {
      void openFromBarcode(code)
    },
    onLive: () => setCamera('live'),
    onUnavailable: (reason) => {
      setCamera('unavailable')
      setCameraReason(reason)
    },
  })

  const closeSheets = () => {
    setDraft(null)
    setLookingUp(false)
    setBarcodeOpen(false)
    setNameOpen(false)
    setTypedBarcode('')
    setTypedName('')
  }

  return (
    <div className="scan-screen">
      <video
        ref={videoRef}
        className="scan-video"
        muted
        playsInline
        autoPlay
      />
      <div className="scan-overlay">
        <div className="scan-copy">
          <p className="eyebrow light">Scan</p>
          <h1>Point at a barcode</h1>
          {camera === 'unavailable' ? (
            <p className="lede light">
              Camera isn’t available here. Enter a barcode or add an item by name.
              {cameraReason ? ` (${cameraReason})` : ''}
            </p>
          ) : (
            <p className="lede light">
              Groceries look up on Open Food Facts. Inventory stays on this device.
            </p>
          )}
        </div>
        <div className="viewfinder" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>
        <div className="scan-actions">
          <button type="button" className="ghost-btn" onClick={() => setBarcodeOpen(true)}>
            Enter barcode
          </button>
          <button type="button" className="ghost-btn" onClick={() => setNameOpen(true)}>
            No barcode
          </button>
        </div>
      </div>

      <Sheet
        open={barcodeOpen}
        title="Enter barcode"
        onClose={() => setBarcodeOpen(false)}
      >
        <form
          className="confirm-form"
          onSubmit={(event) => {
            event.preventDefault()
            void openFromBarcode(typedBarcode)
          }}
        >
          <label className="field">
            <span>Barcode</span>
            <input
              inputMode="numeric"
              autoComplete="off"
              autoFocus
              value={typedBarcode}
              placeholder="Type the numbers under the barcode"
              onChange={(event) => setTypedBarcode(event.target.value)}
            />
          </label>
          <button
            type="button"
            className="chip example-chip"
            onClick={() => setTypedBarcode('3017620422003')}
          >
            Try Nutella · 3017620422003
          </button>
          <button
            type="submit"
            className="primary-btn"
            disabled={!typedBarcode.trim()}
          >
            Look up
          </button>
        </form>
      </Sheet>

      <Sheet open={nameOpen} title="Add without barcode" onClose={() => setNameOpen(false)}>
        <form
          className="confirm-form"
          onSubmit={(event) => {
            event.preventDefault()
            const name = typedName.trim()
            if (!name) return
            setNameOpen(false)
            setTypedName('')
            setDraft(emptyDraft({ name }))
          }}
        >
          <label className="field">
            <span>Name</span>
            <input
              autoFocus
              value={typedName}
              placeholder="Produce, leftovers, bulk bins…"
              onChange={(event) => setTypedName(event.target.value)}
            />
          </label>
          <button type="submit" className="primary-btn" disabled={!typedName.trim()}>
            Continue
          </button>
        </form>
      </Sheet>

      <ConfirmSheet
        draft={draft}
        lookingUp={lookingUp}
        onChange={setDraft}
        onClose={closeSheets}
        onSave={() => {
          if (!draft) return
          void saveDraft(draft).then(closeSheets)
        }}
      />
    </div>
  )
}
