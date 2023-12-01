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

import { EyeIcon, EyeOffIcon } from "lucide-react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"


import { api } from "@/utils/api"
import { useState } from "react"
import * as z from "zod"
import { useToast } from "../ui/use-toast"
import UserDialog from "../Dialogs/UsersDialog"

const updateUserFormSchema = z.object({
  name: z.string().optional(),
  contact: z.string().max(11, "Número muito grande!").optional(),
  password: z.string().optional()
})

export default function EditUserForm() {
  const [ passwordVisibility, setPasswordVisibility ] = useState<boolean>(false)
  const { toast } = useToast()

  const user = api.user.getUser.useQuery()
  const updateUserMutation = api.user.updateUser.useMutation()

  const form = useForm<z.infer<typeof updateUserFormSchema>>({
    resolver: zodResolver(updateUserFormSchema),
    defaultValues: {
      contact: "",
      password: "",
    },
  })

  function onSubmit(values: z.infer<typeof updateUserFormSchema>) {
    updateUserMutation.mutate(values, {
      onSuccess() {
        toast({
          title: "Usuário atualizado com sucesso!",
          description: "Logo logo as alterações vão ser perceptíveis"
        })
      },
      onError: () => {
        toast({
          title: "Ops parece que algo deu errado",
          description: "Confira os dados e tente novamente",
          variant: "destructive"
        })
      }
    })

  }

  return(
    <Card className="min-w-[20em] min-h-[30em]">
    <CardHeader>
      <CardTitle>Perfil</CardTitle>
      <CardDescription>Esse é o seu perfil de usuário</CardDescription>
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
                  <Input placeholder={user.data?.name} {...field} />
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
                  <Input placeholder={user.data?.contact} {...field} /> 
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
                  Esta será sua nova senha de acesso
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {user?.data?.role === "ADM" && (
            <div className="flex justify-between">
              {user?.data?.role === "ADM" && (
                <UserDialog/> 
              )}
              <Button type="submit">Alterar dados</Button>
            </div>
          )}
          {user?.data?.role === "USR" && (
            <div className="flex justify-end">
              <Button type="submit">Alterar dados</Button>
            </div>
          )}
                 </form>
      </Form>
    </CardContent>
</Card>
  )
}
