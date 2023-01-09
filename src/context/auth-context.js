import React, { useEffect, useState } from "react"

const AuthContext = React.createContext({
	isLoggedIn: false,
	onLogout: () => {},
	onLogIn: (email, password) => {},
})

export const AuthContextProvider = (props) => {
	const [isLoggedIn, setIsLoggedIn] = useState(false)
	console.log("rerender")
	useEffect(() => {
		const storedUser = localStorage.getItem("loggedIn")
		if (storedUser === "1") {
			setIsLoggedIn(true)
		}
	}, [])

	const logoutHandler = () => {
		localStorage.removeItem("loggedIn")
		setIsLoggedIn(false)
	}

	const loginHandler = () => {
		localStorage.setItem("loggedIn", "1")
		setIsLoggedIn(true)
	}

	return (
		<AuthContext.Provider
			value={{
				isLoggedIn: isLoggedIn,
				onLogout: logoutHandler,
				onLogIn: loginHandler,
			}}
		>
			{props.children}
		</AuthContext.Provider>
	)
}

export default AuthContext
