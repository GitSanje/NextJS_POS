'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useSearchParams } from 'next/navigation'

export default function PaymentSuccessContent() {

const searchParams = useSearchParams()
const orderNumber = searchParams.get("id")
const rawAmount = searchParams.get("amount")
const sanitizedAmount = rawAmount?.split("?")[0];
const formattedAmount = sanitizedAmount ? (Number(sanitizedAmount) / 100).toFixed(2) : '0.00'
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-green-700">Payment Successful!</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          >
            <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
          </motion.div>
          <p className="text-lg mb-4">Thank you for your purchase!</p>
          {orderNumber && (
            <p className="text-gray-600 mb-4">
              Your order number is: <span className="font-semibold">{orderNumber}</span>
            </p>
          )}
          <p className="text-sm text-gray-500">
            We&apos;ve sent a invoice to your email. please check it out.
          </p>
          <div className="bg-white p-2 rounded-md text-purple-500 mt-5 text-4xl font-bold">
          Rs {formattedAmount}
        </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button asChild className="w-full">
            <Link href="/order">View Order Status</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

