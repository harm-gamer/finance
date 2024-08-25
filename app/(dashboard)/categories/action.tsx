import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useOpenCategory } from "@/features/categories/hooks/use-open-category";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useDeleteCaterogies } from "@/features/categories/api/use-delete-categories";
import { useConfirm } from "@/hooks/use-confirm";
import { useEditCategorie } from "@/features/categories/api/use-edit-categories";

type Props ={
    id: string;
}
export const Actions =({id}:Props) =>{
    const [ConfirmationDialog,confirm] = useConfirm(
        "Are you sure",
        "You are about to delete the transaction."
    );
    const deleteCategorie = useDeleteCaterogies(id);
    const editCategorie = useEditCategorie(id);
    const {onOpen} = useOpenCategory();
    const handleDelete = async () =>{
        // const ok = await confirm();
        // if(ok){
        //     deleteAccount.mutate();
        // }
        deleteCategorie.mutate()
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
        <DropdownMenuItem disabled={editCategorie.isPending} onClick={() =>onOpen(id)}>
            <Edit className="size-4 mr-2"/>
            Edit
        </DropdownMenuItem>
        <DropdownMenuItem disabled={deleteCategorie.isPending} onClick={handleDelete}>
            <Trash className="size-4 mr-2"/>
            Delete
        </DropdownMenuItem>
        </DropdownMenuContent>
        
       </DropdownMenu>
       </>
    )
}