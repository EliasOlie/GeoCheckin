import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import UserRegisterForm from "../Forms/UserRegisterForm";
import { useState } from "react";

export default function CreateUserDialog() {
  const [ open, setOpen ] = useState<boolean>(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button>Cadastrar usuário</Button>
      </DialogTrigger>
      <DialogContent>
        <UserRegisterForm callback={() => setOpen(state => !state)} />
      </DialogContent>
    </Dialog>
  );
}
