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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { api } from "@/utils/api";

const formSchema = z.object({
  nome: z.string().max(20, "Nome muito grande"),
  latitude: z.string(),
  longitude: z.string()
});

export default function CreateInstalationDialog() {
  const createInstalationMutation = api.installation.createInstalation.useMutation({
    onSuccess() {
      toast({
        title: "Localização Cadastrada",
        description: "Agora podem bater ponto aqui!",
      });
      setOpen(state => !state)
    },
    onError: (err) => {
      toast({
        title: "Ops parece que algo deu errado.",
        description: err.message,
        variant: "destructive",
      });
    },
  })
  const [open, setOpen] = useState<boolean>(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      latitude: "0",
      longitude: "0"
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createInstalationMutation.mutate({
      ...values,
      latitude: parseFloat(values.latitude),
      longitude: parseFloat(values.longitude)
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button>Cadastrar unidade</Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Hosital Geral" {...field} />
                  </FormControl>
                  <FormDescription>
                    Este é o nome da instalação (Abreviar de preferencia).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="latitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Latitude</FormLabel>
                  <FormControl>
                    <Input placeholder="Latitude da instalação" {...field} />
                  </FormControl>
                  <FormDescription>
                    Este é o campo da latitude, coloque o valor exato ou não funcionará.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="longitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Longitude</FormLabel>
                  <FormControl>
                    <Input placeholder="Longitude da instalação" {...field} />
                  </FormControl>
                  <FormDescription>
                  Este é o campo da longitude, coloque o valor exato ou não funcionará.
                  </FormDescription>
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
