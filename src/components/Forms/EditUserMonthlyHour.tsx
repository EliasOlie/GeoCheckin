import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

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
import { api } from "@/utils/api"


const formSchema = z.object({
  monthlyHours: z.string().optional(),
})

export default function EditUserMonthlyHour(props: { userHours: string, userId: string }) {
  const updateUserMonthlyHours = api.user.updateUserMonthlyHours.useMutation()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      monthlyHours: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateUserMonthlyHours.mutate({
      userId: props.userId,
      monthlyHours: values.monthlyHours!
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="monthlyHours"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Horas mensais</FormLabel>
              <FormControl>
                <Input placeholder={props.userHours} {...field} />
              </FormControl>
             <FormMessage />
            </FormItem>
          )}
        />
        <div className="min-w-full flex justify-end">
          <Button type="submit">Salvar</Button>
        </div>
      </form>
    </Form>
  )
}
