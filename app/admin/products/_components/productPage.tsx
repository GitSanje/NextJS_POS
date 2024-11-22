// // import { useState } from 'react'
// // import { ChevronLeft, ChevronRight, Star, Heart } from 'lucide-react'
// // import { Button } from "@/components/ui/button"
// // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// // import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// export default function ProductPage() {
//   const [currentImage, setCurrentImage] = useState(0)
//   const images = [
//     '/placeholder.svg?height=600&width=400',
//     '/placeholder.svg?height=600&width=400',
//     '/placeholder.svg?height=600&width=400',
//     '/placeholder.svg?height=600&width=400'
//   ]

//   const nextImage = () => setCurrentImage((currentImage + 1) % images.length)
//   const prevImage = () => setCurrentImage((currentImage - 1 + images.length) % images.length)

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="grid md:grid-cols-2 gap-8">
//         <div className="relative">
//           <img
//             src={images[currentImage]}
//             alt={`Product image ${currentImage + 1}`}
//             className="w-full h-auto object-cover rounded-lg"
//           />
//           <button onClick={prevImage} className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2">
//             <ChevronLeft className="h-6 w-6" />
//           </button>
//           <button onClick={nextImage} className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2">
//             <ChevronRight className="h-6 w-6" />
//           </button>
//           <div className="flex justify-center mt-4 space-x-2">
//             {images.map((_, index) => (
//               <button
//                 key={index}
//                 onClick={() => setCurrentImage(index)}
//                 className={`w-3 h-3 rounded-full ${index === currentImage ? 'bg-primary' : 'bg-gray-300'}`}
//               />
//             ))}
//           </div>
//         </div>
//         <div>
//           <h1 className="text-3xl font-bold mb-2">Canada Goose Crofton Hoody Down Puffer Jacket</h1>
//           <div className="flex items-center mb-4">
//             <div className="flex">
//               {[...Array(5)].map((_, i) => (
//                 <Star key={i} className="h-5 w-5 fill-primary text-primary" />
//               ))}
//             </div>
//             <span className="ml-2 text-sm text-gray-600">4.8 (120 reviews)</span>
//           </div>
//           <p className="text-2xl font-bold mb-4">$850.00</p>
//           <div className="mb-4">
//             <h2 className="font-semibold mb-2">Color</h2>
//             <div className="flex space-x-2">
//               <button className="w-8 h-8 bg-black rounded-full border-2 border-gray-300"></button>
//               <button className="w-8 h-8 bg-blue-700 rounded-full border-2 border-gray-300"></button>
//               <button className="w-8 h-8 bg-red-700 rounded-full border-2 border-gray-300"></button>
//             </div>
//           </div>
//           <div className="mb-4">
//             <h2 className="font-semibold mb-2">Size</h2>
//             <Select>
//               <SelectTrigger className="w-full">
//                 <SelectValue placeholder="Select a size" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="xs">XS</SelectItem>
//                 <SelectItem value="s">S</SelectItem>
//                 <SelectItem value="m">M</SelectItem>
//                 <SelectItem value="l">L</SelectItem>
//                 <SelectItem value="xl">XL</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//           <Button className="w-full mb-4">Add to Bag</Button>
//           <Button variant="outline" className="w-full mb-4">
//             <Heart className="mr-2 h-4 w-4" /> Add to Wishlist
//           </Button>
//           <Tabs defaultValue="details" className="w-full">
//             <TabsList className="grid w-full grid-cols-3">
//               <TabsTrigger value="details">Details</TabsTrigger>
//               <TabsTrigger value="size">Size & Fit</TabsTrigger>
//               <TabsTrigger value="shipping">Shipping</TabsTrigger>
//             </TabsList>
//             <TabsContent value="details">
//               <p>The Crofton Hoody is a lightweight, packable down jacket that offers exceptional warmth and versatility. Made with durable ripstop fabric and filled with 750 fill power down, its perfect for layering or wearing on its own in cool weather.</p>
//               <ul className="list-disc list-inside mt-2">
//                 <li>100% polyester shell</li>
//                 <li>750 fill power down insulation</li>
//                 <li>Adjustable hood</li>
//                 <li>Two-way zipper</li>
//                 <li>Interior and exterior pockets</li>
//               </ul>
//             </TabsContent>
//             <TabsContent value="size">
//               <p>This jacket has a regular fit. For a more relaxed fit, we recommend sizing up. Refer to the size chart for detailed measurements.</p>
//             </TabsContent>
//             <TabsContent value="shipping">
//               <p>Free standard shipping on orders over $150. Expedited and international shipping options available at checkout.</p>
//             </TabsContent>
//           </Tabs>
//         </div>
//       </div>
//     </div>
//   )
// }