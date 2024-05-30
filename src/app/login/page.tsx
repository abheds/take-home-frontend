"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Button, Eye, EyeSlash, Input } from "../component";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BACKEND_URL, notify } from "../utils";

function Login() {
  const [error, setError] = useState("");
  const [email, setEmail] = useState({
    value: "",
    isError: false,
    isTouched: false,
  });

  const [password, setPassword] = useState({
    value: "",
    isError: false,
    isTouched: false,
    show: false,
  });

  const validate = useCallback(() => {
    const emailRegex = /[a-z0-9]+@[a-z0-9]+\.[a-z]{2,3}/;
    const isEmailValid = emailRegex.test(email.value);
    setEmail((prev) => {
      return {
        ...prev,
        isTouched: true,
        isError: !isEmailValid,
      };
    });
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    const isPasswordValid = passwordRegex.test(password.value);
    setPassword((prev) => {
      return {
        ...prev,
        isTouched: true,
        isError: !isPasswordValid,
      };
    });

    return isEmailValid && isPasswordValid;
  }, [email, password]);

  const { push, replace } = useRouter();

  useEffect(() => {
    !!localStorage.getItem("accessToken") && replace("/");
  }, []);

  const onClick = useCallback(async () => {
    try {
      const res = await axios.post(BACKEND_URL + "/login", null, {
        params: {
          email: email.value,
          password: password.value,
        },
      });
      if (res.data.access_token) {
        localStorage.setItem("accessToken", res.data.access_token);
        setError("");
        notify("Logged in successfully");
        push("/");
      }
    } catch (e) {
      console.log(e);
      // @ts-ignore
      setError(e?.message);
    }
  }, [email.value, password.value]);

  const handleClick = useCallback(() => {
    validate() && onClick();
  }, [validate, onClick]);

  return (
    <div className="flex flex-col justify-center items-center h-full">
      <form className="flex flex-col gap-2">
        <Input
          label="Email"
          value={email.value}
          setValue={(value) => {
            setEmail((prev) => ({
              ...prev,
              value,
              isError: false,
            }));
            error && setError("");
          }}
          placeholder="Enter your email"
          type="email"
          isClearable
          {...(email.isError && email.isTouched
            ? { error: "Invalid email" }
            : {})}
        />

        <Input
          label="Password"
          value={password.value}
          setValue={(value) =>
            setPassword((prev) => ({
              ...prev,
              value,
              isError: false,
            }))
          }
          placeholder="Enter your password"
          type={password.show ? "text" : "password"}
          {...(password.isError && password.isTouched
            ? { error: "Invalid password" }
            : {})}
          icon={
            password.show ? (
              <Eye
                onClick={() =>
                  setPassword((prev) => ({ ...prev, show: false }))
                }
              />
            ) : (
              <EyeSlash
                onClick={() => setPassword((prev) => ({ ...prev, show: true }))}
              />
            )
          }
        />
      </form>

      {error && (
        <div className="text-red-400 mt-2">
          There was a error logging you in: {error}
        </div>
      )}

      <Button className="mt-4" onClick={handleClick}>
        Log in
      </Button>

      <div className="text-center mt-4 text-sm text-gray-400">
        <div>Don&apos;t have an account?</div>
        <div>
          Click{" "}
          <Link href={`/signup`} className="text-white">
            here
          </Link>{" "}
          to signup.
        </div>
      </div>
    </div>
  );
}

export default Login;
