import { useOktaAuth } from "@okta/okta-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"


type HelloResponse = {
    message: string
}

type WeatherResponse = {
    date: string;
    temperatureC: number;
    summary: string;
}


export default function Home() {
    const { authState, oktaAuth } = useOktaAuth()
    const [hello, setHello] = useState<HelloResponse | null>(null)
    const [weather, setWeather] = useState<WeatherResponse[] | null>(null)
    const navigate = useNavigate()

    const login = async () => {
        await oktaAuth.signInWithRedirect()
    }

    const logout = async () => {
        await oktaAuth.signOut()
    }

    useEffect(() => {
        const getWeatherForecast = async () => {
            const accessToken = await oktaAuth.getAccessToken()
            const response = await fetch('http://localhost:5170/weatherforecast', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
            const data = await response.json()
            setWeather(data)
        }

        if (authState?.isAuthenticated) {
            getWeatherForecast()
        }
    }, [authState])

    



    useEffect(() => {
        const getHello = async () => {
            const response = await fetch('http://localhost:5170/hello')
            const data = await response.json()
            setHello(data)
        }
        getHello()

    }, [])

    return (
        <div className="space-y-2">
            <h1 className="font-bold text-3xl">React Weather App</h1>
            {authState?.isAuthenticated ? (
                <div className="flex flex-row space-x-4">
                    <button className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-500 font-medium rounded-lg text-md px-5 py-2.5 mb-2 dark:bg-red-500 dark:hover:bg-red-600 focus:outline-none dark:focus:ring-red-600" onClick={logout}>Logout</button>
                    <button className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-500 font-medium rounded-lg text-md px-5 py-2.5 mb-2 dark:bg-green-500 dark:hover:bg-green-600 focus:outline-none dark:focus:ring-green-600" onClick={() => navigate('/profile')}>Profile</button>

                </div>
            ) : (
                <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" onClick={login}>Login</button>
            )}

            {hello && <div>
                <h1 className="font-medium mb-1 text-red-300">Response from public endpoint: </h1>
                {hello.message}
            </div>}

            {weather && <div>
                <h1 className="font-medium mb-1 text-red-300">Weather Forecast: </h1>
                <div className="space-y-2">
                    {weather.map((w, index) => (
                        <div key={index} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                            <h1 className="font-medium">Date: {w.date}</h1>
                            <h1 className="font-medium">Temperature: {w.temperatureC}C</h1>
                            <h1 className="font-medium">Summary: {w.summary}</h1>
                        </div>
                    ))}
                </div>
            </div>}
        </div>
    )
}
