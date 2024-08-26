import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useOpenAccount } from "@/features/accounts/hooks/use-open-account";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useDeleteAccount } from "@/features/accounts/api/use-delete.account";
import { useConfirm } from "@/hooks/use-confirm";
import { useEditAccount } from "@/features/accounts/api/use-edit-account";
import { useOpenTransaction } from "@/features/transactions/hooks/use-open-transaction";
import { useEditTransaction } from "@/features/transactions/api/use-edit-transacton";
import { useDeleteTransaction } from "@/features/transactions/api/use-delete-transaction";

type Props ={
    id: string;
}
export const Actions =({id}:Props) =>{
    const [ConfirmationDialog,confirm] = useConfirm(
        "Are you sure",
        "You are about to delete the transaction"
    );
    const deletetransactions = useDeleteTransaction(id);
    const editTransaction = useEditTransaction(id);
    const {onOpen} = useOpenTransaction();
    const handleDelete = async () =>{
        // const ok = await confirm();
        // if(ok){
        //     deleteAccount.mutate();
        // }
        deletetransactions.mutate()
    }
    return(
       <>
       {/* <ConfirmationDialog/> */}
       <DropdownMenu>
        <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="size-8 p-0">
          <MoreHorizontal className="size-4"/>
        </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
        <DropdownMenuItem disabled={editTransaction.isPending} onClick={() =>onOpen(id)}>
            <Edit className="size-4 mr-2"/>
            Edit
        </DropdownMenuItem>
        <DropdownMenuItem disabled={deletetransactions.isPending} onClick={handleDelete}>
            <Trash className="size-4 mr-2"/>
            Delete
        </DropdownMenuItem>
        </DropdownMenuContent>
        
       </DropdownMenu>
       </>
    )
}