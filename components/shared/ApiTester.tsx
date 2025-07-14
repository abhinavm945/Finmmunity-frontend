"use client";

import { useState } from "react";

export default function ApiTester() {
  const [results, setResults] = useState<Record<string, unknown>>({});
  const [isTesting, setIsTesting] = useState(false);

  const endpoints = [
    { name: "Root", url: "http://localhost:5000/" },
    { name: "Health", url: "http://localhost:5000/api/health" },
    { name: "Auth Register", url: "http://localhost:5000/api/auth/register" },
    { name: "Auth Login", url: "http://localhost:5000/api/auth/login" },
    { name: "News", url: "http://localhost:5000/api/news" },
    { name: "Questions", url: "http://localhost:5000/api/questions" },
    { name: "Community", url: "http://localhost:5000/api/community" },
  ];

  const testEndpoints = async () => {
    setIsTesting(true);
    const newResults: Record<string, unknown> = {};

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint.url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response
          .json()
          .catch(() => ({ error: "Invalid JSON" }));

        newResults[endpoint.name] = {
          status: response.status,
          statusText: response.statusText,
          data,
        };
      } catch (error) {
        newResults[endpoint.name] = {
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    }

    setResults(newResults);
    setIsTesting(false);
  };

  return (
    <div className="fixed top-4 left-4 z-50 bg-white p-4 rounded-lg shadow-lg border max-w-md max-h-96 overflow-y-auto">
      <h3 className="text-lg font-semibold mb-2">API Endpoint Tester</h3>
      <button
        onClick={testEndpoints}
        disabled={isTesting}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {isTesting ? "Testing..." : "Test Endpoints"}
      </button>

      <div className="space-y-2 text-sm">
        {Object.entries(results).map(([name, result]) => {
          const typedResult = result as {
            status?: number;
            statusText?: string;
            data?: unknown;
            error?: string;
          };
          return (
            <div key={name} className="border-b pb-2">
              <div className="font-medium">{name}</div>
              <div
                className={`text-xs ${
                  typedResult.status === 200 ? "text-green-600" : "text-red-600"
                }`}
              >
                Status: {typedResult.status || "Error"}
              </div>
              {typedResult.data !== undefined && (
                <div className="text-xs text-gray-600 mt-1">
                  {JSON.stringify(typedResult.data).substring(0, 100)}...
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
