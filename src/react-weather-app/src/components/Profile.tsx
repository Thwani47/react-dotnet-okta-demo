import { UserClaims } from '@okta/okta-auth-js'
import { useOktaAuth } from '@okta/okta-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Profile() {
    const { authState, oktaAuth } = useOktaAuth()
    const [userInfo, setUserInfo] = useState<UserClaims | null>()
    const navigate = useNavigate()

    useEffect(() => {
        if (!authState || !authState.isAuthenticated) {
            setUserInfo(null)
        } else {
            setUserInfo(authState.idToken!.claims)
        }
    }, [authState, oktaAuth])

    if (!userInfo) {
        return <div>
            <p>Fetching user profile...</p>
        </div>
    }

    return (
        <div>
            <h1 className='font-bold text-3xl mb-2'>Profile</h1>
            <p>Name: {userInfo.name}</p>
            <p>Email: {userInfo.email}</p>
            <p>Preferred Username: {userInfo.preferred_username}</p>

            <button className="mt-4 text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-500 font-medium rounded-lg text-md px-5 py-2.5 mb-2 dark:bg-green-500 dark:hover:bg-green-600 focus:outline-none dark:focus:ring-green-600" onClick={() => navigate('/')}>Home</button>
        </div>
    )
}
