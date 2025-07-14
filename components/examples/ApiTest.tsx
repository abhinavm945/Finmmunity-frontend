"use client";

import { useState } from "react";
import { api } from "../../utils/api";

export default function ApiTest() {
  const [testResult, setTestResult] = useState<{
    success: boolean;
    data?: unknown;
    error?: string;
    message: string;
    status?: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const testRegister = async () => {
    setLoading(true);
    try {
      console.log("Testing register endpoint...");

      // Test with the current format
      const response = await api.auth.register({
        username: "testuser",
        email: "test@example.com",
        password: "Password123",
      });

      setTestResult({
        success: true,
        data: response,
        message: "Register test completed",
      });
    } catch (error: unknown) {
      setTestResult({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        message: "Register test failed",
      });
    } finally {
      setLoading(false);
    }
  };

  const testHealthCheck = async () => {
    setLoading(true);
    try {
      console.log("Testing health check endpoint...");

      const response = await api.health.check();

      setTestResult({
        success: true,
        data: response,
        message: "Health check completed",
      });
    } catch (error: unknown) {
      setTestResult({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        message: "Health check failed",
      });
    } finally {
      setLoading(false);
    }
  };

  const testDirectFetch = async () => {
    setLoading(true);
    try {
      console.log("Testing direct fetch to register endpoint...");

      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "testuser2",
          email: "test2@example.com",
          password: "Password123",
        }),
      });

      const data = await response.json();

      setTestResult({
        success: response.ok,
        status: response.status,
        data: data,
        message: "Direct fetch test completed",
      });
    } catch (error: unknown) {
      setTestResult({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        message: "Direct fetch test failed",
      });
    } finally {
      setLoading(false);
    }
  };

  const testAlternativeEndpoints = async () => {
    setLoading(true);
    try {
      console.log("Testing alternative endpoints...");

      // Test different endpoint variations
      const endpoints = [
        "http://localhost:5000/api/auth/register",
        "http://localhost:5000/auth/register",
        "http://localhost:5000/api/register",
        "http://localhost:5000/register",
      ];

      const results = [];

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: "testuser3",
              email: "test3@example.com",
              password: "Password123",
            }),
          });

          const data = await response.json();
          results.push({
            endpoint,
            status: response.status,
            success: response.ok,
            data,
          });
        } catch (error: unknown) {
          results.push({
            endpoint,
            status: "ERROR",
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
          });
        }
      }

      setTestResult({
        success: true,
        data: results,
        message: "Alternative endpoints test completed",
      });
    } catch (error: unknown) {
      setTestResult({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        message: "Alternative endpoints test failed",
      });
    } finally {
      setLoading(false);
    }
  };

  const testRequestFormats = async () => {
    setLoading(true);
    try {
      console.log("Testing different request formats...");

      const endpoint = "http://localhost:5000/api/auth/register";
      const formats = [
        {
          name: "Current Format",
          data: {
            username: "testuser4",
            email: "test4@example.com",
            password: "Password123",
          },
        },
        {
          name: "Name instead of Username",
          data: {
            name: "testuser4",
            email: "test4@example.com",
            password: "Password123",
          },
        },
        {
          name: "UserName (camelCase)",
          data: {
            userName: "testuser4",
            email: "test4@example.com",
            password: "Password123",
          },
        },
        {
          name: "With Confirm Password",
          data: {
            username: "testuser4",
            email: "test4@example.com",
            password: "Password123",
            confirmPassword: "Password123",
          },
        },
        {
          name: "With Name and Username",
          data: {
            name: "Test User",
            username: "testuser4",
            email: "test4@example.com",
            password: "Password123",
          },
        },
      ];

      const results = [];

      for (const format of formats) {
        try {
          const response = await fetch(endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(format.data),
          });

          const data = await response.json();
          results.push({
            format: format.name,
            status: response.status,
            success: response.ok,
            data: data,
            requestBody: format.data,
          });
        } catch (error: unknown) {
          results.push({
            format: format.name,
            status: "ERROR",
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
            requestBody: format.data,
          });
        }
      }

      setTestResult({
        success: true,
        data: results,
        message: "Request formats test completed",
      });
    } catch (error: unknown) {
      setTestResult({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        message: "Request formats test failed",
      });
    } finally {
      setLoading(false);
    }
  };

  const clearResult = () => {
    setTestResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">API Test Component</h1>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-yellow-800 mb-2">
          Debug Information
        </h2>
        <p className="text-yellow-700 text-sm">
          This component helps debug API connection issues. Check the browser
          console for detailed request/response logs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <button
          onClick={testHealthCheck}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? "Testing..." : "Test Health Check"}
        </button>

        <button
          onClick={testRegister}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Testing..." : "Test Register API"}
        </button>

        <button
          onClick={testDirectFetch}
          disabled={loading}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
        >
          {loading ? "Testing..." : "Test Direct Fetch"}
        </button>

        <button
          onClick={testAlternativeEndpoints}
          disabled={loading}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
        >
          {loading ? "Testing..." : "Test All Endpoints"}
        </button>

        <button
          onClick={testRequestFormats}
          disabled={loading}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
        >
          {loading ? "Testing..." : "Test Formats"}
        </button>
      </div>

      {testResult && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Test Result</h2>
            <button
              onClick={clearResult}
              className="text-gray-500 hover:text-gray-700"
            >
              Clear
            </button>
          </div>

          <div
            className={`p-4 rounded-lg ${
              testResult.success
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            <h3
              className={`font-medium mb-2 ${
                testResult.success ? "text-green-800" : "text-red-800"
              }`}
            >
              {testResult.message}
            </h3>

            {testResult.error && (
              <div className="mb-3">
                <p className="text-red-700 font-medium">Error:</p>
                <p className="text-red-600 text-sm">{testResult.error}</p>
              </div>
            )}

            {testResult.status && (
              <div className="mb-3">
                <p className="text-gray-700 font-medium">Status:</p>
                <p className="text-gray-600 text-sm">{testResult.status}</p>
              </div>
            )}

            <div>
              <p className="text-gray-700 font-medium">Response Data:</p>
              <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                {JSON.stringify(testResult.data, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Troubleshooting Steps</h2>

        <div className="space-y-3 text-sm">
          <div>
            <h3 className="font-medium">1. Check Backend Server</h3>
            <p className="text-gray-600">
              Ensure your backend server is running on http://localhost:5000
            </p>
          </div>

          <div>
            <h3 className="font-medium">2. Check API Endpoints</h3>
            <p className="text-gray-600">
              Verify the correct endpoints in your backend documentation
            </p>
          </div>

          <div>
            <h3 className="font-medium">3. Check Request Format</h3>
            <p className="text-gray-600">
              Ensure the request body matches what the backend expects
            </p>
          </div>

          <div>
            <h3 className="font-medium">4. Check CORS</h3>
            <p className="text-gray-600">
              Ensure CORS is properly configured on the backend
            </p>
          </div>

          <div>
            <h3 className="font-medium">5. Check Console Logs</h3>
            <p className="text-gray-600">
              Open browser console to see detailed request/response logs
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
