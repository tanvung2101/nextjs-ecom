"use-client"

import { loginWithGoogle } from '@/apiRequests/auth-google'
import { Button } from '@/components/ui/button'

export default function ButtonLoginGoogle() {
    return (
        <div className='flex gap-3'>
            <Button
                className="flex-1 bg-[#DB4437] hover:bg-[#c33d2f]"
                onClick={loginWithGoogle}
            >
                Google
            </Button>
        </div>
    )
}
