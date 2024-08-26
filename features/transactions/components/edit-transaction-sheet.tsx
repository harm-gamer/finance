import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useOpenTransaction } from "../hooks/use-open-transaction";
import { TransactionForm } from "./transaction-form";
import { insertTransactionSchema } from "@/db/schema";
import { z } from "zod";
import { useCreateTransaction } from "../api/use-create-transaction";
import { useGetTransaction } from "../api/use-get-transaction";
import { Loader2 } from "lucide-react";
import { useEditTransaction } from "../api/use-edit-transacton";
import { useDeleteTransaction } from "../api/use-delete-transaction";
import { useConfirm } from "@/hooks/use-confirm";
import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { useCreateCategories } from "@/features/categories/api/use-create-categories";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useCreateAccount } from "@/features/accounts/api/use-create-account";
const formSchema = insertTransactionSchema.omit({
    id : true
})
type FormValues = z.input<typeof formSchema>;
export const EditTransactionSheet = () =>{
    const {isOpen,onClose,id} = useOpenTransaction();
    const[ConfirmationDialog, confirm] = useConfirm(
        "Are you sure",
        "you are about to delete transaction"
    )
 
    const transactionQuery = useGetTransaction(id)
    const editMutaion  = useEditTransaction(id)
    const deleteMutation = useDeleteTransaction(id)
    const categoryQuery = useGetCategories();
       const categoryMutation = useCreateCategories();
       const onCreateCategory = (name: string) => categoryMutation.mutate({
        name
       })
       const categoryOPtions = (categoryQuery.data ??[]).map((category) =>({
        label : category.name,
        value : category.id
       }))

       const accountQuery = useGetAccounts();
       const accountMutation = useCreateAccount();
       const onCreateAccount = (name: string) => accountMutation.mutate({
        name
       })
       const accountOPtions = (accountQuery.data ??[]).map((account) =>({
        label : account.name,
        value : account.id
       }))
  
  
    const isLoading = transactionQuery.isLoading || categoryQuery.isLoading || accountQuery.isLoading;
    const isPending = editMutaion.isPending || deleteMutation.isPending || transactionQuery.isLoading || categoryMutation.isPending || accountMutation.isPending;
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

    const defaultValues = transactionQuery.data?{
       accountId : transactionQuery.data.accountId,
       categoryId : transactionQuery.data.categoryId,
       amount : transactionQuery.data.amount.toString(),
       date: transactionQuery.data.date? new Date(transactionQuery.data.date) : new Date(),
       payee : transactionQuery.data.payee,
       notes : transactionQuery.data.notes,
    }:{
        accountId : "",
        categoryId : "",
        amount : "",
        date: new Date(),
        payee : "",
        notes : "",
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
                        Edit an existing transactions.
                    </SheetDescription>
                </SheetHeader>
                {isLoading ?(
                    <div className="absolute insert-0 flex items-center justify-center">
                        <Loader2 className="size-4 text-muted-foreground animate-spin"/>
                    </div>
                ):(
                    <TransactionForm
                     id={id} 
                     defaultValues={defaultValues}
                    onSubmit={onSubmit}
                    onDelete={onDelete}
                      disabled={isPending}
                       categoryOptions={categoryOPtions}
                       onCreateAccount={onCreateAccount}
                       accountOptions={accountOPtions}
                       onCreateCategory={onCreateCategory}
                        
                        />
                )}
               
            </SheetContent>
        </Sheet>
        </>
    )
}