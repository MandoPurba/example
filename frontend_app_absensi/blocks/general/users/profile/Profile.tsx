"use client"

import UserAddressCard from '@/components/user-profile/UserAddressCard'
import UserInfoCard from '@/components/user-profile/UserInfoCard'
import UserMetaCard from '@/components/user-profile/UserMetaCard'
import { useUserStore } from '@/stores/useUserStore'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Profile() {
    const searchParams = useSearchParams()
    const id = searchParams.get('id')

    const { selectedUser, getUserById, isLoading } = useUserStore()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!id) return

        const fetchData = () => {
            setLoading(true)
            getUserById(id)
            setLoading(false)
        }

        fetchData()
    }, [id, getUserById])

    if (!selectedUser) {
        return (
            <div className="flex justify-center p-4 text-gray-500">
                User tidak ditemukan
            </div>
        )
    }
    return (
        <div>
            <UserMetaCard selectedUser={selectedUser} isLoading={isLoading} />
            <UserInfoCard selectedUser={selectedUser} isLoading={isLoading} />
            <UserAddressCard selectedUser={selectedUser} isLoading={isLoading } />
        </div>)
}
