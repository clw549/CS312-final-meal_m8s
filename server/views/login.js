import react from "react"

export function LoginPage()
{
  return `<div><form method="post" action="/login">
      <label>Username:<input name="username" type="text" /></label>    
      <label>Password<input name="password" type="password"/></label>
    </form></div>`
}
