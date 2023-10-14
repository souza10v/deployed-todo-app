import { useState } from "react";
import { useCookies } from 'react-cookie'

const Auth = () => {

  const [cookies, setCookie, removeCookie ] = useCookies(null)
  const [isLoginIn, setIsLogin] = useState(true)
  const [email, setEmail] = useState(null)
  const [password, setPassword] = useState(null)
  const [confirmPassword, setConfirmPassword] = useState(null)
  const [error, setError] = useState(null)

  console.log(cookies)

  const viewLogin = (status) => {
    setError(null)
    setIsLogin(status)
  }

  const handleSubmit = async (e, endpoint) => {
    e.preventDefault()
    if (!isLoginIn && password !== confirmPassword) {
      setError("Make sure passwords matchs")
      return
    }
    const response = await fetch(`${process.env.REACT_APP_URLSERVERR}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })

    const data = await response.json()

    if (data.detail) {
      setError(data.detail)
    } else {
      setCookie('Email', data.email)
      setCookie('AuthToken', data.token)

      window.location.reload()
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-container-box">
        <form>
          <h2>{isLoginIn ? 'Please log in!' : 'Please sign up!'}</h2>
          <input
            type="email"
            placeholder="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          {!isLoginIn &&
            <input type="password"
              placeholder="confirm password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />} {/*se login nao verdade, mostra a mesagem */}
          <input
            type="submit"
            className="create"
            onClick={(e) => handleSubmit(e, isLoginIn ? 'login' : 'signup')} />
          {error && <p>{error}</p>} {/*Se o erro existir, mostra erro */}
        </form>
        <div className="auth-options">
          <button
            onClick={() => viewLogin(false)}
            style={{
              backgroundColor: isLoginIn ? 'rgb(255, 255, 255)' : 'rgb(188, 188, 188)'
            }}>
            Sign up
          </button>
          <button onClick={() => viewLogin(true)}
            style={{
              backgroundColor: !isLoginIn ? 'rgb(255, 255, 255)' : 'rgb(188, 188, 188)'
            }}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Auth;
