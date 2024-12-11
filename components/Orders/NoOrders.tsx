import { PackageX, ShoppingBag } from 'lucide-react'
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function NoOrders({Title,dis, icon}:{
  Title:string;
  dis:string;
  icon?: string
}) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">{Title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
       { icon ? <ShoppingBag className="w-16 h-16 text-muted-foreground" />: <PackageX className="w-16 h-16 text-muted-foreground" />} 
        <p className="text-center text-muted-foreground">
   
          {dis}
        </p>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button asChild>
          <Link href="/shop">Start Shopping</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

