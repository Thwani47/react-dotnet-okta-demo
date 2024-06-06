import { useOktaAuth } from "@okta/okta-react"
import { useNavigate } from "react-router-dom"

export default function Home() {
    const { authState, oktaAuth } = useOktaAuth()
    const navigate = useNavigate()

    const login = async () => {
        await oktaAuth.signInWithRedirect()
    }

    const logout = async () => {
        await oktaAuth.signOut()
    }
    
    return (
        <div className="space-y-2">
            <h1>React Weather App</h1>
            {authState?.isAuthenticated ? (
                <div className="flex flex-row space-x-4">
                    <button className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-500 font-medium rounded-lg text-md px-5 py-2.5 mb-2 dark:bg-red-500 dark:hover:bg-red-600 focus:outline-none dark:focus:ring-red-600" onClick={logout}>Logout</button>
                    <button className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-500 font-medium rounded-lg text-md px-5 py-2.5 mb-2 dark:bg-green-500 dark:hover:bg-green-600 focus:outline-none dark:focus:ring-green-600" onClick={() => navigate('/profile')}>Profile</button>
                </div>
            ) : (
                <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" onClick={login}>Login</button>
            )}
        </div>
    )
}
