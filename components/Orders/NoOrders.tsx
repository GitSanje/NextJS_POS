import { PackageX } from 'lucide-react'
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function NoOrders() {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">No Orders Placed</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <PackageX className="w-16 h-16 text-muted-foreground" />
        <p className="text-center text-muted-foreground">
          You haven&apos;t placed any orders yet. Start shopping to see your orders here!
        </p>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button asChild>
          <Link href="/products">Start Shopping</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

