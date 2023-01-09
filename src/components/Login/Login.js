import React, { useContext, useEffect, useReducer, useState } from "react"

import Card from "../UI/Card/Card"
import classes from "./Login.module.css"
import Button from "../UI/Button/Button"
import AuthContext from "../../context/auth-context"

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
		ctx.onLogIn(emailState.value, passwordState.value)
	}

	return (
		<Card className={classes.login}>
			<form onSubmit={submitHandler}>
				<div
					className={`${classes.control} ${
						emailState.isValid === false ? classes.invalid : ""
					}`}
				>
					<label htmlFor="email">E-Mail</label>
					<input
						type="email"
						id="email"
						value={emailState.value}
						onChange={emailChangeHandler}
						onBlur={validateEmailHandler}
					/>
				</div>
				<div
					className={`${classes.control} ${
						passwordState.isValid === false ? classes.invalid : ""
					}`}
				>
					<label htmlFor="password">Password</label>
					<input
						type="password"
						id="password"
						value={passwordState.value}
						onChange={passwordChangeHandler}
						onBlur={validatePasswordHandler}
					/>
				</div>
				<div className={classes.actions}>
					<Button
						type="submit"
						className={classes.btn}
						disabled={!formIsValid}
					>
						Login
					</Button>
				</div>
			</form>
		</Card>
	)
}

export default Login
