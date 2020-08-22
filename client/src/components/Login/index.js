import React from 'react'

const Login = ({ setIsLogged, setName }) => { 

    const handleChange = (e) => {
        setName(e.target.value)
    }

    const handleSubmit = (e) => { 
        setIsLogged(true)
        e.preventDefault()
    } 

    return (
        <form onSubmit={handleSubmit} className="login">
            <label>Enter your name: </label>
            <input id="name" type="text" onChange={handleChange} />
            <button type="submit">Submit</button>
        </form>
    )
}

export default Login
