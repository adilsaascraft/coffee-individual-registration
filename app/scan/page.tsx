'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import useSWR from 'swr'
import { Html5Qrcode } from 'html5-qrcode'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, XCircle } from 'lucide-react'

type ScanDay = 'day1' | 'day2' | 'day3'

const DAY_API: Record<ScanDay, string> = {
  day1: '/api/registers/day1',
  day2: '/api/registers/day2',
  day3: '/api/registers/day3',
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

type ScanResult =
  | { type: 'success'; message: string }
  | { type: 'error'; message: string }
  | null

export default function QrScanner() {
  const scannerRef = useRef<Html5Qrcode | null>(null)

  const [activeDay, setActiveDay] = useState<ScanDay | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [result, setResult] = useState<ScanResult>(null)

  // ==========================
  // Live Count (SWR)
  // ==========================
  const { data, mutate } = useSWR(
    activeDay
      ? `${process.env.NEXT_PUBLIC_API_URL}${DAY_API[activeDay]}`
      : null,
    fetcher,
  )

  const count = data?.count ?? 0

  // ==========================
  // Professional Beep
  // ==========================
  const playBeep = (type: 'success' | 'error') => {
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.frequency.value = type === 'success' ? 880 : 220
    gain.gain.value = 0.15

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start()
    osc.stop(ctx.currentTime + 0.15)
  }

  // ==========================
  // Start Scan (SINGLE)
  // ==========================
  const startScan = async () => {
    if (!activeDay) return

    setResult(null)

    const scanner = new Html5Qrcode('qr-reader')
    scannerRef.current = scanner

    try {
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 260, height: 260 } },

        async (decodedText) => {
          // STOP IMMEDIATELY (single scan)
          await scanner.stop()
          setIsScanning(false)

          await markDelivered(decodedText)
        },

        () => {},
      )

      setIsScanning(true)
    } catch {
      setResult({
        type: 'error',
        message: 'Camera permission denied',
      })
    }
  }

  // ==========================
  // API Call
  // ==========================
  const markDelivered = async (regNum: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${DAY_API[activeDay!]}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ regNum }),
        },
      )

      const data = await res.json()
      if (!res.ok) throw new Error(data.message)

      playBeep('success')
      navigator.vibrate?.(120)

      setResult({ type: 'success', message: data.message })
      mutate()
    } catch (err: any) {
      playBeep('error')
      navigator.vibrate?.([80, 40, 80])

      setResult({
        type: 'error',
        message: err.message || 'Scan failed',
      })
    }
  }

  // Cleanup
  useEffect(() => {
    return () => {
      scannerRef.current?.stop().catch(() => {})
    }
  }, [])

  return (
    <div className="space-y-6">
      {/* ---------------- BANNER ---------------- */}
      <div className="relative w-full overflow-hidden">
        <Image
          src="https://res.cloudinary.com/dymanaa1j/image/upload/v1770199028/IICF_GFormBanner_agon5d.jpg"
          alt="Coffee Banner"
          width={1700}
          height={300}
          priority
          sizes="100vw"
          className="w-full h-auto object-contain"
        />
        <div className="absolute inset-0 bg-orange-900/30" />
      </div>

      {/* ---------------- DAY SELECT ---------------- */}
      <div className="flex justify-center gap-3">
        {(['day1', 'day2', 'day3'] as ScanDay[]).map((day) => (
          <Button
            key={day}
            variant={activeDay === day ? 'default' : 'outline'}
            onClick={() => setActiveDay(day)}
          >
            {day.toUpperCase()}
            {activeDay === day && (
              <Badge className="ml-2" variant="secondary">
                {count}
              </Badge>
            )}
          </Button>
        ))}
      </div>

      {/* ---------------- RESULT OVERLAY ---------------- */}
      {result && (
        <div
          className={`mx-auto max-w-sm rounded-lg p-3 flex items-center gap-2 text-white
            ${result.type === 'success' ? 'bg-green-600' : 'bg-red-600'}
          `}
        >
          {result.type === 'success' ? <CheckCircle2 /> : <XCircle />}
          <span className="font-semibold">{result.message}</span>
        </div>
      )}

      {/* ---------------- SCANNER ---------------- */}
      <div className="mx-auto w-full max-w-sm">
        <div id="qr-reader" className="rounded-xl border overflow-hidden" />
      </div>

      {/* ---------------- ACTION ---------------- */}
      <div className="max-w-sm mx-auto">
        <Button onClick={startScan} disabled={isScanning} className="w-full">
          {isScanning ? 'Scanning…' : 'Start Scan'}
        </Button>
      </div>
    </div>
  )
}
