function LoginPage({
  loginEmail,
  setLoginEmail,
  loginPassword,
  setLoginPassword,
  handleLogin,
  loginError,
  isLoggingIn,
}) {
  return (
    <main className="flex min-h-screen items-center bg-slate-200 px-4 py-10">
      <div className="mx-auto w-full max-w-md border border-slate-300 bg-white p-6">
        <h1 className="text-2xl font-semibold text-slate-900">
          Login to continue
        </h1>
        <form className="mt-6 space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="mb-1 block text-sm text-slate-700">Email</label>
            <input
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              placeholder="teacher@classroom.com"
              className="w-full border border-slate-300 px-3 py-2 text-base outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-700">
              Password
            </label>
            <input
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              placeholder="password"
              className="w-full border border-slate-300 px-3 py-2 text-base outline-none focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#003049] px-4 py-2 text-sm font-semibold text-white hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isLoggingIn}
          >
            {isLoggingIn ? "Logging in..." : "Login"}
          </button>
          {loginError && <p className="text-sm text-red-600">{loginError}</p>}
        </form>
      </div>
    </main>
  );
}

export default LoginPage;
