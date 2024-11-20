import { Lock, ShoppingCart, HelpCircle, ChevronDown } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Checkout Form */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                <h1 className="text-2xl font-semibold">Secure Checkout</h1>
                <span className="text-gray-500">powered by Borderfree</span>
              </div>
              <Select defaultValue="english">
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="nepali">नेपाली</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="text-sm mb-6">
              Already have a Borderfree account? Click{" "}
              <Button variant="link" className="p-0 h-auto font-normal">
                here
              </Button>
              <HelpCircle className="inline h-4 w-4 ml-1" />
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">
                  1
                </div>
                <h2 className="text-xl font-semibold">Delivery</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Email" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="First Name" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Last Name" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" placeholder="Address" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="address2">Address 2 (Optional)</Label>
                    <Input id="address2" placeholder="Address 2 (Optional)" />
                  </div>
                  <div>
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input id="postalCode" placeholder="Postal Code" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="City" />
                  </div>
                  <div>
                    <Label htmlFor="region">Region (Optional)</Label>
                    <Input id="region" placeholder="Region (Optional)" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" type="tel" placeholder="Phone" />
                  </div>
                  <div>
                    <Label htmlFor="country">Location</Label>
                    <Select defaultValue="nepal">
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nepal">Nepal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Card>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="font-semibold">Delivery Method</div>
                      <div className="font-semibold">Estimated Arrival</div>
                      <div className="font-semibold">Shipping Cost</div>
                    </div>
                    <RadioGroup defaultValue="express" className="mt-4">
                      <div className="flex items-center space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem value="express" id="express" />
                        <Label htmlFor="express" className="flex-1 grid grid-cols-3 gap-4">
                          <span>Express</span>
                          <span>7-14 business days</span>
                          <span>(NPR) Rs.17,116.60</span>
                        </Label>
                      </div>
                    </RadioGroup>
                    <p className="text-sm italic mt-2">Import charges collected upon delivery</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    <h2 className="text-xl font-semibold">Your Order</h2>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Items</span>
                    <span>Rs.264,394.50</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <span>Shipping</span>
                      <HelpCircle className="h-4 w-4" />
                    </div>
                    <span>Rs.17,116.60</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <span>Duties & Taxes</span>
                      <HelpCircle className="h-4 w-4" />
                    </div>
                    <span className="text-red-500">UNPAID</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center font-semibold">
                      <span>TOTAL</span>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">(NPR)</div>
                        <div className="text-xl">Rs.281,511.10</div>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full" size="lg">
                    Continue
                  </Button>

                  <div className="border-t pt-4">
                    <Button variant="link" className="p-0 text-primary">
                      + Promo Code
                    </Button>
                  </div>

                  {/* Product List */}
                  <div className="space-y-4 border-t pt-4">
                    <div className="flex gap-4">
                      <img
                        src="/placeholder.svg?height=80&width=80"
                        alt="Canada Goose Jacket"
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">Canada Goose Crofton Hoody Down Puffer Jacket</h3>
                        <p className="text-sm text-gray-600">Size: Small</p>
                        <p className="text-sm text-gray-600">Qty: 1</p>
                        <p className="font-semibold">Rs.132,197.25</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <img
                        src="/placeholder.svg?height=80&width=80"
                        alt="Canada Goose Jacket"
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">Canada Goose Crofton Hoody Down Puffer Jacket</h3>
                        <p className="text-sm text-gray-600">Size: Medium</p>
                        <p className="text-sm text-gray-600">Qty: 1</p>
                        <p className="font-semibold">Rs.132,197.25</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}