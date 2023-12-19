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

import { Button } from "../ui/button";
import { api } from "@/utils/api";
import { useState } from "react";
import type { User } from "@prisma/client";
import EditUserMonthlyHour from "../Forms/EditUserMonthlyHour";

export default function UserDialog() {
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
      <DialogTrigger>
        <Button type="button" className="bg-amber-300 font-semibold text-black">
          Pesquisar Usuário
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
        <EditUserMonthlyHour
          userHours={user?.monthlyHours.toString() || ""}
          userId={user?.id.toString() || ""}
        />
      </DialogContent>
    </Dialog>
  );
}
