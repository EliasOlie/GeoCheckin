import { signIn } from "next-auth/react";
import { getCsrfToken } from "next-auth/react";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { EyeIcon, EyeOffIcon } from "lucide-react";

import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import * as z from "zod";
import { useState } from "react";

const loginFormSchema = z.object({
  contact: z
    .string()
    .min(11, "Contato requerido!")
    .max(11, "Numero muito grande"),
  password: z.string().min(1, "Senha requerida"),
});

export default function LoginForm({
  csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [passwordVisibility, setPasswordVisibility] = useState<boolean>(false);

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      contact: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof loginFormSchema>) {
    signIn("credentials", {
      contact: values.contact,
      password: values.password,
      callbackUrl: "/dashboard",
    });
  }

  return (
    <Card className="min-h-[30em] min-w-[20em]">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Vamos precisar de alguns dados</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            method="post"
            action="/api/auth/callback/credentials"
            className="space-y-8"
          >
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Numero de contato</FormLabel>
                  <FormControl>
                    <Input placeholder="87912345678" {...field} />
                  </FormControl>
                  <FormDescription>
                    Este é o seu número de contato
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sua senha</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input
                        type={passwordVisibility ? "text" : "password"}
                        placeholder="***********"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant={"outline"}
                        onClick={() => setPasswordVisibility((state) => !state)}
                      >
                        {passwordVisibility ? <EyeIcon /> : <EyeOffIcon />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Esta é a sua senha de acesso
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit">Login</Button>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-xs">
          Ainda não é registrado?{" "}
          <Link className="underline" href={"/singup"}>
            Registre-se
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}
