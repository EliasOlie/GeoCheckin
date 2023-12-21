import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "../ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";

import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";

import { api } from "@/utils/api";

const formSchema = z.object({
  userId: z.string(),
  instalation: z.string(),
  date: z.string(),
  time: z.string(),
  kind: z.string(),
});

export default function CreateCheckinDialog() {
  const users = api.user.getAllUsers.useQuery();
  const instalations = api.installation.getAllInstalation.useQuery();

  const createCheckinMutation = api.dailly.createManuallyCheckin.useMutation({
    onSuccess() {
      toast({
        title: "Checkin Cadastrado",
      });
      setOpen((state) => !state);
    },
    onError: (err) => {
      toast({
        title: "Ops parece que algo deu errado.",
        description: err.message,
        variant: "destructive",
      });
    },
  });
  const [open, setOpen] = useState<boolean>(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: "",
      instalation: "",
      date: "",
      time: "",
      kind: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createCheckinMutation.mutate({
      ...values,
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="w-full">
        <Button className="w-full">Criar checkin manualmente</Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-1">
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usuário</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o usuário" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {users.data &&
                        users.data.map((user) => (
                          <SelectItem key={user.id} value={user.id.toString()}>
                            {user.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="instalation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instalação</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a instalação" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {instalations.data &&
                        instalations.data.map((instalation, i) => (
                          <SelectItem key={i} value={instalation.nome}>
                            {instalation.nome}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="kind"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="checkin">Check-in</SelectItem>
                      <SelectItem value="checkout">Check-out </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hora</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-end">
              <Button type="submit">Cadastrar</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
