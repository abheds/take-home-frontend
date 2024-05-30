"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, CheckMark, Eye, EyeSlash, Input, XMark } from "../component";
import Link from "next/link";
import axios from "axios";
import { BACKEND_URL, classes, notify } from "../utils";
import { useRouter } from "next/navigation";

const SignUp = () => {
  const [error, setError] = useState("");
  const [name, setName] = useState({
    value: "",
    isError: false,
    isTouched: false,
  });
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

  const { push, replace } = useRouter();

  useEffect(() => {
    !!localStorage.getItem("accessToken") && replace("/");
  }, []);

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

    const isNameValid = !!name.value.length;
    setName((prev) => ({
      ...prev,
      isTouched: true,
      isError: !isNameValid,
    }));

    return isEmailValid && isPasswordValid && isNameValid;
  }, [email, password, name]);

  const passwordValidations = useMemo(() => {
    if (password.value.length) {
      return {
        length: password.value.length >= 8,
        number: /\d/gm.test(password.value),
        case: /^(?=.*[a-z])(?=.*[A-Z]).+$/.test(password.value),
      };
    }
    return { length: false, number: false, case: false };
  }, [password]);

  const onClick = useCallback(async () => {
    try {
      const res = await axios.post(BACKEND_URL + "/createUser", {
        email: email.value,
        password: password.value,
        full_name: name.value,
      });
      if (res.data.message) {
        setError("");
        notify("Signed up successfully");
        push("/login");
      }
    } catch (e) {
      console.log(e);
      // @ts-ignore
      setError(e?.message);
    }
  }, [email.value, password.value, name.value]);

  const handleClick = useCallback(() => {
    validate() && onClick();
  }, [validate, onClick]);

  return (
    <div className="flex flex-col justify-center items-center h-full">
      <form className="flex flex-col gap-2">
        <Input
          label="Name"
          value={name.value}
          setValue={(value) =>
            setName((prev) => ({
              ...prev,
              value,
              isError: false,
            }))
          }
          placeholder="Enter your name"
          type="text"
          isClearable
          {...(name.isError && name.isTouched ? { error: "Invalid name" } : {})}
        />

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

        {!!password.value.length && !error && (
          <div>
            <div
              className={classes(
                "flex flex-row gap-1 items-center",
                passwordValidations.length ? "text-green-400" : "text-red-400 "
              )}>
              {passwordValidations.length ? (
                <CheckMark />
              ) : (
                <XMark className="text-red-400 cursor-none" />
              )}
              <div>At least 8 characters</div>
            </div>
            <div
              className={classes(
                "flex flex-row gap-1 items-center",
                passwordValidations.number ? "text-green-400" : "text-red-400 "
              )}>
              {passwordValidations.case ? (
                <CheckMark />
              ) : (
                <XMark className="text-red-400 cursor-none" />
              )}
              <div>at least one number</div>
            </div>
            <div
              className={classes(
                "flex flex-row gap-1 items-center",
                passwordValidations.case ? "text-green-400" : "text-red-400 "
              )}>
              {passwordValidations.case ? (
                <CheckMark />
              ) : (
                <XMark className="text-red-400 cursor-none" />
              )}
              <div>Both upper and lower case letters</div>
            </div>
          </div>
        )}
      </form>

      {error && (
        <div className="text-red-400 mt-2">
          There was a error signing you in: {error}
        </div>
      )}

      <Button className="mt-4" onClick={handleClick}>
        Sign up
      </Button>

      <div className="text-center mt-4 text-sm text-gray-400">
        <div>Already have an account?</div>
        <div>
          Click{" "}
          <Link href={`/login`} className="text-white">
            here
          </Link>{" "}
          to login.
        </div>
      </div>
    </div>
  );
};

export default SignUp;
