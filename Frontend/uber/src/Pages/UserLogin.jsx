import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
const UserLogin = () => {
    const [email,setemail] = useState("")
    const [password,setpassword] = useState("")
    const [userData,setuserData] = useState({})
    function handlelogin(e){
        e.preventDefault()
        console.log(email,password)
        setuserData({
            email:email,
            password:password
        })
        console.log(userData)
        setemail(" ")
        setpassword(" ")
    }
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
      }}
    >
      <div
        style={{
          width: "350px",
          backgroundColor: "#fff",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 0 10px rgba(0,0,0,0.2)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          UserLogin
        </h2>

        <form onSubmit={handlelogin}>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              Email
            </label>
            <input
              type="email"
              required
              placeholder="Enter your email"
               value={email}
              onChange={(event)=>setemail(event.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              Password
            </label>
            <input
              type="password"
              required
              placeholder="Enter your password"
             value={password}
             onChange={(event)=>setpassword(event.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "black",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Login
          </button>
            <Link to="/UserSignup">Create a new Account</Link>
        </form>
        <Link to="/CaptainLogin">Sign in as a Captain</Link>
      </div>
    </div>
  );
};

export default UserLogin;