'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

export default function TermsAndConditionsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center px-4 py-8">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-sm p-6 flex flex-col">

        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Registration
        </button>

        {/* Content */}
        <div className="flex-1">
          {loading ? <Skeleton /> : <TermsContent router={router} />}
        </div>

        {/* Footer */}
        {!loading && (
          <p className="text-xs text-gray-500 pt-6 border-t text-center mt-10">
            © {new Date().getFullYear()} SaaScraft Studio (India) Pvt. Ltd.
          </p>
        )}
      </div>
    </div>
  )
}

/* ---------------- Skeleton Loader ---------------- */

function Skeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-2/3" />
      <div className="h-4 bg-gray-200 rounded w-full" />
      <div className="h-4 bg-gray-200 rounded w-11/12" />
      <div className="h-4 bg-gray-200 rounded w-10/12" />
      <div className="h-4 bg-gray-200 rounded w-9/12" />
    </div>
  )
}

/* ---------------- Terms Content ---------------- */

function TermsContent({ router }: { router: ReturnType<typeof useRouter> }) {
  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-semibold text-gray-900">
        Coffee Event Registration – Terms & Conditions
      </h1>

      <p className="text-sm text-gray-600">
        By registering for the Coffee Event, you agree to the following
        Terms & Conditions. Please read them carefully before proceeding.
      </p>

      <section>
        <h2 className="font-medium text-gray-800 mb-2">
          1. Event Registration
        </h2>
        <p className="text-sm text-gray-600">
          Registration for the Coffee Event is subject to availability and
          successful submission of the registration form. Submission does not
          guarantee entry unless confirmed via email.
        </p>
      </section>

      <section>
        <h2 className="font-medium text-gray-800 mb-2">
          2. Coupon Code Usage
        </h2>
        <p className="text-sm text-gray-600">
          Coupon codes, if provided, must be entered correctly at the time of
          registration. Each coupon code is valid for a limited use and may
          expire without prior notice. Misuse or unauthorized sharing of
          coupon codes may result in cancellation of registration.
        </p>
      </section>

      <section>
        <h2 className="font-medium text-gray-800 mb-2">
          3. Email & Mobile Information
        </h2>
        <p className="text-sm text-gray-600">
          You are responsible for providing a valid email address and mobile
          number. All event-related communication, including registration
          confirmation, registration number, and QR code, will be sent to the
          registered email address.
        </p>
      </section>

      <section>
        <h2 className="font-medium text-gray-800 mb-2">
          4. Registration Confirmation
        </h2>
        <p className="text-sm text-gray-600">
          Upon successful registration, you will receive a confirmation email
          containing your unique registration number and QR code. This QR code
          may be required for event entry and verification.
        </p>
      </section>

      <section>
        <h2 className="font-medium text-gray-800 mb-2">
          5. Data Usage & Privacy
        </h2>
        <p className="text-sm text-gray-600">
          Personal information collected during registration will be used
          solely for event management, communication, and verification
          purposes. Your data will not be shared with third parties without
          consent, except where required by law.
        </p>
      </section>

      <section>
        <h2 className="font-medium text-gray-800 mb-2">
          6. Limitation of Liability
        </h2>
        <p className="text-sm text-gray-600">
          The event organizers shall not be liable for any loss, damage, or
          inconvenience arising from participation in the event, including
          technical issues, communication delays, or cancellation beyond
          reasonable control.
        </p>
      </section>

      <section>
        <h2 className="font-medium text-gray-800 mb-2">
          7. Amendments
        </h2>
        <p className="text-sm text-gray-600">
          The organizers reserve the right to modify these Terms & Conditions
          at any time. Continued use of the registration platform implies
          acceptance of the updated terms.
        </p>
      </section>

      {/* Accept Button */}
      <div className="pt-8 flex justify-center">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="bg-orange-600 hover:bg-orange-700 px-6">
              I Accept Terms & Conditions
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Confirm Acceptance
              </AlertDialogTitle>
              <AlertDialogDescription>
                By confirming, you acknowledge that you have read and agree to
                the Coffee Event Registration Terms & Conditions.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
              className="bg-orange-600 hover:bg-orange-700"
                onClick={() => router.back()}
              >
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
