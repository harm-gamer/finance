import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useOpenAccount } from "../hooks/use-open-account"
import { AccountForm } from "./account-form";
import { insertAccountSchema } from "@/db/schema";
import { z } from "zod";
import { useCreateAccount } from "../api/use-create-account";
import { useGetAccount } from "../api/use-get-account";
import { Loader2 } from "lucide-react";
import { useEditAccount } from "../api/use-edit-account";
import { useDeleteAccount } from "../api/use-delete.account";
import { useConfirm } from "@/hooks/use-confirm";
const formSchema = insertAccountSchema.pick({
    name: true
})
type FormValues = z.input<typeof formSchema>;
export const EditAccountSheet = () =>{
    const {isOpen,onClose,id} = useOpenAccount();
    const[ConfirmationDialog, confirm] = useConfirm(
        "Are you sure",
        "you are about to delete transaction"
    )
 
    const accountQuery = useGetAccount(id)
    const editMutaion  = useEditAccount(id)
    const deleteMutation = useDeleteAccount(id)
  
  
    const isLoading = accountQuery.isLoading;
    const isPending = editMutaion.isPending || deleteMutation.isPending;
    const onSubmit = (values:FormValues) =>{
       editMutaion.mutate(values,{
        onSuccess : () =>{
            onClose();
        }
       });
      
    }
    const onDelete = async () =>{
        const ok = await confirm();
        if(ok){
    deleteMutation.mutate(undefined,{
        onSuccess : () =>{
            onClose();
        }
    })
        }
    }

    const defaultValues = accountQuery.data?{
        name : accountQuery.data.name
    }:{
        name : "",
    }
    
   
    return(
        <>
        <ConfirmationDialog/>
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="space-y-4">
                <SheetHeader>
                    <SheetTitle>
                        Edit Account
                    </SheetTitle>
                    <SheetDescription>
                        Edit a new account to track your transactions.
                    </SheetDescription>
                </SheetHeader>
                {isLoading ?(
                    <div className="absolute insert-0 flex items-center justify-center">
                        <Loader2 className="size-4 text-muted-foreground animate-spin"/>
                    </div>
                ):(
                    <AccountForm onSubmit={onSubmit} id={id} disabled={isPending} defaultValues={defaultValues} onDelete={() => deleteMutation.mutate()}/>
                )}
               
            </SheetContent>
        </Sheet>
        </>
    )
}