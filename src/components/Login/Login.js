import React, {
	useContext,
	useEffect,
	useReducer,
	useRef,
	useState,
} from "react"

import Card from "../UI/Card/Card"
import classes from "./Login.module.css"
import Button from "../UI/Button/Button"
import AuthContext from "../../context/auth-context"
import Input from "../UI/Input/Input"

const emailReducer = (prevState, action) => {
	if (action.type === "USER_INPUT") {
		return { value: action.val, isValid: action.val.includes("@") }
	}
	if (action.type === "INPUT_BLUR") {
		return {
			value: prevState.value,
			isValid: prevState.value.includes("@"),
		}
	}
	return { value: "", isValid: false }
}
const passwordReducer = (prevState, action) => {
	if (action.type === "USER_INPUT") {
		return { value: action.val, isValid: action.val.trim().length > 6 }
	}
	if (action.type === "INPUT_BLUR") {
		return {
			value: prevState.value,
			isValid: prevState.value.trim().length > 6,
		}
	}
	return { value: "", isValid: false }
}

const Login = (props) => {
	const [formIsValid, setFormIsValid] = useState(false)

	const [emailState, dispatchEmail] = useReducer(emailReducer, {
		value: "",
		isValid: false,
	})
	const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
		value: "",
		isValid: false,
	})

	const ctx = useContext(AuthContext)

	const emailInputRef = useRef()
	const passwordInputRef = useRef()

	const { isValid: emailValid } = emailState
	const { isValid: passwordValid } = passwordState

	useEffect(() => {
		const handler = setTimeout(() => {
			console.log("check valid")
			setFormIsValid(emailValid && passwordValid)
		}, 0)

		return () => {
			console.log("cleanup")
			clearTimeout(handler)
		}
	}, [emailValid, passwordValid])

	const emailChangeHandler = (event) => {
		dispatchEmail({ type: "USER_INPUT", val: event.target.value })
		// setFormIsValid(emailState.isValid && passwordState.isValid)
	}

	const passwordChangeHandler = (event) => {
		dispatchPassword({ type: "USER_INPUT", val: event.target.value })
		// setFormIsValid(emailState.isValid && passwordState.isValid)
	}

	const validateEmailHandler = () => {
		dispatchEmail({ type: "INPUT_BLUR" })
	}

	const validatePasswordHandler = () => {
		dispatchPassword({ type: "INPUT_BLUR" })
	}

	const submitHandler = (event) => {
		event.preventDefault()
		if (formIsValid) {
			ctx.onLogIn(emailState.value, passwordState.value)
		} else if (!emailValid) {
			emailInputRef.current.focus()
		} else {
			passwordInputRef.current.focus()
		}
	}

	return (
		<Card className={classes.login}>
			<form onSubmit={submitHandler}>
				<Input
					ref={emailInputRef}
					id="email"
					label="E-mail"
					type="email"
					isValid={emailState.isValid}
					onChange={emailChangeHandler}
					onBlur={validateEmailHandler}
				/>
				<Input
					ref={passwordInputRef}
					id="password"
					label="Password"
					type="password"
					isValid={passwordState.isValid}
					onChange={passwordChangeHandler}
					onBlur={validatePasswordHandler}
				/>
				<div className={classes.actions}>
					<Button type="submit" className={classes.btn}>
						Login
					</Button>
				</div>
			</form>
		</Card>
	)
}

export default Login
