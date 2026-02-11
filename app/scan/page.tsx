'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import useSWR from 'swr'
import { Html5Qrcode } from 'html5-qrcode'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

type ScanDay = 'day1' | 'day2' | 'day3'

const DAY_API: Record<ScanDay, string> = {
  day1: '/api/registers/day1',
  day2: '/api/registers/day2',
  day3: '/api/registers/day3',
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function QrScanner() {
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const scannedSet = useRef<Set<string>>(new Set())

  const [activeDay, setActiveDay] = useState<ScanDay | null>(null)
  const [isScanning, setIsScanning] = useState(false)

  // ==========================
  // SWR – Live Count
  // ==========================
  const { data, mutate } = useSWR(
    activeDay
      ? `${process.env.NEXT_PUBLIC_API_URL}${DAY_API[activeDay]}`
      : null,
    fetcher
  )

  const count = data?.count ?? 0

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
        { fps: 10, qrbox: { width: 260, height: 260 } },

        async (decodedText) => {
          // ❌ prevent duplicate scan in same session
          if (scannedSet.current.has(decodedText)) return
          scannedSet.current.add(decodedText)

          // 🔔 vibration
          navigator.vibrate?.(150)

          await markDelivered(decodedText)

          // 🎉 success animation
          flashSuccess()

          // 🔁 revalidate count instantly
          mutate()
        },

        () => {}
      )

      setIsScanning(true)
    } catch {
      toast.error('Camera permission denied or unavailable')
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
  // POST API
  // ==========================
  const markDelivered = async (regNum: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${DAY_API[activeDay!]}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ regNum }), // ✅ backend expects this
        }
      )

      const data = await res.json()
      if (!res.ok) throw new Error(data.message)

      toast.success(data.message)
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
  }, [activeDay])

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

      {/* ---------------- SCANNER ---------------- */}
      <div className="relative mx-auto w-full max-w-sm">
        <div id="qr-reader" className="rounded-xl border overflow-hidden" />
        <div
          id="success-ring"
          className="pointer-events-none absolute inset-0 rounded-xl bg-green-400/30"
        />
      </div>

      {/* ---------------- ACTIONS ---------------- */}
      <div className="max-w-sm mx-auto">
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
