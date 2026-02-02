'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { apiRequest } from '@/lib/apiRequest'

/* -------------------- ZOD SCHEMA -------------------- */
const CoffeeSponsorSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email'),
    mobile: z.string().optional(),
    couponCode: z.string().min(1, 'Coupon code is required'),
})

type CoffeeSponsorForm = z.infer<typeof CoffeeSponsorSchema>

/* -------------------- PAGE -------------------- */
export default function CoffeeSponsorPage() {
    const [submitting, setSubmitting] = useState(false)
    const [success, setSuccess] = useState(false)

    // ✅ Checkbox state (same as SignupForm)
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
            await apiRequest({
                endpoint: '/api/registers',
                method: 'POST',
                body: data,
            })

            toast.success('Registration successful ☕', {
                description: 'Your coffee registration is complete.',
            })

            setSuccess(true)
        } catch (error: any) {
            toast.error('Registration failed', {
                description: error.message,
            })
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="flex min-h-svh flex-col bg-gradient-to-b from-orange-50 to-orange-100">
            {/* ---------------- COFFEE BANNER ---------------- */}
            <div className="relative w-full overflow-hidden h-[200px] md:h-[280px] lg:h-[450px]">
                <Image
                    src="https://res.cloudinary.com/dymanaa1j/image/upload/v1770021105/ChatGPT_Image_Feb_2_2026_02_00_00_PM_1_b6chc9.png"
                    alt="Coffee Banner"
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover object-center"
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
                                    <h1 className="text-2xl sm:text-3xl font-bold text-orange-600">
                                        Coffee Registration Form ☕
                                    </h1>
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
                                            <Label>Name</Label>
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
                                            <Label>Email</Label>
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
                                            <Label>Mobile (optional)</Label>
                                            <Input {...field} placeholder="Enter mobile number" />
                                        </div>
                                    )}
                                />

                                {/* Coupon */}
                                <Controller
                                    name="couponCode"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="grid gap-2">
                                            <Label>Coupon Code</Label>
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
                                            href="/individual-registration/term-and-condition"
                                            className="text-orange-600 font-medium hover:underline"
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
                                    className="w-full bg-orange-500 hover:bg-orange-600"
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
                                    <span className="absolute inset-0 rounded-full bg-orange-300 blur-xl opacity-40 animate-ping" />
                                    <CheckCircle2 className="relative h-20 w-20 text-orange-500 animate-bounce" />
                                </div>

                                {/* Title */}
                                <h2 className="text-3xl font-extrabold text-orange-600 animate-fade-in">
                                    Registration Successful! 🎉
                                </h2>

                                {/* Message */}
                                <p className="max-w-sm text-sm text-gray-600 animate-fade-in delay-100">
                                    Thank you for registering for Coffee ☕
                                    Your registration has been completed successfully.
                                </p>

                                {/* Email Info Card */}
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

                                {/* Action */}
                                <Button
                                    onClick={handleNewRegistration}
                                    className="mt-4 w-full max-w-xs bg-orange-500 hover:bg-orange-600 transition-all duration-300 hover:scale-105"
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
