import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res.error) {
      setError("Email-i ose fjalëkalimi është i gabuar!");
      setLoading(false);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full bg-white shadow-2xl rounded-2xl border border-gray-100 overflow-hidden">
        
        {/* Header-i i Formës */}
        <div className="bg-blue-700 py-6 text-center">
          <h2 className="text-2xl font-black text-white tracking-tight uppercase">
            Kyçja në <span className="text-yellow-400">ParkZone</span>
          </h2>
          <p className="text-blue-100 text-sm mt-1">Mirësevini përsëri!</p>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 text-red-700 text-sm font-bold animate-pulse">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-bold text-black mb-2 uppercase tracking-wide">
                Email Adresa
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-black font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-bold text-black uppercase tracking-wide">
                  Fjalëkalimi
                </label>
                <Link href="#" className="text-xs font-bold text-blue-600 hover:underline">
                  Harruat fjalëkalimin?
                </Link>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-black font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl font-black text-white uppercase tracking-widest transition-all shadow-lg ${
                loading 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-blue-600 hover:bg-blue-800 shadow-blue-200 active:scale-95"
              }`}
            >
              {loading ? "Duke u procesuar..." : "Kyçu Tani"}
            </button>
          </form>

          {/* Google Button */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t-2 border-gray-100"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-4 font-black text-gray-400 italic">Ose përdorni</span></div>
          </div>

          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="w-full py-4 rounded-2xl font-black text-black border-4 border-gray-100 flex items-center justify-center gap-3 hover:bg-gray-50 transition-all active:scale-95 shadow-sm"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="G" />
            HYR ME GOOGLE
          </button>

          {/* Footer-i i Formës */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-gray-600 font-medium">
              Nuk keni ende një llogari?{" "}
              <Link href="/register" className="text-blue-700 font-black hover:underline ml-1">
                Regjistrohu Falas
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}