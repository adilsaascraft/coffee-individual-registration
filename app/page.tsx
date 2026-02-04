'use client'

import { useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import * as htmlToImage from 'html-to-image'
import Image from 'next/image'
import Link from 'next/link'
import { useForm, Controller } from 'react-hook-form'
import { CoffeeSponsorSchema, CoffeeSponsorForm } from '@/validations/registrationSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, CheckCircle2, Download } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { apiRequest } from '@/lib/apiRequest'



/* -------------------- PAGE -------------------- */
export default function CoffeeSponsorPage() {
    const [submitting, setSubmitting] = useState(false)
    const [success, setSuccess] = useState(false)
    const [regNum, setRegNum] = useState<string | null>(null)
    const [showQr, setShowQr] = useState(false)
    const [agree, setAgree] = useState(false)
    const [termsError, setTermsError] = useState<string | null>(null)
    
    const {
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<CoffeeSponsorForm>({
        resolver: zodResolver(CoffeeSponsorSchema),
        defaultValues: {
            name: '',
            email: '',
            mobile: '',
            couponCode: '',
        },
    })

    

    /* ---------------- Reset Helper ---------------- */
    const handleNewRegistration = () => {
        reset()
        setAgree(false)
        setTermsError(null)
        setSuccess(false)
    }

    /* ---------------- Submit ---------------- */
    const onSubmit = async (data: CoffeeSponsorForm) => {
        if (submitting) return

        // ✅ Manual checkbox validation
        if (!agree) {
            setTermsError('Please accept Terms & Conditions.')
            return
        }

        setTermsError(null)
        setSubmitting(true)

        try {
            const response = await apiRequest({
                endpoint: '/api/registers',
                method: 'POST',
                body: data,
            })

            toast.success('Registration successful ☕', {
                description: 'Your coffee registration is complete.',
            })
            setRegNum(response.register.regNum)
            setSuccess(true)
            // ⏳ Delay QR rendering
            setTimeout(() => {
                setShowQr(true)
            }, 1500)
        } catch (error: any) {
            toast.warning('Registration failed', {
                description: error.message,
            })
        } finally {
            setSubmitting(false)
        }
    }

    // QR Code generating helper function
    const downloadQrCard = async () => {
        const node = document.getElementById('coffee-qr-card')
        if (!node) return

        try {
            const dataUrl = await htmlToImage.toPng(node, {
                backgroundColor: '#ffffff',
                pixelRatio: 2, // sharper image
            })

            const link = document.createElement('a')
            link.download = `${regNum}-coffee-pass.png`
            link.href = dataUrl
            link.click()
        } catch (error) {
            toast.error('Failed to download QR card')
        }
    }



    return (
        <div className="flex min-h-svh flex-col bg-gradient-to-b from-orange-50 to-orange-100">
            {/* ---------------- COFFEE BANNER ---------------- */}
<div className="relative w-full overflow-hidden">
  <Image
    src="https://res.cloudinary.com/dymanaa1j/image/upload/v1770199028/IICF_GFormBanner_agon5d.jpg"
    alt="Coffee Banner"
    width={1920}   // 👈 original image width
    height={600}   // 👈 original image height
    priority
    sizes="100vw"
    className="w-full h-auto object-contain"
  />
  <div className="absolute inset-0 bg-orange-900/30" />
</div>


            {/* ---------------- MAIN CONTENT ---------------- */}
            <div className="flex flex-1 items-center justify-center px-4 py-10">
                <Card className="w-full max-w-md sm:max-w-lg shadow-xl border-orange-200 bg-white">
                    <CardContent className="p-6 sm:p-8">
                        {!success ? (
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                <div className="text-center">
                                    <h1 className="text-2xl sm:text-2xl font-bold text-amber-800 hover:text-amber-900"
                                    >India International Coffee Festival (IICF) 2026 ☕</h1>
                                    <h2 className="text-sm sm:text-xl font-bold text-gray-600">
                                        Registration Form
                                    </h2>
                                    <p className="text-sm text-muted-foreground">
                                        Please fill the form to register
                                    </p>
                                </div>

                                {/* Name */}
                                <Controller
                                    name="name"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="grid gap-2">
                                            <Label>Name *</Label>
                                            <Input {...field} placeholder="Enter your full name" />
                                            {errors.name && (
                                                <p className="text-sm text-red-500">
                                                    {errors.name.message}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                />

                                {/* Email */}
                                <Controller
                                    name="email"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="grid gap-2">
                                            <Label>Email *</Label>
                                            <Input
                                                type="email"
                                                {...field}
                                                placeholder="Enter your email address"
                                            />
                                            {errors.email && (
                                                <p className="text-sm text-red-500">
                                                    {errors.email.message}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                />

                                {/* Mobile */}

                                <Controller
                                    name="mobile"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="grid gap-2">
                                            <Label>Mobile *</Label>
                                            <Input
                                                type="number"
                                                {...field}
                                                placeholder="Enter your mbile number"
                                            />
                                            {errors.mobile && (
                                                <p className="text-sm text-red-500">
                                                    {errors.mobile.message}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                />

                                {/* Coupon */}
                                <Controller
                                    name="couponCode"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="grid gap-2">
                                            <Label>Coupon Code *</Label>
                                            <Input {...field} placeholder="Enter coupon code" />
                                            {errors.couponCode && (
                                                <p className="text-sm text-red-500">
                                                    {errors.couponCode.message}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                />

                                {/* ✅ Terms Checkbox (UPDATED) */}
                                <div className="flex items-start gap-2">
                                    <Checkbox
                                        id="terms"
                                        checked={agree}
                                        onCheckedChange={(v) => setAgree(!!v)}
                                    />
                                    <Label htmlFor="terms" className="text-sm leading-relaxed">
                                        I agree to{' '}
                                        <Link
                                            href="/term-and-condition"
                                            className="text-amber-800 hover:text-amber-900 font-medium hover:underline"
                                        >
                                            Terms & Conditions
                                        </Link>
                                    </Label>
                                </div>

                                {termsError && (
                                    <p className="text-sm text-red-500">{termsError}</p>
                                )}

                                <Button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full bg-amber-800 hover:bg-amber-900"
                                >
                                    {submitting && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    Register Now
                                </Button>
                            </form>
                        ) : (
                            /* ---------------- SUCCESS SCREEN ---------------- */
                            <div className="relative flex flex-col items-center gap-6 py-12 text-center overflow-hidden">
                                {/* Glow background */}
                                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-orange-100 via-orange-50 to-white animate-pulse" />

                                {/* Animated check */}
                                <div className="relative">
                                    <span className="absolute inset-0 rounded-full bg-amber-800 hover:bg-amber-900 blur-xl opacity-40 animate-ping" />
                                    <CheckCircle2 className="relative h-20 w-20 text-amber-800 hover:text-amber-900 animate-bounce" />
                                </div>

                                {/* Title */}
                                <h2 className="text-3xl font-extrabold text-amber-800 hover:text-amber-900 animate-fade-in">
                                    Registration Successful! 🎉
                                </h2>

                                {/* Message */}
                                <p className="max-w-sm text-sm text-gray-600 animate-fade-in delay-100">
                                    Thank you for registering for <span className='text-amber-800 hover:text-amber-900' >India International Coffee Festival (IICF) 2026</span> ☕
                                    Your registration has been completed successfully.
                                </p>

                                {/* Email Info Card (UNCHANGED) */}
                                <div className="w-full max-w-sm rounded-xl border border-orange-200 bg-orange-50 p-4 shadow-sm animate-slide-up">
                                    <p className="text-sm text-orange-700 font-medium">
                                        📩 Check your email!
                                    </p>
                                    <p className="mt-1 text-xs text-gray-600">
                                        You will receive a <strong>registration email</strong> containing your
                                        <strong> registration number</strong> and a
                                        <strong> QR code</strong> for verification.
                                    </p>
                                </div>

                                {/* ================= QR SECTION (ADDED) ================= */}
                                {!showQr ? (
                                    /* ⏳ QR Generating State */
                                    <div className="mt-4 flex flex-col items-center gap-3 animate-fade-in">
                                        <Loader2 className="h-7 w-7 animate-spin text-orange-500" />
                                        <p className="text-sm text-gray-600">
                                            QR Code is being generated…
                                        </p>
                                    </div>
                                ) : (
                                    /* ✅ QR CARD */
                                    <>
                                        <div className="p-6 bg-transparent">
  <div
    id="coffee-qr-card"
    className="
      w-[320px]
      rounded-3xl
      border-2 border-amber-800
      bg-white
      shadow-xl
      overflow-hidden
    "
  >
    {/* HEADER STRIP */}
    <div className="bg-amber-800 px-4 py-3 text-center">
      <h3 className="text-sm font-bold text-white leading-tight">
        India International Coffee Festival
      </h3>
      <p className="text-[11px] text-amber-100">
        IICF 2026
      </p>
    </div>

    {/* BODY */}
    <div className="px-5 py-4 text-center">
      <p className="text-sm font-semibold text-amber-800 mb-4">
        🎟️ Your Free Entry Pass
      </p>

      {/* QR */}
      <div className="flex justify-center mb-4">
        <div className="rounded-2xl border-4 border-amber-700 bg-white p-3 shadow-md">
          <QRCodeCanvas
            value={regNum ?? ""}
            size={170}
            bgColor="#ffffff"
            fgColor="#000000"
            level="H"
          />
        </div>
      </div>
    </div>

    {/* FOOTER */}
    <div className="border-t bg-amber-50 px-4 py-2 text-center">
      <p className="text-[11px] font-medium text-amber-800">
        Show at venue to participate
      </p>
    </div>
  </div>
</div>


                                        {/* Download Button */}
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={downloadQrCard}
                                            className="
        mt-3 w-full gap-2
        border-amber-800
        text-amber-700
        hover:bg-amber-50
      "
                                        >
                                            <Download className="h-4 w-4" />
                                            Download Entry QR
                                        </Button>
                                    </>
                                )}

                                {/* ================= END QR SECTION ================= */}

                                {/* Action (UNCHANGED POSITION, QR IS ABOVE THIS) */}
                                <Button
                                    onClick={handleNewRegistration}
                                    className="mt-4 w-full max-w-xs bg-amber-800 hover:bg-amber-900 transition-all duration-300 hover:scale-105"
                                >
                                    New Registration
                                </Button>

                                {/* Brand note */}
                                <p className="mt-4 text-xs text-gray-400 animate-fade-in delay-200">
                                    Brewed with ❤️ by SaaScraft Studio India Pvt. Ltd
                                </p>
                            </div>


                        )}
                    </CardContent>
                </Card>
            </div>

            {/* ---------------- FOOTER ---------------- */}
            <footer className="border-t bg-white/70 backdrop-blur">
                <div className="mx-auto max-w-7xl px-4 py-4 text-center text-xs text-gray-600">
                    © {new Date().getFullYear()} All Rights Reserved.
                    Powered by SaaScraft Studio (India) Pvt. Ltd.
                </div>
            </footer>
        </div>
    )
}
