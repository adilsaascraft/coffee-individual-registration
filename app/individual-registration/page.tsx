'use client'

import { useState } from 'react'
import Image from 'next/image'
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
  terms: z.literal(true, {
    message: 'You must accept terms & conditions',
  }),
})

type CoffeeSponsorForm = z.infer<typeof CoffeeSponsorSchema>

/* -------------------- PAGE -------------------- */
export default function CoffeeSponsorPage() {
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CoffeeSponsorForm>({
    resolver: zodResolver(CoffeeSponsorSchema),
    defaultValues: {
      name: '',
      email: '',
      mobile: '',
      couponCode: '',
      terms: undefined,
    },
  })


  // On Submit Function

const onSubmit = async (data: CoffeeSponsorForm) => {
  if (submitting) return
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
      description: error.message, // 👈 THIS WILL SHOW:
      // "Email already registered"
      // "Mobile number already registered"
      // "Invalid coupon code"
    })
  } finally {
    setSubmitting(false)
  }
}



  return (
    <div className="flex min-h-svh flex-col bg-gradient-to-b from-orange-50 to-orange-100">
      {/* ---------------- COFFEE BANNER ---------------- */}
      <div
        className="
          relative w-full overflow-hidden
          h-[200px] md:h-[280px] lg:h-[450px]
        "
      >
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
                      <Input
                        {...field}
                        placeholder="Enter your full name"
                      />
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
                      <Input
                        {...field}
                        placeholder="Enter mobile number"
                      />
                    </div>
                  )}
                />

                {/* Coupon Code */}
                <Controller
                  name="couponCode"
                  control={control}
                  render={({ field }) => (
                    <div className="grid gap-2">
                      <Label>Coupon Code</Label>
                      <Input
                        {...field}
                        placeholder="Enter coupon code"
                      />
                      {errors.couponCode && (
                        <p className="text-sm text-red-500">
                          {errors.couponCode.message}
                        </p>
                      )}
                    </div>
                  )}
                />

                {/* Terms */}
                <Controller
                  name="terms"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) =>
                          field.onChange(checked === true)
                        }
                      />
                      <Label className="text-sm">
                        I agree to the terms & conditions
                      </Label>
                    </div>
                  )}
                />
                {errors.terms && (
                  <p className="text-sm text-red-500">
                    {errors.terms.message}
                  </p>
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
              <div className="flex flex-col items-center gap-4 py-10 text-center">
                <CheckCircle2 className="h-14 w-14 text-orange-500" />
                <h2 className="text-2xl font-bold">
                  Thank you for registering! ☕
                </h2>
                <p className="text-muted-foreground">
                  Your registration means a lot to us ❤️
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
