import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

import * as z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const updateUserFormSchema = z.object({
  name: z.string().optional(),
  contact: z.string().max(11, "Número muito grande!").optional(),
  password: z.string().optional(),
});

import type { User } from "@prisma/client";
import { useState } from "react";
import { useToast } from "../ui/use-toast";
import { api } from "@/utils/api";

export default function EditUserUserDialog() {
  const [passwordVisibility, setPasswordVisibility] = useState<boolean>(false);
  const { toast } = useToast();

  const updateUserMutation = api.user.updateUserById.useMutation();

  const form = useForm<z.infer<typeof updateUserFormSchema>>({
    resolver: zodResolver(updateUserFormSchema),
    defaultValues: {
      contact: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof updateUserFormSchema>) {
    updateUserMutation.mutate(
      {
        id: user!.id,
        ...values,
      },
      {
        onSuccess() {
          toast({
            title: "Usuário atualizado com sucesso!",
            description: "Logo logo as alterações vão ser perceptíveis",
          });
        },
        onError: () => {
          toast({
            title: "Ops parece que algo deu errado",
            description: "Confira os dados e tente novamente",
            variant: "destructive",
          });
        },
      },
    );
  }

  const [user, setUser] = useState<User | undefined>(undefined);
  const users = api.user.getAllUsers.useQuery().data;
  const getUser = api.user.getUserById.useMutation({
    onSuccess(data) {
      setUser(data as unknown as User);
    },
  });

  const selectUser = (u: string) => {
    getUser.mutate(parseInt(u));
  };

  return (
    <Dialog>
      <DialogTrigger className="flex w-full px-10">
        <Button
          type="button"
          className="flex flex-1 bg-amber-300 font-semibold text-black"
        >
          Editar Usuário
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Selecione o Usuário</DialogTitle>
        </DialogHeader>
        <Select onValueChange={selectUser}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Usuário" />
          </SelectTrigger>
          <SelectContent>
            {users?.map((user) => (
              <SelectItem value={user.id.toString()} key={user.id}>
                {user.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder={user?.name} {...field} />
                  </FormControl>
                  <FormDescription>
                    Este é o novo nome de usuário.
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
                    <Input placeholder={user?.contact} {...field} />
                  </FormControl>
                  <FormDescription>
                    Este é o novo numero de contato
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
                    Esta será a nova senha de acesso
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={user?.id !== undefined ? false : true}
            >
              Alterar dados
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
