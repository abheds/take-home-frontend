"use client";
import Image from "next/image";
import { Button, Input, Logout, Search } from "./component";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BACKEND_URL, notify } from "./utils";

export default function Home() {
  const [searchString, setSearchString] = useState("");
  const [data, setData] = useState([]);
  const { push, replace } = useRouter();

  const authToken = localStorage.getItem("accessToken");

  useEffect(() => {
    !authToken && push("/login");
  }, [authToken]);

  const onSearch = useCallback(async () => {
    const res = await axios.post(BACKEND_URL + "/job_search", null, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      params: {
        job_title: searchString,
      },
    });

    setData(res.data.data);
  }, [searchString]);

  return authToken ? (
    <main className="flex min-h-screen flex-col items-center p-24 relative">
      <div className="flex flex-row flex-wrap gap-2">
        <Input
          placeholder="Search jobs..."
          setValue={(txt) => setSearchString(txt)}
          value={searchString}
          isClearable
          preIcon={<Search />}
        />
        <Button onClick={onSearch} className="h-10">
          Search
        </Button>
      </div>
      {!!data.length && (
        <div className="border border-gray-50 w-1/2 mt-5">
          <div className="grid grid-cols-2 border-b border-gray-200 shadow-sm">
            <div className="font-bold text-lg p-2">Job Name</div>
            <div className="font-bold text-lg p-2 border-l border-gray-200">
              Company Name
            </div>
          </div>
          {data.map((row, index) => (
            <div key={index} className="grid grid-cols-2">
              {/* @ts-ignore */}
              <div className="p-2 border-b border-gray-200">{row.job_name}</div>
              <div className="p-2 border-b border-l border-gray-200">
                {/* @ts-ignore */}
                {row.company_name}
              </div>
            </div>
          ))}
        </div>
      )}
      <button
        className="absolute top-10 right-10"
        onClick={() => {
          localStorage.removeItem("accessToken");
          replace("/login");
          notify("Logged Out");
        }}>
        <Logout />
      </button>
    </main>
  ) : null;
}
