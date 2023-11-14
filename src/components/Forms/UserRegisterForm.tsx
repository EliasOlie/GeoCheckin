import {
  Card,
  CardContent,
  CardDescription,
  
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

import { EyeIcon, EyeOffIcon } from "lucide-react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import * as z from "zod"
import { useState } from "react";
 
const registerFormSchema = z.object({
  name: z.string().min(1, "Nome requerido"),
  contact: z.string().min(11, "Contato requerido!").max(11, "Numero muito grande"),
  password: z.string().min(1, "Senha requerida")
})

import { api } from "@/utils/api"
import { signIn } from "next-auth/react"

export default function UserRegisterForm () {
  const [ passwordVisibility, setPasswordVisibility ] = useState<boolean>(false)
  const createUserMutation = api.user.createUser.useMutation()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      contact: "",
      password: "",
    },
  })

  function onSubmit(values: z.infer<typeof registerFormSchema>) {
    createUserMutation.mutate(values, {
      onSuccess(_, variables) {
        toast({
          title: "Usuário criado com sucesso!",
          description: "Você será redirecionado em breve"
        })
        setTimeout(() => {
          signIn("credentials", { contact: variables.contact, password: variables.password, callbackUrl: "/dashboard" })
        }, 1000)
      },
      onError: () => {
        toast({
          title: "Ops parece que algo deu errado",
          description: "Confira os dados e tente novamente, alias você não já tem cadastro?",
          variant: "destructive"
        })
      }
    })

  }

  return(
    <Card className="min-w-[20em] min-h-[30em]">
        <CardHeader>
          <CardTitle>Registrar-se</CardTitle>
          <CardDescription>Vamos precisar de alguns dados</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Fulano" {...field} />
                    </FormControl>
                    <FormDescription>
                      Este é o seu nome.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contato</FormLabel>
                    <FormControl>                      
                      <Input placeholder="87912345678" {...field} /> 
                    </FormControl>
                    <FormDescription>
                      Este é o seu numero de contato
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
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input type={passwordVisibility? "text" : "password"} placeholder="***********" {...field} /> 
                        <Button type="button" variant={"outline"} onClick={() => setPasswordVisibility(state => !state)}>{passwordVisibility? <EyeIcon/> : <EyeOffIcon/>}</Button>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Esta será sua senha de acesso
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button type="submit">Registrar</Button>
              </div>
            </form>
          </Form>
        </CardContent>
    </Card>
  )
}