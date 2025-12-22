"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "@/lib/axios";
import { setToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Link from 'next/link';

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            const response = await api.post("/auth/login", data);
            setToken(response.data.token);
            router.push("/dashboard");
        } catch (error) {
            console.error("Login failed", error);
            alert("Login failed");
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
            <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow">
                <h2 className="text-3xl font-bold text-center">Connexion</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium">Email</label>
                        <input {...register("email")} className="w-full mt-1 p-2 border rounded" />
                        {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Mot de passe</label>
                        <input type="password" {...register("password")} className="w-full mt-1 p-2 border rounded" />
                        {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
                    </div>
                    <button type="submit" className="w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">
                        Se connecter
                    </button>
                </form>
                <div className="text-center">
                    <Link href="/auth/register" className="text-blue-500 hover:underline">Pas encore de compte ? S'inscrire</Link>
                </div>
            </div>
        </div>
    );
}
