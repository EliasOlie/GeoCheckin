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
});

interface CreateInstalationProps {
  latitude: number
  longitude: number
}

export default function CreateInstalationDialog(props: CreateInstalationProps) {
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
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createInstalationMutation.mutate({
      ...values,
      ...props
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
            <div className="flex items-center justify-end">
              <Button type="submit">Cadastrar</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
