import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/router";
import Link from "next/link";
import { useState } from "react";

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const router = useRouter();

  const onSubmit = async (data) => {
    setLoading(true);
    setServerError("");
    try {
      await axios.post("/api/auth/register", data);
      router.push("/login?success=Llogaria u krijua! Ju lutem kyçuni.");
    } catch (err) {
      setServerError(err.response?.data?.message || "Ndodhi një gabim gjatë regjistrimit.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full bg-white shadow-2xl rounded-2xl border border-gray-100 overflow-hidden">
        
        {/* Header-i i Formës */}
        <div className="bg-blue-700 py-6 text-center">
          <h2 className="text-2xl font-black text-white tracking-tight uppercase">
            Krijo Llogari në <span className="text-yellow-400">ParkZone</span>
          </h2>
          <p className="text-blue-100 text-sm mt-1">Bëhu pjesë e rrjetit tonë të parkingjeve</p>
        </div>

        <div className="p-8">
          {serverError && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 text-red-700 text-sm font-bold">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            
            {/* Full Name Field */}
            <div>
              <label className="block text-sm font-bold text-black mb-1.5 uppercase tracking-wide">
                Emri dhe Mbiemri
              </label>
              <input
                {...register("name", { required: "Emri është i detyrueshëm" })}
                placeholder="Enter your full name"
                className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl text-black font-medium focus:outline-none transition-all ${
                  errors.name ? "border-red-500" : "border-gray-200 focus:border-blue-500 focus:bg-white"
                }`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1 font-bold">{errors.name.message}</p>}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-bold text-black mb-1.5 uppercase tracking-wide">
                Email Adresa
              </label>
              <input
                {...register("email", { 
                  required: "Email-i është i detyrueshëm",
                  pattern: { value: /^\S+@\S+$/i, message: "Email-i nuk është valid" }
                })}
                placeholder="email@example.com"
                className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl text-black font-medium focus:outline-none transition-all ${
                  errors.email ? "border-red-500" : "border-gray-200 focus:border-blue-500 focus:bg-white"
                }`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1 font-bold">{errors.email.message}</p>}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-bold text-black mb-1.5 uppercase tracking-wide">
                Fjalëkalimi
              </label>
              <input
                type="password"
                {...register("password", { 
                  required: "Fjalëkalimi është i detyrueshëm",
                  minLength: { value: 6, message: "Së paku 6 karaktere" }
                })}
                placeholder="••••••••"
                className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl text-black font-medium focus:outline-none transition-all ${
                  errors.password ? "border-red-500" : "border-gray-200 focus:border-blue-500 focus:bg-white"
                }`}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1 font-bold">{errors.password.message}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 mt-4 rounded-xl font-black text-white uppercase tracking-widest transition-all shadow-lg ${
                loading 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-blue-600 hover:bg-blue-800 shadow-blue-200 active:scale-95"
              }`}
            >
              {loading ? "Duke u procesuar..." : "Regjistrohu Tani"}
            </button>
          </form>

          {/* Footer-i i Formës */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-gray-600 font-medium">
              Keni tashmë një llogari?{" "}
              <Link href="/login" className="text-blue-700 font-black hover:underline ml-1">
                Kyçu Këtu
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}