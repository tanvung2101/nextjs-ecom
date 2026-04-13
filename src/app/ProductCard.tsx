import { slugify } from '@/utils/slugify'
import { ShoppingCart, Star } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function ProductCard({name, basePrice, image, virtualPrice, id}: {name: string, image: string, basePrice: number, virtualPrice: number
, id: number}) {
    return (
        <div className='cursor-pointer border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white'>
            {false ? (<div className='relative aspect-square'>
                <Image width={50} height={40} src={'/public/'} alt='hello' className='object-cover' />
            </div>) : (<Link href={`/product/${slugify(name)}/${id}`} className='aspect-square bg-gray-100 flex items-center justify-center'>
                <span className='text-gray-400 text-sm'>
                    No Image Available
                </span>
            </Link>)}

            <div className='p-4 space-y-2'>
                <h3 className='text-lg font-bold text-gray-800 line-clamp-2'>
                    {name}
                </h3>

                <div className='flex items-center justify-between'>
                    <p className='text-red-600 font-bold'>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(basePrice)}
                    </p>
                    <p className="text-gray-400 text-sm line-through">
                        {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                        }).format(virtualPrice)}
                    </p>
                </div>
                <p className="text-orange-500 text-xs font-medium">
                    -{(virtualPrice - basePrice) / virtualPrice * 100 }% off
                </p>

                <div className='flex items-center justify-between text-xs text-gray-500 pt-2'>
                    <div className='flex items-center space-x-1'>
                        <Star className='w-4 h-4 text-yellow-400 fill-yellow-400' />
                        <span>1</span>
                    </div>

                    <div className='flex items-center space-x-1'>
                        <ShoppingCart className="w-4 h-4" />
                        <span>
                            {'0 Chưa bán'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}
