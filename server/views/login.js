import react from "react"

export function LoginPage()
{
  return `<div><form method="post" action="/login">Login
      <label>Username:<input name="username" type="text" /></label>    
      <label>Password<input name="password" type="password"/></label>
    </form></div>`
}

export function SignupPage() {
  return `<div>
    <form method="post" action="/signup">Signup
      <label>Username:<input type="text" name="username"/></label>
      <label>Password:<input type="password" name="password"/></label>
    </form>
  </div>`
}
