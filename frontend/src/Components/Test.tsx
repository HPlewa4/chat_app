import React, { useState } from "react"
import API from "../api"

export default function Test() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const createUser = async () => {
    try {

      const response = await API.post("/users/create-test", {
        email: email,
        password: password
      })

      console.log(response.data)
      alert("User added to database!")

    } catch (error) {
      console.error(error)
      alert("Error creating user")
    }
  }

  return (
    <div>

      <h2>Test Backend Connection</h2>

      <input
        placeholder="Email"
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
      />

      <button onClick={createUser}>
        Create User
      </button>

    </div>
  )
}