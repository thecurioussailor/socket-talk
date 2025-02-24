"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import axios from "axios"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const FormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(2, {
    message: "Password must be at least 8 characters.",
  })
})

async function signinUser(data: z.infer<typeof FormSchema>){
    const response = await axios.post(`${BACKEND_URL}/auth/login`, data);
    return response.data;
}
export function Signin() {

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      password: ""
    },
  })
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: signinUser,
    onSuccess: (data) => {
        console.log(data)
        localStorage.setItem('token', data.token);
        toast({
            title: "Login Successful",
            description: "Welcome back!"
        });
        navigate('/dashboard');

    },
    onError: (error) => {
        toast({
            title: "Error",
            description: "Failed to login. Please check your credentials" + error
        })
    }
  })
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    mutation.mutate(data);
  }

  return (
    <section className="flex flex-col gap-10 justify-center items-center w-full h-screen">
        <h1 className="text-white text-2xl font-semibold">Sign in</h1>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-1/3 space-y-6">
            <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
                <FormItem>
                <FormLabel className="text-white">Username</FormLabel>
                <FormControl>
                    <Input className="text-white" placeholder="username" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
                <FormItem>
                <FormLabel className="text-white">Password</FormLabel>
                <FormControl>
                    <Input className="text-white" placeholder="password" type="password" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Signing in..." : "Sign In"}
            </Button>
        </form>
        </Form>
    </section>
  )
}
