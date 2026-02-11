'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Html5Qrcode } from 'html5-qrcode'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

type ScanDay = 'day1' | 'day2' | 'day3'

const DAY_API: Record<ScanDay, string> = {
  day1: '/api/scan/day1',
  day2: '/api/scan/day2',
  day3: '/api/scan/day3',
}

export default function QrScanner() {
  const scannerRef = useRef<Html5Qrcode | null>(null)

  const [activeDay, setActiveDay] = useState<ScanDay | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [scanCount, setScanCount] = useState(0)
  const scannedSet = useRef<Set<string>>(new Set())

  // ==========================
  // Start Scan
  // ==========================
  const startScan = async () => {
    if (!activeDay) {
      toast.error('Please select a day first')
      return
    }

    const scanner = new Html5Qrcode('qr-reader')
    scannerRef.current = scanner

    try {
      await scanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 260, height: 260 },
        },

        async (decodedText) => {
          // ❌ Prevent duplicate scan (same session)
          if (scannedSet.current.has(decodedText)) return
          scannedSet.current.add(decodedText)

          // 🔔 Vibration
          if (navigator.vibrate) navigator.vibrate(150)

          await handleQrResult(decodedText)

          // 🎉 Success animation
          flashSuccess()

          // 📊 Increment counter
          setScanCount((prev) => prev + 1)
        },

        () => {} // required by TS
      )

      setIsScanning(true)
    } catch (err) {
      console.error(err)
      toast.error('Camera permission denied or not available')
    }
  }

  // ==========================
  // Stop Scan
  // ==========================
  const stopScan = async () => {
    await scannerRef.current?.stop().catch(() => {})
    setIsScanning(false)
  }

  // ==========================
  // API Call
  // ==========================
  const handleQrResult = async (qrValue: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${DAY_API[activeDay!]}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ qrCode: qrValue }),
        }
      )

      const data = await res.json()
      if (!res.ok) throw new Error(data.message)

      toast.success('Marked successfully')
    } catch (err: any) {
      toast.error(err.message || 'Scan failed')
    }
  }

  // ==========================
  // Success Animation
  // ==========================
  const flashSuccess = () => {
    const el = document.getElementById('success-ring')
    if (!el) return
    el.classList.remove('animate-ping')
    void el.offsetWidth
    el.classList.add('animate-ping')
  }

  // Cleanup
  useEffect(() => {
    return () => {
      scannerRef.current?.stop().catch(() => {})
    }
  }, [])

  // Reset on day change
  useEffect(() => {
    stopScan()
    scannedSet.current.clear()
    setScanCount(0)
  }, [activeDay])

  return (
    <div className="space-y-6">
      {/* ---------------- COFFEE BANNER ---------------- */}
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
      <div className="flex gap-3 justify-center">
        {(['day1', 'day2', 'day3'] as ScanDay[]).map((day) => (
          <Button
            key={day}
            variant={activeDay === day ? 'default' : 'outline'}
            onClick={() => setActiveDay(day)}
          >
            Scan {day.toUpperCase()}
          </Button>
        ))}
      </div>

      {/* ---------------- SCANNER ---------------- */}
      <div className="relative mx-auto w-full max-w-sm">
        <div
          id="qr-reader"
          className="rounded-xl overflow-hidden border"
        />

        {/* 🎉 success ring */}
        <div
          id="success-ring"
          className="pointer-events-none absolute inset-0 rounded-xl bg-green-400/30"
        />
      </div>

      {/* ---------------- STATS ---------------- */}
      {activeDay && (
        <p className="text-center font-semibold">
          📊 {scanCount} scanned for {activeDay.toUpperCase()}
        </p>
      )}

      {/* ---------------- ACTIONS ---------------- */}
      <div className="max-w-sm mx-auto space-y-2">
        {!isScanning ? (
          <Button onClick={startScan} className="w-full">
            Start Scanning
          </Button>
        ) : (
          <Button variant="destructive" onClick={stopScan} className="w-full">
            Stop Scanning
          </Button>
        )}
      </div>
    </div>
  )
}
